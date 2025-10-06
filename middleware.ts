
// middleware.ts - REPLACE with this
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
  
//   try {
//     const supabase = createMiddlewareClient({ req, res })
//     const { data: { session } } = await supabase.auth.getSession()

//     // If user is signed in and trying to access auth page, redirect to dashboard
//     if (session && req.nextUrl.pathname === '/auth') {
//       return NextResponse.redirect(new URL('/dashboard', req.url))
//     }

//     // If user is not signed in and trying to access protected routes
//     if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
//       return NextResponse.redirect(new URL('/auth', req.url))
//     }

//     return res
//   } catch (error) {
//     console.error('Middleware error:', error)
//     return res
//   }
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/auth']
// }

// middleware.ts - COMPLETE FILE
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = req.nextUrl

  try {
    // Create Supabase client
    const supabase = createMiddlewareClient({ req, res })
    
    // Get session - but don't block anything temporarily
    const { data: { session } } = await supabase.auth.getSession()

    console.log('Middleware - Path:', url.pathname, 'Has session:', !!session)

    // ONLY redirect if user is on /auth and has valid session
    if (session && url.pathname === '/auth') {
      console.log('Redirecting to dashboard from auth page')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Allow all other requests to pass through
    return res

  } catch (error) {
    console.log('Middleware error - allowing request:', error)
    // Even if there's error, allow the request
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}