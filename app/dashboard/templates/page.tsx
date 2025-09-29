'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Star, 
  List, 
  Megaphone, 
  BookOpen, 
  ShoppingCart,
  Lightbulb,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

const templates = [
  {
    id: 'product-review',
    name: 'Product Review',
    description: 'Comprehensive product analysis with pros, cons, and recommendations',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    features: ['Rating system', 'Feature analysis', 'Comparison tables', 'Buy recommendations'],
    popular: true
  },
  {
    id: 'listicle',
    name: 'Listicle',
    description: 'Engaging list-based content that drives traffic and shares',
    icon: List,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: ['Numbered lists', 'Visual hierarchy', 'Scannable format', 'Social media ready'],
    popular: true
  },
  {
    id: 'press-release',
    name: 'Press Release',
    description: 'Professional announcements for media distribution',
    icon: Megaphone,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: ['Media format', 'Quote integration', 'Contact info', 'Distribution ready']
  },
  {
    id: 'how-to-guide',
    name: 'How-to Guide',
    description: 'Step-by-step tutorials and instructional content',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: ['Step breakdown', 'Visual aids', 'Troubleshooting', 'Beginner friendly']
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Detailed analysis of success stories and results',
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    features: ['Problem analysis', 'Solution details', 'Results metrics', 'Lessons learned']
  },
  {
    id: 'comparison',
    name: 'Comparison Post',
    description: 'Side-by-side analysis of products, services, or concepts',
    icon: ShoppingCart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    features: ['Feature comparison', 'Pros and cons', 'Price analysis', 'Final verdict']
  },
  {
    id: 'thought-leadership',
    name: 'Thought Leadership',
    description: 'Industry insights and expert perspectives',
    icon: Lightbulb,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    features: ['Industry trends', 'Expert insights', 'Future predictions', 'Opinion pieces']
  },
  {
    id: 'news-analysis',
    name: 'News Analysis',
    description: 'In-depth commentary on current events and trends',
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    features: ['Current events', 'Impact analysis', 'Context', 'Future implications']
  }
]

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Templates</h1>
          <p className="text-gray-600">Choose from our pre-built templates to create targeted content faster</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <Card key={template.id} className="relative hover:shadow-lg transition-shadow">
                {template.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600">
                    Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${template.bgColor} mb-4`}>
                    <Icon className={`w-6 h-6 ${template.color}`} />
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Features:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={`/dashboard/create?template=${template.id}`}>
                    <Button className="w-full">
                      Use Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Need a Custom Template?</h2>
            <p className="text-blue-100 mb-6">
              {"Can't find the perfect template? Our AI can adapt to any style or format you need."} 
              Just describe your requirements in the topic field.
            </p>
            <Link href="/dashboard/create">
              <Button variant="secondary" className="text-purple-600">
                Create Custom Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}