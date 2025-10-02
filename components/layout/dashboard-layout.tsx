
// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useRouter, usePathname } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { 
//   Home, 
//   FileText, 
//   Plus, 
//   Layout, 
//   Settings, 
//   LogOut,
//   Menu,
//   X,
//   BookOpen,
//   BarChart3
// } from 'lucide-react'
// import { authService } from '@/lib/auth'
// import { toast } from 'react-hot-toast'
// import { cn } from '@/lib/utils'

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// const navigation = [
//   { name: 'Dashboard', href: '/dashboard', icon: Home },
//   { name: 'Recent Blogs', href: '/dashboard/blogs', icon: FileText },
//   { name: 'Create Blog', href: '/dashboard/create', icon: Plus },
//   { name: 'Templates', href: '/dashboard/templates', icon: Layout },
//   { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
//   { name: 'Settings', href: '/dashboard/settings', icon: Settings },
// ]

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [username, setUsername] = useState<string | null>(null)
//   const [menuOpen, setMenuOpen] = useState(false)
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data } = await authService.getCurrentUser()
//       if (data?.user) {
//         setUsername(data.user.user_metadata?.username || null)
//       }
//     }
//     fetchUser()
//   }, [])

//   const handleLogout = async () => {
//     try {
//       await authService.signOut()
//       toast.success('Logged out successfully')
//       router.push('/auth')
//     } catch (error) {
//       toast.error('Error logging out')
//     }
//   }

