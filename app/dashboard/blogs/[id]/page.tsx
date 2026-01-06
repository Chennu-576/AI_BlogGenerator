'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Eye, Calendar, FileText, Target } from 'lucide-react'
import blogService  from '@/lib/blog-service'
import { useAuth } from '@/hooks/use-auth'
import { Database } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow, format } from 'date-fns'

type Blog = Database['public']['Tables']['blogs']['Row']

export default function BlogViewPage() {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const blogId = params.id as string

  useEffect(() => {
    const loadBlog = async () => {
      if (!user?.id || !blogId) {
        setLoading(false)
        return
      }
      
      try {
        const { data, error } = await blogService.getBlog(blogId, user.id)
        if (error) {
        // Real Supabase error
        console.error('Error loading blog:', error)
        toast.error('Failed to load blog')
        router.push('/dashboard/blogs')
        return
      }

      if (!data) {
        // Blog not found (normal case)
        toast.error('Blog not found')
        router.push('/dashboard/blogs')
        return
      }

      // Blog found → set state
      setBlog(data)
    } catch (error) {
      // Unexpected JS error
      console.error('Exception loading blog:', error)
      toast.error('Failed to load blog')
      router.push('/dashboard/blogs')
    } finally {
      setLoading(false)
    }
  }
    //     if (data && !error) {
    //       setBlog(data)
    //     } else if (error) {
    //       console.error('Error loading blog:', error)
    //       toast.error('Blog not found')
    //       router.push('/dashboard/blogs')
    //     }
    //   } catch (error) {
    //     console.error('Exception loading blog:', error)
    //     toast.error('Failed to load blog')
    //     router.push('/dashboard/blogs')
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    loadBlog()
  }, [user, blogId, router])

  const handleDelete = async () => {
    if (!user?.id || !blog) return
    
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const { error } = await blogService.deleteBlog(blog.id, user.id)
        if (!error) {
          toast.success('Blog deleted successfully')
          router.push('/dashboard/blogs')
        } else {
          toast.error('Error deleting blog')
        }
      } catch (error) {
        toast.error('Error deleting blog')
      }
    }
  }

  // const handleStatusToggle = async () => {
  //   if (!user?.id || !blog) return
    
  //   const newStatus = blog.status === 'published' ? 'draft' : 'published'
    
  //   try {
  //     const { data, error } = await blogService.updateBlog(blog.id, { status: newStatus })
  //     if (data && !error) {
  //       setBlog(data)
  //       toast.success(`Blog ${newStatus === 'published' ? 'published' : 'saved as draft'}`)
  //     } else {
  //       toast.error('Error updating blog status')
  //     }
  //   } catch (error) {
  //     toast.error('Error updating blog status')
  //   }
  // }

  const handleStatusToggle = async () => {
  if (!user?.id || !blog) return

  const newStatus = blog.status === 'published' ? 'draft' : 'published'

  try {
    const updatedBlog = await blogService.updateBlog(blog.id, {
      status: newStatus
    })

    setBlog(updatedBlog)
    toast.success(
      newStatus === 'published'
        ? 'Blog published'
        : 'Saved as draft'
    )
  } catch (error) {
    console.error('Error updating blog status:', error)
    toast.error('Error updating blog status')
  }
}


  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
          </div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!blog) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blogs found</h1>
          <p className="text-gray-600 mb-4">{"blogs are loading wait a sec"}.</p>
          <Link href="/dashboard/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/blogs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleStatusToggle}
            >
              {blog.status === 'published' ? 'Save as Draft' : 'Publish'}
            </Button>
            <Link href={`/dashboard/blogs/${blog.id}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Blog Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Word Count</p>
                  <p className="font-semibold">{blog.word_count.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">SEO Score</p>
                  <p className="font-semibold">{blog.seo_score}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                    {blog.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-semibold text-sm">
                    {formatDistanceToNow(new Date(blog.created_at))} ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Content */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{blog.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Created on {format(new Date(blog.created_at), 'PPP')}</span>
                  {blog.updated_at && (
                    <span>Updated {formatDistanceToNow(new Date(blog.updated_at))} ago</span>
                  )}
                </div>
              </div>
              <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                {blog.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content
                    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3 mt-5">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2 mt-4">$1</h3>')
                    .replace(/^\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
                    .replace(/^\*(.*?)\*/gm, '<em>$1</em>')
                    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
                    .replace(/<p class="mb-4">(<h[1-6])/g, '$1')
                    .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}