'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { BlogGeneratorForm } from '@/components/blog/blog-generator-form'
import { Suspense } from 'react'

export default function CreateBlogPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog</h1>
          <p className="text-gray-600">Generate high-quality, SEO-optimized content with AI</p>
        </div>
         <Suspense fallback={<div>Loading form...</div>}>
          <BlogGeneratorForm />
        </Suspense>
        
        <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-6">
          <p>💡 <strong>Pro Tip:</strong> Be specific with your topic and keywords for better results.</p>
          <p>Our AI will create engaging content optimized for search engines and your audience.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}