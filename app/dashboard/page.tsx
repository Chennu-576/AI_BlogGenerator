
'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import StatsCards from '@/components/dashboard/stats-cards'
import RecentBlogs from '@/components/dashboard/recent-blogs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        Loading your dashboard...
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.user_metadata?.username || 'User'}! Here&apos;s your blog overview.
            </p>
          </div>
          <Link href="/dashboard/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Blog
            </Button>
          </Link>
        </div>

        <StatsCards />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentBlogs />
          </div>
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Quick Start</h3>
              <p className="text-blue-100 mb-4">Generate your first AI blog in minutes</p>
              <Link href="/dashboard/create">
                <Button variant="secondary" className="text-purple-600">
                  Get Started
                </Button>
              </Link>
            </div>
            
            {/* Templates */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Popular Templates</h3>
              <div className="space-y-2">
                <Link href="/dashboard/templates?type=product-review">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    📝 Product Review
                  </Button>
                </Link>
                <Link href="/dashboard/templates?type=listicle">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    📋 Listicle
                  </Button>
                </Link>
                <Link href="/dashboard/templates?type=press-release">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    📢 Press Release
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
