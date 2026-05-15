import { SupabaseClient } from '@supabase/supabase-js'
import { getRepById } from '@/lib/db/mysql'

export type Me = {
  id: string
  email: string | null
  role: string | null
  isAdmin: boolean
  rep_id: string | null
  rep_name: string | null
  firstName: string | null
}

/**
 * Fetch consolidated identity for the authenticated user.
 * Requires an authenticated Supabase server client (RLS enforced).
 */
export async function getMe(supabase: SupabaseClient<any, any, any>): Promise<Me | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: urow, error: uerr } = await supabase
    .from('users')
    .select('id, email, role, rep_id')
    .eq('id', user.id)
    .limit(1)
    .single()
  if (uerr) throw uerr

  // rep_id is stored on public.users at signup; use it to look up the current name from MySQL
  const storedRepId: string | null = (urow as any)?.rep_id || null
  let rep_id: string | null = storedRepId
  let rep_name: string | null = null
  if (storedRepId) {
    try {
      const mysqlRep = await getRepById(storedRepId)
      if (mysqlRep) {
        rep_id = mysqlRep.rep_id
        rep_name = mysqlRep.rep_name
      }
    } catch {
      // MySQL unavailable — degrade gracefully, rep_id still set from users table
    }
  }

  // Prefer explicit user metadata first name, then derive from full name, then fall back to sales rep name
  const meta = (user.user_metadata as any) || {}
  const metaFirst: string | null =
    (meta.first_name as string) ||
    (meta.given_name as string) ||
    (meta.full_name ? String(meta.full_name).trim().split(/\s+/)[0] : null) ||
    (meta.name ? String(meta.name).trim().split(/\s+/)[0] : null) ||
    null
  const derivedFromRep = rep_name ? String(rep_name).trim().split(/\s+/)[0] : null
  const firstName = metaFirst || derivedFromRep
  const isAdmin = meta?.isAdmin === true || urow?.role === 'admin'

  return {
    id: user.id,
    email: urow?.email || user.email || null,
    role: urow?.role || null,
    isAdmin,
    rep_id,
    rep_name,
    firstName,
  }
}
