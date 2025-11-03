import { SupabaseClient } from '@supabase/supabase-js'

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
    .select('id, email, role')
    .eq('id', user.id)
    .limit(1)
    .single()
  if (uerr) throw uerr

  let rep_id: string | null = null
  let rep_name: string | null = null
  if (urow?.email) {
    const { data: srep } = await supabase
      .from('sales_reps')
      .select('rep_id, rep_name, rep_email')
      .eq('rep_email', urow.email)
      .limit(1)
      .maybeSingle()
    rep_id = (srep as any)?.rep_id || null
    rep_name = (srep as any)?.rep_name || null
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
