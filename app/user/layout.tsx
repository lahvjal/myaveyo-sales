import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Server-side redirect to login with original path
    // Note: next/navigation redirect triggers a 307 to the given URL
    redirect(`/login`)
  }

  return <>{children}</>
}
