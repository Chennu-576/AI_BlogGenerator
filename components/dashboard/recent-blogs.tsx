
// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { MoreHorizontal, Edit, Trash2, Eye, FileText } from 'lucide-react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import blogService from '@/lib/blog-service'
// import { useAuth } from '@/hooks/use-auth'
// import { toast } from 'react-hot-toast'
// import { formatDistanceToNow } from 'date-fns'

// export function RecentBlogs() {
//   const [blogs, setBlogs] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const { user } = useAuth()

//   useEffect(() => {
//     const loadBlogs = async () => {
//       if (!user?.id) {
//         setLoading(false)
//         return
//       }

//       try {
//         const { data, error } = await blogService.getBlogs(user.id)
//         if (error) {
//           console.error('Error loading blogs:', error)
//         } else if (data) {
//           setBlogs(data.slice(0, 5))
//         }
//       } catch (err) {
//         console.error('Exception loading blogs:', err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadBlogs()
//   }, [user])

//   const handleDelete = async (blogId: string) => {
//     if (!user?.id) return

//     if (confirm('Are you sure you want to delete this blog?')) {
//       try {
//         const { error } = await blogService.deleteBlog(blogId, user.id)
//         if (!error) {
//           setBlogs(blogs.filter(b => b.id !== blogId))
//           toast.success('Blog deleted successfully')
//         } else {
//           console.error('Delete error:', error)
//           toast.error('Error deleting blog')
//         }
//       } catch (err) {
//         console.error('Delete exception:', err)
//         toast.error('Error deleting blog')
//       }
//     }
//   }

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Blogs</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="p-4 border rounded-lg space-y-2">
//                 <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
//                 <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0">
//         <CardTitle>Recent Blogs</CardTitle>
//         <Link href="/dashboard/blogs">
//           <Button variant="outline" size="sm">View All</Button>
//         </Link>
//       </CardHeader>
//       <CardContent>
//         {blogs.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
//             <p className="mb-2">No blogs yet. Create your first blog to get started!</p>
//             <Link href="/dashboard/create">
//               <Button>Create Blog</Button>
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {blogs.map((blog) => (
//               <div key={blog.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Link href={`/dashboard/blogs/${blog.id}`}>
//                       <h3 className="font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer">
//                         {blog.title}
//                       </h3>
//                     </Link>
//                     <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
//                       {blog.status}
//                     </Badge>
//                   </div>
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <span>{blog.word_count?.toLocaleString() || 0} words</span>
//                     <span>SEO: {blog.seo_score || 0}/10</span>
//                     <span>{formatDistanceToNow(new Date(blog.created_at))} ago</span>
//                   </div>
//                 </div>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm">
//                       <MoreHorizontal className="w-4 h-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem asChild>
//                       <Link href={`/dashboard/blogs/${blog.id}`}>
//                         <Eye className="w-4 h-4 mr-2" />
//                         View
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href={`/dashboard/blogs/${blog.id}/edit`}>
//                         <Edit className="w-4 h-4 mr-2" />
//                         Edit
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem 
//                       onClick={() => handleDelete(blog.id)}
//                       className="text-red-600"
//                     >
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2, Eye, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import blogService from '@/lib/blog-service'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function RecentBlogs() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.id) return setLoading(false)

    const loadBlogs = async () => {
      try {
        const { data, error } = await blogService.getBlogs(user.id)
        if (error) {
          console.error('Error loading blogs:', error)
          toast.error('Failed to load blogs')
        } else {
          setBlogs(data?.slice(0, 5) || [])
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

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const { error } = await blogService.deleteBlog(id, user.id)
      if (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete blog')
      } else {
        setBlogs(blogs.filter(b => b.id !== id))
        toast.success('Blog deleted')
      }
    } catch (err) {
      console.error('Delete exception:', err)
      toast.error('Failed to delete blog')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Recent Blogs</CardTitle>
        <Link href="/dashboard/blogs">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {blogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">No blogs yet. Create your first blog to get started!</p>
            <Link href="/dashboard/create">
              <Button>Create Blog</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {blogs.map(blog => (
              <div key={blog.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/dashboard/blogs/${blog.id}`}>
                      <h3 className="font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer">
                        {blog.title}
                      </h3>
                    </Link>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{blog.word_count?.toLocaleString() || 0} words</span>
                    <span>SEO: {blog.seo_score || 0}/10</span>
                    <span>{formatDistanceToNow(new Date(blog.created_at))} ago</span>
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
                    <DropdownMenuItem onClick={() => handleDelete(blog.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
