import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from "next/headers"
import { cc_access_token_cookie_name } from './config'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/api/auth/callback/constantcontact'

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
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard/contacts', request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image*|images|favicon.ico).*)',
  ],
} 