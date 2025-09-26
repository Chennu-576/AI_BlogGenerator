// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/hooks/use-auth'
// import { Loader2 } from 'lucide-react'


// export default function Home() {
//   const { user, loading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading) {
//       if (user) {
//         router.push('/dashboard')
//       } else {
//         router.push('/auth')
//       }
//     }
//   }, [user, loading, router])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
//       <div className="text-center">
//         <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
//         <p className="text-gray-600">Loading...</p>
//       </div>
//     </div>
//   )
// }

import { AuthForm } from '@/components/auth/auth-form'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <AuthForm />
    </div>
  )
}

