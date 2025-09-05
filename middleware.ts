import { NextResponse } from "next/server"

export default function middleware(req) {
  // Temporarily disable authentication middleware
  // Allow all routes to pass through
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/protected/:path*'
  ]
}
