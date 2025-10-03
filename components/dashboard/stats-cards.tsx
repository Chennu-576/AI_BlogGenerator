
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, TrendingUp, Eye, Target } from 'lucide-react'
import blogService from '@/lib/blog-service'
import { useAuth } from '@/hooks/use-auth'

interface Stats {
  totalBlogs: number
  publishedBlogs: number
  totalWords: number
  avgSeoScore: number
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const loadStats = async () => {
      setLoading(true)
      try {
        const { data, error } = await blogService.getStats(user.id)
        if (error) {
          console.error('Error loading stats:', error)
        } else {
          setStats(data)
        }
      } catch (err) {
        console.error('Exception loading stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  const statCards = [
    {
      title: 'Total Blogs',
      value: stats?.totalBlogs || 0,
      description: '+12% from last month',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Published',
      value: stats?.publishedBlogs || 0,
      description: `${
        stats?.totalBlogs ? Math.round((stats.publishedBlogs / stats.totalBlogs) * 100) : 0
      }% publish rate`,
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Word Count',
      value: (stats?.totalWords || 0).toLocaleString(),
      description: 'Across all blogs',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Avg SEO Score',
      value: `${stats?.avgSeoScore || 0}/10`,
      description: 'SEO optimization',
      icon: Target,
      color: 'text-orange-600'
    }
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex justify-between pb-2 space-y-0">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
