
// 'use client'

// import { useState, useEffect, Suspense } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Badge } from '@/components/ui/badge'
// import { Loader2, Sparkles, FileText, Target, AlertCircle } from 'lucide-react'
// import { toast } from 'react-hot-toast'
// import { useRouter, useSearchParams } from 'next/navigation'
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
//   'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
//   'Dutch', 'Russian', 'Japanese', 'Korean', 'Chinese (Simplified)',
//   'Chinese (Traditional)', 'Arabic', 'Hindi', 'Bengali', 'Tamil',
//   'Telugu', 'Marathi', 'Gujarati', 'Punjabi'
// ]

// export function BlogGeneratorForm({ onBlogGenerated }: BlogGeneratorFormProps) {
//   return (
//     <Suspense fallback={<div>Loading form...</div>}>
//       <InnerForm onBlogGenerated={onBlogGenerated} />
//     </Suspense>
//   )
// }

// function InnerForm({ onBlogGenerated }: BlogGeneratorFormProps) {
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [formData, setFormData] = useState({
//     topic: '',
//     companyName: '',
//     template: 'general',
//     language: 'English',
//     keywords: '',
//     additionalDetails: '',
//     tone: 'professional',
//     wordCount: '800',
//     sampleBlog: '',
//     companyUrl: ''
//   })

//   const { user, loading } = useAuth()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-content-generator-1v33.onrender.com"
//   const cleanBackendUrl = backendUrl?.replace(/\/$/, '')

//   // Apply template from URL param
//   useEffect(() => {
//     const templateParam = searchParams.get('template')
//     if (templateParam && templates.find(t => t.id === templateParam)) {
//       setFormData(prev => ({ ...prev, template: templateParam }))
//     }
//   }, [searchParams])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (isGenerating) return
//     if (loading) return
//     if (!user) {
//       toast.error('Please log in to generate blogs')
//       return
//     }
//     if (!formData.topic.trim()) {
//       toast.error('Please enter a blog topic')
//       return
//     }

//     setError(null)
//     setIsGenerating(true)

//     try {
//       console.log('Calling backend:', cleanBackendUrl)
//       const response = await fetch(`${cleanBackendUrl}/generate-blog`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           topic: formData.topic,
//           company_name: formData.companyName,
//           template: formData.template,
//           language: formData.language,
//           keywords: formData.keywords
//             ? formData.keywords.split(',').map(k => k.trim())
//             : [],
//           tone: formData.tone,
//           user_id: user?.id || null,
//           word_count: parseInt(formData.wordCount),
//           sample_blog: formData.sampleBlog || null,
//           company_url: formData.companyUrl || null
//         })
//       })

//       if (!response.ok) {
//         setError('Server is warming up... wait for 5 mins. Please click "Generate Blog" again. This usually works on the second attempt.')
//         toast('Please try once more after 2 mins - server is starting up')
//       return
    
//       }

//       const generatedBlog = await response.json()
//       console.log('Generated blog:', generatedBlog)
//       if (!generatedBlog || !generatedBlog.id) {
//         setError('Blog was generated but there was a small issue. Please try again.')
//         return
//       }
//       toast.success('Blog generated successfully!')

//       if (onBlogGenerated) onBlogGenerated(generatedBlog)
//       else router.push(`/dashboard/blogs/${generatedBlog.id}`)

//     } catch (err) {
//       console.error('Error generating blog:', err)
//       const message =  'First attempt may take longer due to server startup. Please click "Generate Blog" again.'
//       setError(message)
//       toast(message)
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
 
  
//     <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
//       <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-3 text-2xl font-bold">
//               <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               AI Blog Generator
//             </CardTitle>
//             <CardDescription className="text-blue-100 mt-2 text-base">
//               Create SEO-optimized blog content with AI
//             </CardDescription>
//           </div>
//           <div className="flex gap-2">
//             <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
//               <FileText className="w-3 h-3 mr-1" />AI-Generated
//             </Badge>
//             <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
//               <Target className="w-3 h-3 mr-1" />SEO-Optimized
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-6">
//         {error && (
//           <Alert variant="destructive" className="mb-6 rounded-lg border-l-4 border-l-red-500 bg-red-50">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               {error}
//               <br />
//               <span className="text-sm text-amber-600 mt-1 block">
//                 💡 This is normal on free hosting - just try again!
//               </span>
//             </AlertDescription>
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="space-y-3">
//               <Label htmlFor="topic" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                 Blog Topic *
//               </Label>
//               <Input
//                 id="topic"
//                 value={formData.topic}
//                 onChange={e => setFormData({ ...formData, topic: e.target.value })}
//                 placeholder="Enter your blog topic..."
//                 required
//                 disabled={isGenerating}
//                 className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
//               />
//             </div>
//             <div className="space-y-3">
//               <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-600 rounded-full"></div>
//                 Company Name
//               </Label>
//               <Input
//                 id="companyName"
//                 value={formData.companyName}
//                 onChange={e => setFormData({ ...formData, companyName: e.target.value })}
//                 placeholder="Optional"
//                 disabled={isGenerating}
//                 className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
//               />
//             </div>
//           </div>

//           <div className="space-y-3">
//             <Label htmlFor="keywords" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//               <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
//               Keywords (comma-separated)
//             </Label>
//             <Input
//               id="keywords"
//               value={formData.keywords}
//               onChange={e => setFormData({ ...formData, keywords: e.target.value })}
//               placeholder="SEO, blog, marketing"
//               disabled={isGenerating}
//               className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
//             />
//           </div>
//           {/* ----------- Additional Details Textarea Here ----------- */}
//           <div className="space-y-3">
//             <Label htmlFor="additionalDetails" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//               <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
//               Additional Details
//             </Label>
//             <textarea
//               id="additionalDetails"
//               value={formData.additionalDetails}
//               onChange={e => setFormData({ ...formData, additionalDetails: e.target.value })}
//               placeholder="Enter any extra requirements, points, or references for blog generation..."
//               rows={4}
//               disabled={isGenerating}
//               className="w-full border border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-xl px-4 py-3 transition-all duration-200"
//             />
//           </div>
    

//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="space-y-3">
//               <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                 Template
//               </Label>
//               <Select
//                 value={formData.template}
//                 onValueChange={val => setFormData({ ...formData, template: val })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl">
//                   {templates.map(t => (
//                     <SelectItem key={t.id} value={t.id} className="py-3">
//                       <div className="font-medium">{t.name}</div>
//                       <div className="text-sm text-gray-500">{t.description}</div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-3">
//               <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
//                 Language
//               </Label>
//               <Select
//                 value={formData.language}
//                 onValueChange={val => setFormData({ ...formData, language: val })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl max-h-60">
//                   {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="space-y-3">
//               <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
//                 Tone
//               </Label>
//               <Select
//                 value={formData.tone}
//                 onValueChange={val => setFormData({ ...formData, tone: val })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-xl">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl">
//                   <SelectItem value="professional">Professional</SelectItem>
//                   <SelectItem value="casual">Casual</SelectItem>
//                   <SelectItem value="friendly">Friendly</SelectItem>
//                   <SelectItem value="authoritative">Authoritative</SelectItem>
//                   <SelectItem value="conversational">Conversational</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-3">
//               <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
//                 Word Count
//               </Label>
//               <Select
//                 value={formData.wordCount}
//                 onValueChange={val => setFormData({ ...formData, wordCount: val })}
//                 disabled={isGenerating}
//               >
//                 <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl">
//                   <SelectItem value="500">500 words</SelectItem>
//                   <SelectItem value="800">800 words</SelectItem>
//                   <SelectItem value="1200">1,200 words</SelectItem>
//                   <SelectItem value="1500">1,500 words</SelectItem>
//                   <SelectItem value="2000">2,000 words</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="pt-4 border-t border-gray-200">
//             <Button 
//               type="submit" 
//               disabled={isGenerating || !formData.topic.trim()} 
//               className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
//                   <span className="text-base">Generating Blog...</span>
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="mr-2 h-4 w-4" /> 
//                   <span className="text-base">Generate Blog</span>
//                 </>
//               )}
//             </Button>
//           </div>
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
import { useAuth } from '@/hooks/use-auth'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BlogGeneratorFormProps {
  onBlogGenerated?: (blog: any) => void
}

const templates = [
  { id: 'general', name: 'General Article', description: 'Standard blog post format' },
  // { id: 'product-review', name: 'Product Review', description: 'Detailed product analysis' },
  // { id: 'listicle', name: 'Listicle', description: 'List-based content' },
  // { id: 'press-release', name: 'Press Release', description: 'Company announcements' },
  // { id: 'how-to', name: 'How-to Guide', description: 'Step-by-step tutorials' },
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
    additionalDetails: '',
    tone: 'professional',
    wordCount: '800',
    sampleBlog: '',
    companyUrl: ''
  })

  // NEW: store uploaded image in state
  const [referenceImage, setReferenceImage] = useState<File | null>(null)

  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ai-content-generator-1v33.onrender.com'
  const cleanBackendUrl = backendUrl?.replace(/\/$/, '')

  // apply template from URL param
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

      // Build multipart/form-data payload (text + image file)
      const form = new FormData()
      form.append('topic', formData.topic)
      form.append('company_name', formData.companyName)
      form.append('template', formData.template)
      form.append('language', formData.language)
      form.append('tone', formData.tone)
      form.append('user_id', user?.id ?? '')
      form.append('word_count', formData.wordCount)
      form.append('sample_blog', formData.sampleBlog)
      form.append('company_url', formData.companyUrl)
      form.append('additional_details', formData.additionalDetails)

      // keywords: send as simple comma string; backend can split
      form.append('keywords', formData.keywords)

      // IMPORTANT: attach the image itself; backend will read `reference_image`
      if (referenceImage) {
        form.append('reference_image', referenceImage)
      }

      const response = await fetch(`${cleanBackendUrl}/generate-blog`, {
        method: 'POST',
        body: form, // browser sets Content-Type with boundary
      })

      if (!response.ok) {
        setError(
          'Server is warming up... wait for 5 mins. Please click "Generate Blog" again. This usually works on the second attempt.'
        )
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
      const message =
        'First attempt may take longer due to server startup. Please click "Generate Blog" again.'
      setError(message)
      toast(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              AI Blog Generator
            </CardTitle>
            <CardDescription className="text-blue-100 mt-2 text-base">
              Create SEO-optimized blog content with AI
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
              <FileText className="w-3 h-3 mr-1" />
              AI-Generated
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
              <Target className="w-3 h-3 mr-1" />
              SEO-Optimized
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {error && (
          <Alert className="mb-6 rounded-lg border-l-4 border-l-red-500 bg-red-50" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <br />
              <span className="text-sm text-amber-600 mt-1 block">
                💡 This is normal on free hosting - just try again!
              </span>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label
                htmlFor="topic"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                Blog Topic *
              </Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Enter your blog topic..."
                required
                disabled={isGenerating}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="companyName"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                Company Name
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Optional"
                disabled={isGenerating}
                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="keywords"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              Keywords (comma-separated)
            </Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="SEO, blog, marketing"
              disabled={isGenerating}
              className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
            />
          </div>

          {/* Additional details */}
          <div className="space-y-3">
            <Label
              htmlFor="additionalDetails"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              Additional Details
            </Label>
            <textarea
              id="additionalDetails"
              value={formData.additionalDetails}
              onChange={e => setFormData({ ...formData, additionalDetails: e.target.value })}
              placeholder="Enter any extra requirements, points, or references for blog generation..."
              rows={4}
              disabled={isGenerating}
              className="w-full border border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-xl px-4 py-3 transition-all duration-200"
            />
          </div>

          {/* NEW: reference image upload */}
          <div className="space-y-3">
            <Label
              htmlFor="referenceImage"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-sky-600 rounded-full" />
              Reference Image (jpg, jpeg, png)
            </Label>
            <Input
              id="referenceImage"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpg,image/jpeg,image/png"
              disabled={isGenerating}
              onChange={e => {
                const file = e.target.files?.[0] ?? null
                setReferenceImage(file)
              }}
              className="h-12 border-gray-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl
                         file:bg-sky-50 file:text-sky-700 file:border-0 file:mr-3
                         file:px-4 file:py-2 file:rounded-lg hover:file:bg-sky-100"
            />
            {referenceImage && (
              <p className="text-xs text-gray-500">
                Selected: {referenceImage.name} ({Math.round(referenceImage.size / 1024)} KB)
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Template
              </Label>
              <Select
                value={formData.template}
                onValueChange={val => setFormData({ ...formData, template: val })}
                disabled={isGenerating}
              >
                <SelectTrigger className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id} className="py-3">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-600 rounded-full" />
                Language
              </Label>
              <Select
                value={formData.language}
                onValueChange={val => setFormData({ ...formData, language: val })}
                disabled={isGenerating}
              >
                <SelectTrigger className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-60">
                  {languages.map(l => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full" />
                Tone
              </Label>
              <Select
                value={formData.tone}
                onValueChange={val => setFormData({ ...formData, tone: val })}
                disabled={isGenerating}
              >
                <SelectTrigger className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                Word Count
              </Label>
              <Select
                value={formData.wordCount}
                onValueChange={val => setFormData({ ...formData, wordCount: val })}
                disabled={isGenerating}
              >
                <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="500">500 words</SelectItem>
                  <SelectItem value="800">800 words</SelectItem>
                  <SelectItem value="1200">1,200 words</SelectItem>
                  <SelectItem value="1500">1,500 words</SelectItem>
                  <SelectItem value="2000">2,000 words</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isGenerating || !formData.topic.trim()}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-base">Generating Blog...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span className="text-base">Generate Blog</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
