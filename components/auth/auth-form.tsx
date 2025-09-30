
// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { authService } from '@/lib/auth'
// import { toast } from 'react-hot-toast'
// import { useRouter } from 'next/navigation'
// import { Loader2, Mail, User as UserIcon } from 'lucide-react'

// export function AuthForm() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [username, setUsername] = useState('')
//   const [isResetMode, setIsResetMode] = useState(false)
//   const router = useRouter()

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const { user, error } = await authService.signIn(email, password)
      
//       if (error) {
//         toast.error(error.message)
//       } else if (user) {
//         toast.success(`Welcome back, ${user.user_metadata?.username || 'User'}!`)
//         router.push('/dashboard')
//       }
//     } catch (error) {
//       toast.error('An unexpected error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const { user, error } = await authService.signUp(email, password, username)
      
//       if (error) {
//         toast.error(error.message)
//       } else {
//         toast.success('Account created! Please check your email for verification.')
//         router.push('/dashboard')
//       }
//     } catch (error) {
//       toast.error('An unexpected error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePasswordReset = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const { error } = await authService.resetPassword(email)
      
//       if (error) {
//         toast.error(error.message)
//       } else {
//         toast.success('Password reset email sent!')
//         setIsResetMode(false)
//       }
//     } catch (error) {
//       toast.error('An unexpected error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isResetMode) {
//     return (
//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
//           <CardDescription>
//             Enter your email address and we'll send you a reset link
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handlePasswordReset} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
//               Send Reset Email
//             </Button>
//             <Button
//               type="button"
//               variant="ghost"
//               className="w-full"
//               onClick={() => setIsResetMode(false)}
//             >
//               Back to Sign In
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl font-bold">AI Blog Generator</CardTitle>
//         <CardDescription>
//           Create amazing content with AI-powered blog generation
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="signin" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="signin">Sign In</TabsTrigger>
//             <TabsTrigger value="signup">Sign Up</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="signin">
//             <form onSubmit={handleSignIn} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="signin-email">Email</Label>
//                 <Input
//                   id="signin-email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="signin-password">Password</Label>
//                 <Input
//                   id="signin-password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   minLength={6}
//                 />
//               </div>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                 Sign In
//               </Button>
//               <Button
//                 type="button"
//                 variant="link"
//                 className="w-full text-sm"
//                 onClick={() => setIsResetMode(true)}
//               >
//                 Forgot your password?
//               </Button>
//             </form>
//           </TabsContent>
          
//           <TabsContent value="signup">
//             <form onSubmit={handleSignUp} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="signup-username">Username</Label>
//                 <Input
//                   id="signup-username"
//                   type="text"
//                   placeholder="Enter your username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="signup-email">Email</Label>
//                 <Input
//                   id="signup-email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="signup-password">Password</Label>
//                 <Input
//                   id="signup-password"
//                   type="password"
//                   placeholder="Create a password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   minLength={6}
//                 />
//               </div>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                 Sign Up
//               </Button>
//             </form>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }


'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authService } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)

  // Separate states for sign-in and sign-up
  const [signinEmail, setSigninEmail] = useState('')
  const [signinPassword, setSigninPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')

  const [resetEmail, setResetEmail] = useState('')
  const [isResetMode, setIsResetMode] = useState(false)

  const router = useRouter()
  const { refreshUser } = useAuth() // ✅ get refreshUser from useAuth


  // --- Sign In ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { user, error } = await authService.signIn(signinEmail, signinPassword)
      if (error) {
        toast.error(error.message)
      } else if (user) {
         await refreshUser() // ✅ refresh user state
        toast.success(`Welcome back, ${user.user_metadata?.username || 'User'}!`)
        router.push('/dashboard')
      }
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Sign Up ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { user, error } = await authService.signUp(
        signupEmail,
        signupPassword,
        signupUsername
      )
      if (error) {
        toast.error(error.message)
      } else if (user) {
        await refreshUser() // ✅ refresh user state
        toast.success('Account created! Please check your email for verification.')
        
      }
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Reset Password ---
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await authService.resetPassword(resetEmail)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Password reset email sent!')
        setIsResetMode(false)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Reset Password Screen ---
  if (isResetMode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send Reset Email
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsResetMode(false)}
            >
              Back to Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  // --- Default Sign In / Sign Up Tabs ---
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">AI Blog Generator</CardTitle>
        <CardDescription>
          Create amazing content with AI-powered blog generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* --- Sign In Form --- */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={() => setIsResetMode(true)}
              >
                Forgot your password?
              </Button>
            </form>
          </TabsContent>

          {/* --- Sign Up Form --- */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Enter your username"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