//   const firstLetter = username ? username.charAt(0).toUpperCase() : '?'

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile sidebar */}
//       <div className={cn(
//         "fixed inset-0 z-50 lg:hidden",
//         sidebarOpen ? "block" : "hidden"
//       )}>
//         <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
//         <nav className="relative flex flex-col w-64 h-full bg-white shadow-xl">
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center space-x-2">
//               <BookOpen className="w-8 h-8 text-blue-600" />
//               <span className="text-xl font-bold text-gray-900">BlogGen AI</span>
//             </div>
//             <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
//               <X className="w-5 h-5" />
//             </Button>
//           </div>
//           <div className="flex-1 p-4 space-y-1">
//             {navigation.map((item) => {
//               const Icon = item.icon
//               const isActive = pathname === item.href
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={cn(
//                     "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                     isActive
//                       ? "bg-blue-50 text-blue-700"
//                       : "text-gray-700 hover:bg-gray-50"
//                   )}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.name}</span>
//                 </Link>
//               )
//             })}
//           </div>
//           <div className="p-4 border-t">
//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={handleLogout}
//             >
//               <LogOut className="w-5 h-5 mr-3" />
//               Logout
//             </Button>
//           </div>
//         </nav>
//       </div>

//       {/* Desktop sidebar */}
//       <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
//         <div className="flex items-center space-x-2 p-6 border-b">
//           <BookOpen className="w-8 h-8 text-blue-600" />
//           <span className="text-xl font-bold text-gray-900">BlogGen AI</span>
//         </div>
//         <div className="flex-1 p-4 space-y-1">
//           {navigation.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.href
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={cn(
//                   "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                   isActive
//                     ? "bg-blue-50 text-blue-700"
//                     : "text-gray-700 hover:bg-gray-50"
//                 )}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span>{item.name}</span>
//               </Link>
//             )
//           })}
//         </div>
//         <div className="p-4 border-t">
//           <Button
//             variant="ghost"
//             className="w-full justify-start"
//             onClick={handleLogout}
//           >
//             <LogOut className="w-5 h-5 mr-3" />
//             Logout
//           </Button>
//         </div>
//       </nav>

//       {/* Main content */}
//       <div className="lg:pl-64">
//         <div className="sticky top-0 z-40 bg-white border-b shadow-sm flex items-center justify-between px-4 py-4 sm:px-6">
//           {/* Mobile menu button */}
//           <div className="flex items-center lg:hidden">
//             <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
//               <Menu className="w-6 h-6" />
//             </Button>
//             <div className="ml-2 flex items-center space-x-2">
//               <BookOpen className="w-6 h-6 text-blue-600" />
//               <span className="font-bold text-gray-900">BlogGen AI</span>
//             </div>
//           </div>

//           {/* User avatar on right side */}
//           <div className="ml-auto relative">
//             <button
//               onClick={() => setMenuOpen((prev) => !prev)}
//               className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold"
//             >
//               {firstLetter}
//             </button>

//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//                 <p className="px-3 py-2 text-sm text-gray-700">Hi, {username}</p>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         <main className="py-6">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { 
//   Home, 
//   FileText, 
//   Plus, 
//   Layout, 
//   Settings, 
//   LogOut,
//   Menu,
//   X,
//   BookOpen,
//   BarChart3
// } from 'lucide-react'
// import { authService } from '@/lib/auth'
// import { toast } from 'react-hot-toast'
// import { useRouter } from 'next/navigation'

// import { cn } from '@/lib/utils'

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// const navigation = [
//   { name: 'Dashboard', href: '/dashboard', icon: Home },
//   { name: 'Recent Blogs', href: '/dashboard/blogs', icon: FileText },
//   { name: 'Create Blog', href: '/dashboard/create', icon: Plus },
//   { name: 'Templates', href: '/dashboard/templates', icon: Layout },
//   { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
//   { name: 'Settings', href: '/dashboard/settings', icon: Settings },
// ]

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [username, setUsername] = useState<string | null>(null)
//   const [menuOpen, setMenuOpen] = useState(false)
//   const pathname = usePathname()
//   const router = useRouter()

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { user, error } = await authService.getCurrentUser()
//       if (user) {
//         setUsername(user.user_metadata?.username || null)
//       } else if (error) {
//       console.error('Error fetching user:', error.message)
//     }
//     }
//     fetchUser()
//   }, [])

//   const handleLogout = async () => {
//     try {
//       const { error } = await authService.signOut()
//       if (!error) {
//         toast.success('Logged out successfully')
//         router.push('/auth')
//         // 🚀 redirect handled inside lib/auth.ts (window.location.href = '/auth')

//       } else {
//         if (error.message === 'Auth session missing!') {
//         router.push('/auth')
//       } else {
//         toast.error('Error logging out')
//       }
//     }
//     } catch (err) {
//       console.error(err)
//       toast.error('Error logging out')
//       router.push('/auth')
//     }
//   }

//   const firstLetter = username ? username.charAt(0).toUpperCase() : '?'

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile sidebar */}
//       <div
//         className={cn(
//           "fixed inset-0 z-50 lg:hidden",
//           sidebarOpen ? "block" : "hidden"
//         )}
//       >
//         <div
//           className="fixed inset-0 bg-black bg-opacity-25"
//           onClick={() => setSidebarOpen(false)}
//         />
//         <nav className="relative flex flex-col w-64 h-full bg-white shadow-xl">
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center space-x-2">
//               <BookOpen className="w-8 h-8 text-blue-600" />
//               <span className="text-xl font-bold text-gray-900">BlogGen AI</span>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X className="w-5 h-5" />
//             </Button>
//           </div>
//           <div className="flex-1 p-4 space-y-1">
//             {navigation.map((item) => {
//               const Icon = item.icon
//               const isActive = pathname === item.href
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={cn(
//                     "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                     isActive
//                       ? "bg-blue-50 text-blue-700"
//                       : "text-gray-700 hover:bg-gray-50"
//                   )}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.name}</span>
//                 </Link>
//               )
//             })}
//           </div>
//           <div className="p-4 border-t">
//             <Button
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={handleLogout}
//             >
//               <LogOut className="w-5 h-5 mr-3" />
//               Logout
//             </Button>
//           </div>
//         </nav>
//       </div>

//       {/* Desktop sidebar */}
//       <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
//         <div className="flex items-center space-x-2 p-6 border-b">
//           <BookOpen className="w-8 h-8 text-blue-600" />
//           <span className="text-xl font-bold text-gray-900">BlogGen AI</span>
//         </div>
//         <div className="flex-1 p-4 space-y-1">
//           {navigation.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.href
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={cn(
//                   "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                   isActive
//                     ? "bg-blue-50 text-blue-700"
//                     : "text-gray-700 hover:bg-gray-50"
//                 )}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span>{item.name}</span>
//               </Link>
//             )
//           })}
//         </div>
//         <div className="p-4 border-t">
//           <Button
//             variant="ghost"
//             className="w-full justify-start"
//             onClick={handleLogout}
//           >
//             <LogOut className="w-5 h-5 mr-3" />
//             Logout
//           </Button>
//         </div>
//       </nav>

//       {/* Main content */}
//       <div className="lg:pl-64">
//         <div className="sticky top-0 z-40 bg-white border-b shadow-sm flex items-center justify-between px-4 py-4 sm:px-6">
//           {/* Mobile menu button */}
//           <div className="flex items-center lg:hidden">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu className="w-6 h-6" />
//             </Button>
//             <div className="ml-2 flex items-center space-x-2">
//               <BookOpen className="w-6 h-6 text-blue-600" />
//               <span className="font-bold text-gray-900">BlogGen AI</span>
//             </div>
//           </div>

//           {/* User avatar on right side */}
//           <div className="ml-auto relative">
//             <button
//               onClick={() => setMenuOpen((prev) => !prev)}
//               className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold"
//             >
//               {firstLetter}
//             </button>

//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//                 <p className="px-3 py-2 text-sm text-gray-700">Hi, {username}</p>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         <main className="py-6">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  FileText, 
  Plus, 
  Layout, 
  Settings, 
  LogOut,
  Menu,
  X,
  BookOpen,
  BarChart3
} from 'lucide-react'
import { authService } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Recent Blogs', href: '/dashboard/blogs', icon: FileText },
  { name: 'Create Blog', href: '/dashboard/create', icon: Plus },
  { name: 'Templates', href: '/dashboard/templates', icon: Layout },
  // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // --- Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await authService.getCurrentUser()
        if (user) {
          setUsername(user.user_metadata?.username || null)
        } else {
          router.push('/auth') // Redirect if no user session
        }
      } catch (err: any) {
        console.error('Error fetching user:', err.message)
        router.push('/auth') // Redirect if error occurs
      }
    }
    fetchUser()
  }, [router])

  // --- Logout handler
  const handleLogout = async () => {
    try {
      await authService.signOut()
      setUsername(null) // clear username
      toast.success('Logged out successfully')
      router.push('/auth') // always redirect
    } catch (err: any) {
      console.error('Logout error:', err.message)
      router.push('/auth')
      toast.error('Error logging out')
    }
  }

  const firstLetter = username ? username.charAt(0).toUpperCase() : '?'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <nav className="relative flex flex-col w-64 h-full bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BlogGen AI</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        <div className="flex items-center space-x-2 p-6 border-b">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">BlogGen AI</span>
        </div>
        <div className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm flex items-center justify-between px-4 py-4 sm:px-6">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <div className="ml-2 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">BlogGen AI</span>
            </div>
          </div>

          {/* User avatar */}
          <div className="ml-auto relative">
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold"
            >
              {firstLetter}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <p className="px-3 py-2 text-sm text-gray-700">Hi, {username}</p>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

