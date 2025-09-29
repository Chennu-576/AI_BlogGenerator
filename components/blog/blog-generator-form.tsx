

// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Badge } from '@/components/ui/badge'
// import { Loader2, Sparkles, FileText, Target, AlertCircle } from 'lucide-react'
// import { toast } from 'react-hot-toast'
// import { useRouter } from 'next/navigation'
// import { blogService } from '@/lib/blog-service'
// import { useAuth } from '@/hooks/use-auth'
// import { Alert, AlertDescription } from '@/components/ui/alert'

// interface BlogGeneratorFormProps {
//   onBlogGenerated?: (blog: any) => void
// }

// const templates = [
//   { id: 'general', name: 'General Article', description: 'Standard blog post format' },
//   { id: 'product-review', name: 'Product Review', description: 'Detailed product analysis' },
//   { id: 'listicle', name: 'Listicle', description: 'List-based content' },
//   { id: 'press-release', name: 'Press Release', description: 'Company announcements' },
//   { id: 'how-to', name: 'How-to Guide', description: 'Step-by-step tutorials' },
// ]

// const languages = [
//   'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 
//   'Russian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)',
//   'Arabic', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi'
// ]

// export function BlogGeneratorForm({ onBlogGenerated }: BlogGeneratorFormProps) {
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [formData, setFormData] = useState({
//     topic: '',
//     companyName: '',
//     template: 'general',
//     language: 'English',
//     keywords: '',
//     tone: 'professional',
//     wordCount: '800'
//   })
  
//   const { user } = useAuth()
//   const router = useRouter()

//   // Check if FastAPI URL is configured
//   useEffect(() => {
//     if (!process.env.NEXT_PUBLIC_FASTAPI_URL) {
//       setError('FastAPI backend URL is not configured. Please check your environment variables.')
//     }
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log('Form submitted with data:', formData)
    
//     if (!user?.id) return
    
//     // Validate required fields
//     if (!formData.topic.trim()) {
//       toast.error('Please enter a blog topic')
//       return
//     }

//     setError(null)

//     setIsGenerating(true)
    
//     try {
//       const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'
//       console.log('Calling FastAPI at:', `${fastApiUrl}/generate-blog`)
      
//       const requestBody = {
//         topic: formData.topic,
//         company_name: formData.companyName || null,
//         template: formData.template,
//         language: formData.language,
//         keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
//         tone: formData.tone,
//         word_count: parseInt(formData.wordCount)
//       }
      
//       console.log('Request body:', requestBody)
      
//       // Call FastAPI backend to generate blog
//       const response = await fetch(`${fastApiUrl}/generate-blog`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       })

//       console.log('Response status:', response.status)
      
//       if (!response.ok) {
//         const errorText = await response.text()
//         console.error('FastAPI error:', errorText)
//         throw new Error(`Failed to generate blog: ${response.status} ${response.statusText}`)
//       }

//       const generatedBlog = await response.json()
//       console.log('Generated blog:', generatedBlog)

//       // Save blog to Supabase
//       const { data: blog, error } = await blogService.createBlog({
//         user_id: user.id,
//         title: generatedBlog.title,
//         content: generatedBlog.content,
//         word_count: generatedBlog.word_count,
//         seo_score: generatedBlog.seo_score,
//         status: 'draft'
//       })

//       if (error) {
//         console.error('Supabase error:', error)
//         throw new Error('Failed to save blog')
//       }

//       toast.success('Blog generated successfully!')
      
//       if (onBlogGenerated) {
//         onBlogGenerated(blog)
//       } else {
//         router.push(`/dashboard/blogs/${blog.id}`)
//       }
      
//     } catch (error) {
//       console.error('Error generating blog:', error)
//       const errorMessage = error instanceof Error ? error.message : 'Failed to generate blog. Please try again.'
//       setError(errorMessage)
//       toast.error(errorMessage)
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Sparkles className="w-5 h-5 text-blue-600" />
//           AI Blog Generator
//         </CardTitle>
//         <CardDescription>
//           Create SEO-optimized blog content with artificial intelligence
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {error && (
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="topic">Blog Topic *</Label>
//               <Input
//                 id="topic"
//                 placeholder="Enter your blog topic..."
//                 value={formData.topic}
//                 onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
//                 required
//                 disabled={isGenerating}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="companyName">Company Name</Label>
//               <Input
//                 id="companyName"
//                 placeholder="Your company name"
//                 value={formData.companyName}
//                 onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                 disabled={isGenerating}
//               />
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label>Template</Label>
//               <Select
//                 value={formData.template}
//                 onValueChange={(value) => setFormData({ ...formData, template: value })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {templates.map((template) => (
//                     <SelectItem key={template.id} value={template.id}>
//                       <div>
//                         <div className="font-medium">{template.name}</div>
//                         <div className="text-sm text-gray-500">{template.description}</div>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Language</Label>
//               <Select
//                 value={formData.language}
//                 onValueChange={(value) => setFormData({ ...formData, language: value })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {languages.map((language) => (
//                     <SelectItem key={language} value={language}>
//                       {language}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="keywords">Keywords (comma-separated)</Label>
//             <Input
//               id="keywords"
//               placeholder="SEO, blog writing, content marketing"
//               value={formData.keywords}
//               onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
//               disabled={isGenerating}
//             />
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label>Tone</Label>
//               <Select
//                 value={formData.tone}
//                 onValueChange={(value) => setFormData({ ...formData, tone: value })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="professional">Professional</SelectItem>
//                   <SelectItem value="casual">Casual</SelectItem>
//                   <SelectItem value="friendly">Friendly</SelectItem>
//                   <SelectItem value="authoritative">Authoritative</SelectItem>
//                   <SelectItem value="conversational">Conversational</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Target Word Count</Label>
//               <Select
//                 value={formData.wordCount}
//                 onValueChange={(value) => setFormData({ ...formData, wordCount: value })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="500">500 words</SelectItem>
//                   <SelectItem value="800">800 words</SelectItem>
//                   <SelectItem value="1200">1,200 words</SelectItem>
//                   <SelectItem value="1500">1,500 words</SelectItem>
//                   <SelectItem value="2000">2,000 words</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Badge variant="secondary">
//               <FileText className="w-3 h-3 mr-1" />
//               AI-Generated
//             </Badge>
//             <Badge variant="secondary">
//               <Target className="w-3 h-3 mr-1" />
//               SEO-Optimized
//             </Badge>
//           </div>

//           <Button 
//             type="submit" 
//             className="w-full" 
//             disabled={isGenerating || !formData.topic.trim()}
//           >
//             {isGenerating ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Generating Blog...
//               </>
//             ) : (
//               <>
//                 <Sparkles className="mr-2 h-4 w-4" />
//                 Generate Blog
//               </>
//             )}
//           </Button>
          
//           {isGenerating && (
//             <div className="text-center text-sm text-gray-500">
//               <p>This may take 30-60 seconds. Please don't close this page.</p>
//             </div>
//           )}
//         </form>
//       </CardContent>
//     </Card>
//   )
// }


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
import  blogService from '@/lib/blog-service'
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
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 
  'Russian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)',
  'Arabic', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi'
]

export function BlogGeneratorForm({ onBlogGenerated }: BlogGeneratorFormProps) {
   return (
    <Suspense fallback={<div>Loading form...</div>}>
      <InnerForm onBlogGenerated={onBlogGenerated} />
    </Suspense>
  )
}

// ✅ keep logic here (still one file, just a small inner component)
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
    wordCount: '800'
  })
  
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
 

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

  // Set template from URL params
  useEffect(() => {
    const templateParam = searchParams.get('template')
    if (templateParam && templates.find(t => t.id === templateParam)) {
      setFormData(prev => ({ ...prev, template: templateParam }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

     if (isGenerating) return    
if (loading) return <p>Loading...</p>
    // if (!user?.id) {
    //   toast.error('Please log in to generate blogs')
    //   return
    // }
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
      console.log('Starting blog generation...')
      console.log("Backend URL 👉", backendUrl);


      // Call FastAPI backend
      const response = await fetch(`${backendUrl}/generate-blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          company_name: formData.companyName,
          template: formData.template,
          language: formData.language,
          keywords: formData.keywords
        ? formData.keywords.split(",").map(k => k.trim())
        : [],
          tone: formData.tone,
          user_id: user?.id || null, 
          word_count: parseInt(formData.wordCount)
          
        })
      })

      // if (!response.ok) {
      //   throw new Error('loading')
      // }

      const generatedBlog = await response.json()
      console.log('Generated +Saved blog:', generatedBlog)

      toast.success('Blog generated successfully!')

      if (onBlogGenerated) {
        onBlogGenerated(generatedBlog)
      } else {
        router.push(`/dashboard/blogs/${generatedBlog.id}`)
      }

    } catch (error) {
      console.error('Error generating blog:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate blog. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI Blog Generator
        </CardTitle>
        <CardDescription>
          Create SEO-optimized blog content with artificial intelligence
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="topic">Blog Topic *</Label>
              <Input
                id="topic"
                placeholder="Enter your blog topic..."
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                disabled={isGenerating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Your company name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={formData.template}
                onValueChange={(value) => setFormData({ ...formData, template: value })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="SEO, blog writing, content marketing"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              disabled={isGenerating}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select
                value={formData.tone}
                onValueChange={(value) => setFormData({ ...formData, tone: value })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
              <Label>Target Word Count</Label>
              <Select
                value={formData.wordCount}
                onValueChange={(value) => setFormData({ ...formData, wordCount: value })}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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

          <div className="flex gap-2">
            <Badge variant="secondary">
              <FileText className="w-3 h-3 mr-1" />
              AI-Generated
            </Badge>
            <Badge variant="secondary">
              <Target className="w-3 h-3 mr-1" />
              SEO-Optimized
            </Badge>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isGenerating || !formData.topic.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Blog...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Blog
              </>
            )}
          </Button>
          
          {isGenerating && (
            <div className="text-center text-sm text-gray-500">
              <p>{"This may take 30-60 seconds. Please don't close this page."}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

