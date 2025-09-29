import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Build server client using request cookies
  const cookieStore = cookies()
  const headerList = headers()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = Boolean(user.user_metadata?.isAdmin)
  if (!isAdmin) {
    redirect('/user')
  }

  return <>{children}</>
}
