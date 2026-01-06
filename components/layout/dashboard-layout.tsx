
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
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Recent Blogs', href: '/dashboard/blogs', icon: FileText },
  { name: 'Create Blog', href: '/dashboard/create', icon: Plus },
  // { name: 'Templates', href: '/dashboard/templates', icon: Layout },
  // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  // --- Fetch current user
  useEffect(() => {
    if (!loading && !user) {
         router.replace('/auth'); // Redirect unauthenticated users
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.username || null)
    }else {
      setUsername(null);
    }
  }, [user])

  // Loading fallback
  if(loading) return <div>Loading...</div>

  // --- Logout handler
  const handleLogout = async () => {
     console.log("Logout clicked");
    try {
      await logout();
      console.log("Logout success, redirecting...");
      router.replace('/'); // Redirect after successful logout
      
    } catch (err) {
     toast.error('Error logging out');
     router.replace('/'); // Fallback
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


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
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
//   BarChart3,
//   User,
//   ChevronDown
// } from 'lucide-react'
// import { authService } from '@/lib/auth'
// import { useAuth } from '@/hooks/use-auth'
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
//   // { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
//   { name: 'Settings', href: '/dashboard/settings', icon: Settings },
// ]

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [username, setUsername] = useState<string | null>(null)
//   const [menuOpen, setMenuOpen] = useState(false)
//   const pathname = usePathname()
//   const router = useRouter()
//   const { user, loading, logout } = useAuth()

//   useEffect(() => {
//     if (!loading && !user) {
//       router.replace('/auth')
//     }
//   }, [user, loading, router])

//   useEffect(() => {
//     if (user) {
//       setUsername(user.user_metadata?.username || null)
//     } else {
//       setUsername(null)
//     }
//   }, [user])

//   const handleLogout = async () => {
//     try {
//       await logout()
//       router.replace('/auth')
//     } catch (err) {
//       toast.error('Error logging out')
//       router.replace('/auth')
//     }
//   }

//   const firstLetter = username ? username.charAt(0).toUpperCase() : '?'

//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//       <div className="text-center">
//         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading...</p>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Mobile sidebar */}
//       <div className={cn("fixed inset-0 z-50 lg:hidden transition-all duration-300", sidebarOpen ? "block" : "hidden")}>
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
//           onClick={() => setSidebarOpen(false)} 
//         />
//         <nav className="relative flex flex-col w-60 h-full bg-white shadow-2xl transform transition-transform duration-300">
//           <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//             <div className="flex items-center space-x-3">
//               <BookOpen className="w-8 h-8" />
//               <div>
//                 <span className="text-xl font-bold">BlogGen AI</span>
//                 <p className="text-blue-100 text-sm">Content Creation Platform</p>
//               </div>
//             </div>
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               className="text-white hover:bg-white/20"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X className="w-5 h-5" />
//             </Button>
//           </div>
          
//           <div className="flex-1 p-6 space-y-2">
//             {navigation.map((item) => {
//               const Icon = item.icon
//               const isActive = pathname === item.href
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={cn(
//                     "flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
//                     isActive 
//                       ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25" 
//                       : "text-gray-600 hover:bg-white hover:shadow-lg hover:border hover:border-gray-100"
//                   )}
//                 >
//                   <Icon className={cn("w-5 h-5 transition-transform duration-200", 
//                     isActive ? "scale-110" : "group-hover:scale-110")} 
//                   />
//                   <span className="font-semibold">{item.name}</span>
//                 </Link>
//               )
//             })}
//           </div>
          
//           <div className="p-6 border-t border-gray-100 bg-gray-50/50">
//             <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
//               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">
//                 {firstLetter}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-gray-900 truncate">Hi, {username}</p>
//                 <p className="text-xs text-gray-500 truncate">Welcome back!</p>
//               </div>
//             </div>
//             <Button 
//               variant="ghost" 
//               className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg py-3"
//               onClick={handleLogout}
//             >
//               <LogOut className="w-5 h-5 mr-3" />
//               Logout
//             </Button>
//           </div>
//         </nav>
//       </div>

//       {/* Desktop sidebar */}
//       <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white border-r border-gray-200 shadow-xl">
//         <div className="flex items-center space-x-3 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//           <BookOpen className="w-10 h-10" />
//           <div>
//             <span className="text-2xl font-bold">BlogGen AI</span>
//             <p className="text-blue-100 text-sm">Content Creation Platform</p>
//           </div>
//         </div>
        
//         <div className="flex-1 p-6 space-y-3">
//           {navigation.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.href
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={cn(
//                   "flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 group border",
//                   isActive 
//                     ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 border-transparent" 
//                     : "text-gray-600 border-transparent hover:bg-white hover:shadow-lg hover:border-gray-200"
//                 )}
//               >
//                 <Icon className={cn("w-5 h-5 transition-transform duration-200", 
//                   isActive ? "scale-110" : "group-hover:scale-110")} 
//                 />
//                 <span className="font-semibold">{item.name}</span>
//               </Link>
//             )
//           })}
//         </div>
        
//         <div className="p-6 border-t border-gray-100 bg-gray-50/50">
//           <div className="flex items-center space-x-3 mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg">
//               {firstLetter}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold text-gray-900 truncate">Hi, {username}</p>
//               <p className="text-xs text-gray-500 truncate">Welcome back!</p>
//             </div>
//           </div>
//           <Button 
//             variant="ghost" 
//             className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg py-3 font-medium"
//             onClick={handleLogout}
//           >
//             <LogOut className="w-5 h-5 mr-3" />
//             Logout
//           </Button>
//         </div>
//       </nav>

//       {/* Main content */}
//       <div className="lg:pl-72">
//         <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm flex items-center justify-between px-6 py-4">
//           {/* Mobile menu button */}
//           <div className="flex items-center lg:hidden">
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               className="text-gray-600 hover:bg-gray-100 rounded-lg"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu className="w-6 h-6" />
//             </Button>
//             <div className="ml-3 flex items-center space-x-2">
//               <BookOpen className="w-7 h-7 text-blue-600" />
//               <span className="font-bold text-gray-900 text-lg">BlogGen AI</span>
//             </div>
//           </div>

//           {/* User avatar */}
//           <div className="ml-auto relative">
//             <button
//               onClick={() => setMenuOpen(prev => !prev)}
//               className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
//             >
//               <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">
//                 {firstLetter}
//               </div>
//               <div className="hidden sm:block text-left">
//                 <p className="text-sm font-semibold text-gray-900">Hi, {username}</p>
//                 <p className="text-xs text-gray-500">Welcome back!</p>
//               </div>
//               <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", 
//                 menuOpen ? "rotate-180" : ""
//               )} />
//             </button>
            
//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 backdrop-blur-lg bg-white/95">
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   <p className="text-sm font-semibold text-gray-900">Signed in as</p>
//                   <p className="text-sm text-gray-600 truncate">{username}</p>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg mx-2 mt-1"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         <main className="py-8">
//           <div className="mx-auto max-w-7xl px-6 lg:px-8">
//             <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-sm">
//               {children}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }