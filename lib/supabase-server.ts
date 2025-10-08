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
        // In Server Components or Client runtime, Next.js disallows cookie mutation.
        // Wrap in try/catch so usage outside Route Handlers does not crash.
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          /* no-op in non-mutable contexts */
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        } catch {
          /* no-op in non-mutable contexts */
        }
      },
    },
  })
  return supabase
}
