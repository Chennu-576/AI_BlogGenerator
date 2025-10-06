// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req, res })

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   // If user is signed in and the current path is /auth redirect the user to /dashboard
//   if (user && req.nextUrl.pathname === '/auth') {
//     return NextResponse.redirect(new URL('/dashboard', req.url))
//   }

//   // If user is not signed in and the current path is not /auth redirect the user to /auth
//   if (!user && !req.nextUrl.pathname.startsWith('/auth')) {
//     return NextResponse.redirect(new URL('/auth', req.url))
//   }

//   return res
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }

// middleware.ts - REPLACE with this
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    // If user is signed in and trying to access auth page, redirect to dashboard
    if (session && req.nextUrl.pathname === '/auth') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is not signed in and trying to access protected routes
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth']
}