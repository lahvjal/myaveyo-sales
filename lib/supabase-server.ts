import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export function createSupabaseServer() {
  const cookieStore = cookies()
  // createServerClient reads/writes cookies via the provided adapter
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // Next 14: cookies() can be set during Server Actions/Routes; here it's mostly read-only path.
        // We still provide setters for SSR helper compatibility.
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options, maxAge: 0 })
      },
    },
  })
  return supabase
}
