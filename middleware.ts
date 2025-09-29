import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Cookie-based auth for protected routes under /user/*
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } })
  const { pathname } = req.nextUrl

  // Only protect /user/* paths
  if (!pathname.startsWith('/user')) return res

  // Skip protection on localhost to avoid dev loops (client handles redirect)
  const host = req.headers.get('host') || ''
  if (host.includes('localhost') || host.startsWith('127.0.0.1')) {
    return res
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const url = req.nextUrl.clone()
    const fullPath = pathname + (req.nextUrl.search || '')
    url.pathname = '/login'
    url.searchParams.set('redirect', fullPath)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/user/:path*'],
}
