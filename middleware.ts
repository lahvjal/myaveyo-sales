import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Minimal auth gate for protected routes under /user/*.
// If using Supabase Auth Helpers, replace this with createMiddlewareClient check.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /user/* paths
  const protectedPath = pathname.startsWith('/user')
  if (!protectedPath) return NextResponse.next()

  // Heuristic: check for Supabase auth cookies. Adjust if your cookie names differ.
  const hasAccess = Boolean(
    req.cookies.get('sb-access-token') ||
    req.cookies.get('sb:token') ||
    req.cookies.get('supabase-auth-token')
  )

  if (!hasAccess) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*'],
}
