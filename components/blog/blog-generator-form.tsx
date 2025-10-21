
'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, FileText, Target, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BlogGeneratorFormProps {
  onBlogGenerated?: (blog: any) => void
}

const templates = [
  { id: 'general', name: 'General Article', description: 'Standard blog post format' },
  { id: 'product-review', name: 'Product Review', description: 'Detailed product analysis' },
  { id: 'listicle', name: 'Listicle', description: 'List-based content' },
  { id: 'press-release', name: 'Press Release', description: 'Company announcements' },
  { id: 'how-to', name: 'How-to Guide', description: 'Step-by-step tutorials' },
]

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Dutch', 'Russian', 'Japanese', 'Korean', 'Chinese (Simplified)',
  'Chinese (Traditional)', 'Arabic', 'Hindi', 'Bengali', 'Tamil',
  'Telugu', 'Marathi', 'Gujarati', 'Punjabi'
]

export function BlogGeneratorForm({ onBlogGenerated }: BlogGeneratorFormProps) {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <InnerForm onBlogGenerated={onBlogGenerated} />
    </Suspense>
  )
}

function InnerForm({ onBlogGenerated }: BlogGeneratorFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    topic: '',
    companyName: '',
    template: 'general',
    language: 'English',
    keywords: '',
    tone: 'professional',
    wordCount: '800',
    sampleBlog: '',
    companyUrl: ''
  })

  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
  const cleanBackendUrl = backendUrl?.replace(/\/$/, '')

  // Apply template from URL param
  useEffect(() => {
    const templateParam = searchParams.get('template')
    if (templateParam && templates.find(t => t.id === templateParam)) {
      setFormData(prev => ({ ...prev, template: templateParam }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isGenerating) return
    if (loading) return
    if (!user) {
      toast.error('Please log in to generate blogs')
      return
    }
    if (!formData.topic.trim()) {
      toast.error('Please enter a blog topic')
      return
    }

    setError(null)
    setIsGenerating(true)

    try {
      console.log('Calling backend:', cleanBackendUrl)
      const response = await fetch(`${cleanBackendUrl}/generate-blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          company_name: formData.companyName,
          template: formData.template,
          language: formData.language,
          keywords: formData.keywords
            ? formData.keywords.split(',').map(k => k.trim())
            : [],
          tone: formData.tone,
          user_id: user?.id || null,
          word_count: parseInt(formData.wordCount),
          sample_blog: formData.sampleBlog || null,
          company_url: formData.companyUrl || null
        })
      })

      if (!response.ok) {
        setError('Server is warming up... wait for 5 mins. Please click "Generate Blog" again. This usually works on the second attempt.')
        toast('Please try once more after 2 mins - server is starting up')
      return
    
      }

      const generatedBlog = await response.json()
      console.log('Generated blog:', generatedBlog)
      if (!generatedBlog || !generatedBlog.id) {
        setError('Blog was generated but there was a small issue. Please try again.')
        return
      }
      toast.success('Blog generated successfully!')

      if (onBlogGenerated) onBlogGenerated(generatedBlog)
      else router.push(`/dashboard/blogs/${generatedBlog.id}`)

    } catch (err) {
      console.error('Error generating blog:', err)
      const message =  'First attempt may take longer due to server startup. Please click "Generate Blog" again.'
      setError(message)
      toast(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" /> AI Blog Generator
        </CardTitle>
        <CardDescription>Create SEO-optimized blog content with AI</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <br />
              <span className="text-sm text-amber-600 mt-1 block">
        💡        This is normal on free hosting - just try again!
              </span>

            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="topic">Blog Topic *</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Enter your blog topic..."
                required
                disabled={isGenerating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Optional"
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="SEO, blog, marketing"
              disabled={isGenerating}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={formData.template}
                onValueChange={val => setFormData({ ...formData, template: val })}
                disabled={isGenerating}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={formData.language}
                onValueChange={val => setFormData({ ...formData, language: val })}
                disabled={isGenerating}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select
                value={formData.tone}
                onValueChange={val => setFormData({ ...formData, tone: val })}
                disabled={isGenerating}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Word Count</Label>
              <Select
                value={formData.wordCount}
                onValueChange={val => setFormData({ ...formData, wordCount: val })}
                disabled={isGenerating}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">500 words</SelectItem>
                  <SelectItem value="800">800 words</SelectItem>
                  <SelectItem value="1200">1,200 words</SelectItem>
                  <SelectItem value="1500">1,500 words</SelectItem>
                  <SelectItem value="2000">2,000 words</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />AI-Generated</Badge>
            <Badge variant="secondary"><Target className="w-3 h-3 mr-1" />SEO-Optimized</Badge>
          </div>

          <Button type="submit" disabled={isGenerating || !formData.topic.trim()} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Blog...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Blog
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
