'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import  blogService  from '@/lib/blog-service'
import { useAuth } from '@/hooks/use-auth'
import { Database } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type Blog = Database['public']['Tables']['blogs']['Row']

export default function BlogEditPage() {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'published'
  })
  
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
        if (data && !error) {
          setBlog(data)
          setFormData({
            title: data.title,
            content: data.content,
            status: data.status
          })
        } else if (error) {
          console.error('Error loading blog:', error)
          toast.error('Blog is loading')
          router.push('/dashboard/blogs')
        }
      } catch (error) {
        console.error('Exception loading blog:', error)
        toast.error('loading.....')
        router.push('/dashboard/blogs')
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [user, blogId, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id || !blog) return
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    
    try {
      // Calculate new word count
      const wordCount = formData.content.trim().split(/\s+/).length
      
      const { data, error } = await blogService.updateBlog(blog.id, {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        word_count: wordCount
      })
      
      if (data && !error) {
        setBlog(data)
        toast.success('Blog updated successfully')
        router.push(`/dashboard/blogs/${blog.id}`)
      } else {
        toast.error('Error updating blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      toast.error('Error updating blog')
    } finally {
      setSaving(false)
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
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-64 bg-gray-200 rounded animate-pulse" />
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog founds</h1>
          <p className="text-gray-600 mb-4">{"It's loading time"}.</p>
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
            <Link href={`/dashboard/blogs/${blog.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/blogs/${blog.id}`}>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter blog title..."
                    required
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') => 
                      setFormData({ ...formData, status: value })
                    }
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog content here..."
                  required
                  disabled={saving}
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500">
                  Word count: {formData.content.trim().split(/\s+/).filter(word => word.length > 0).length}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Link href={`/dashboard/blogs/${blog.id}`}>
                  <Button type="button" variant="outline" disabled={saving}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}