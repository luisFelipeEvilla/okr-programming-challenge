import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from "next/headers"
import { cc_access_token_cookie_name } from './config'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || 
                      path === '/api/auth/callback/constantcontact' || 
                      path.startsWith('/_next') || 
                      path.startsWith('/images') ||
                      path === '/favicon.ico'

  // Get the token from cookies
  const cookieStore = await cookies()
  const token = cookieStore.get(cc_access_token_cookie_name)

  // Redirect to login if accessing dashboard without token
  if (!token && !isPublicPath) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', path)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing login with valid token
  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard/contacts', request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (getServerSideProps data)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc)
     */
    '/((?!_next/static|_next/image|_next/data|favicon.ico|museum.jpg|login-banner.png|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
} 