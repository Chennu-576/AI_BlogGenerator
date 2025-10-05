import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Blog Generator - Create SEO-Optimized Content',
  description: 'Generate high-quality, SEO-optimized blog content with AI. Perfect for marketers, businesses, and content creators.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
// 'use client'

// import './globals.css'
// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import { Toaster } from 'react-hot-toast'
// import { supabase } from '@/lib/supabase'
// import { SessionContextProvider } from '@supabase/auth-helpers-react'
// import { useState } from 'react'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'AI Blog Generator - Create SEO-Optimized Content',
//   description: 'Generate high-quality, SEO-optimized blog content with AI. Perfect for marketers, businesses, and content creators.',
//   icons: {
//     icon: '/favicon.ico',
//   },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // create one Supabase client per app
//   const [supabaseClient] = useState(() => supabase)

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <SessionContextProvider supabaseClient={supabaseClient}>
//           {children}
//         </SessionContextProvider>

//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: { background: '#363636', color: '#fff' },
//             success: {
//               duration: 3000,
//               iconTheme: { primary: '#10b981', secondary: '#fff' },
//             },
//             error: {
//               duration: 4000,
//               iconTheme: { primary: '#ef4444', secondary: '#fff' },
//             },
//           }}
//         />
//       </body>
//     </html>
//   )
// }

