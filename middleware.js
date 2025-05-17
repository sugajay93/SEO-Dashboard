import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Check if the pathname starts with /admin
  const isAdminRoute = pathname.startsWith('/admin')
  // Check if the pathname starts with /client or /dashboard
  const isClientRoute = pathname.startsWith('/client') || pathname.startsWith('/dashboard')
  // Public routes (accessible without authentication)
  const isPublicRoute = pathname === '/' || 
                        pathname === '/login' || 
                        pathname === '/register' || 
                        pathname.startsWith('/api/auth')

  // Check authentication
  if (!token) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Check authorization for admin routes
  if (isAdminRoute && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect based on role after login
  if (pathname === '/dashboard') {
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}