'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Edit, Trash2, Eye, Plus, Search, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import blogService from '@/lib/blog-service'
import { useAuth } from '@/hooks/use-auth'
import { Database } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

type Blog = Database['public']['Tables']['blogs']['Row']

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const { user } = useAuth()

  useEffect(() => {
    const loadBlogs = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const result = await blogService.getBlogs(user.id)
        console.log('Blog service result:', result)

        const blogsData = result?.data ?? []
        const blogsError = result?.error

        if (blogsError && Object.keys(blogsError).length > 0) {
          console.error('Error loading blogs:', blogsError)
          toast.error('Failed to load blogs')
        } else {
          setBlogs(blogsData)
          setFilteredBlogs(blogsData)
        }
      } catch (err) {
        console.error('Exception loading blogs:', err)
        toast.error('Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [user])

  // Filter blogs by search and status
  useEffect(() => {
    let filtered = blogs

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter)
    }

    setFilteredBlogs(filtered)
  }, [blogs, searchTerm, statusFilter])

  const handleDelete = async (blogId: string) => {
    if (!user?.id) return

    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const { error } = await blogService.deleteBlog(blogId, user.id)
        if (!error) {
          setBlogs(prev => prev.filter(b => b.id !== blogId))
          toast.success('Blog deleted successfully')
        } else {
          toast.error('Error deleting blog')
        }
      } catch (err) {
        toast.error('Error deleting blog')
      }
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts</p>
          </div>
          <Link href="/dashboard/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Blog
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'published'].map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status as 'all' | 'draft' | 'published')}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog List */}
        {filteredBlogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {blogs.length === 0 ? 'No blogs yet' : 'No blogs found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {blogs.length === 0 
                  ? 'Create your first blog to get started!' 
                  : 'Try adjusting your search or filters'
                }
              </p>
              {blogs.length === 0 && (
                <Link href="/dashboard/create">
                  <Button>Create Your First Blog</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredBlogs.map(blog => (
              <Card key={blog.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/dashboard/blogs/${blog.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate">
                            {blog.title}
                          </h3>
                        </Link>
                        <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                          {blog.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {blog.content.replace(/[#*]/g, '').substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{blog.word_count.toLocaleString()} words</span>
                        <span>SEO Score: {blog.seo_score}/10</span>
                        <span>Created {formatDistanceToNow(new Date(blog.created_at))} ago</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/blogs/${blog.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
