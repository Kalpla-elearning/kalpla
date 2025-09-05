import { NextResponse } from "next/server"
import { getCurrentUser } from 'aws-amplify/auth'

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/courses',
    '/blog',
    '/degrees',
    '/mentorship',
    '/help',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
  ]

  // Admin routes that require admin role
  const adminRoutes = ['/admin', '/dashboard/admin']

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/instructor',
    '/mentor',
    '/profile',
    '/checkout',
    '/payment',
    '/subscription-plans',
  ]

  // Check if the current path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  try {
    // Check if user is authenticated
    const user = await getCurrentUser()
    
    if (!user) {
      // Redirect to sign in if not authenticated
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // For admin routes, check if user has admin role
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      // TODO: Check user role from database
      // For now, allow access
      return NextResponse.next()
    }

    // For protected routes, allow access if authenticated
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // Allow access to other routes
    return NextResponse.next()

  } catch (error) {
    // If there's an error getting the user, redirect to sign in
    console.error('Middleware auth error:', error)
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/payment/:path*',
    '/subscription-plans/:path*',
    '/mentor/:path*'
  ]
}
