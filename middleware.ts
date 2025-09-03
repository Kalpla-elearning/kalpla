import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isInstructorPage = req.nextUrl.pathname.startsWith('/instructor')

    if (isAuthPage) {
      if (isAuth) {
        // Redirect authenticated users away from auth pages
        if (token?.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        } else if (token?.role === 'INSTRUCTOR') {
          return NextResponse.redirect(new URL('/instructor/dashboard', req.url))
        } else {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      return null
    }

    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    if (isInstructorPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      if (token?.role !== 'INSTRUCTOR' && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Protect dashboard routes
    if (req.nextUrl.pathname === '/dashboard') {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages
        const publicPaths = ['/', '/courses', '/blog', '/degrees', '/mentorship', '/about', '/contact']
        if (publicPaths.some(path => req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path + '/'))) {
          return true
        }

        // Allow access to auth pages
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/protected/:path*'
  ]
}
