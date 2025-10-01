import { SupabaseClient } from '@supabase/supabase-js'

export type ProjectRow = Record<string, any>

/**
 * Returns projects for the authenticated user's rep_id.
 * - Finds the current user via auth.getUser()
 * - Looks up rep_id from public.users by email (case-insensitive)
 * - Selects projects from public.podio_data by rep_id, newest first
 */
export async function getMyProjects(supabase: SupabaseClient<any, any, any>): Promise<ProjectRow[]> {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw new Error(userErr.message)
  if (!user) throw new Error('Unauthorized')
  if (!user.email) throw new Error('Authenticated user has no email')

  const { data: urow, error: uerr } = await supabase
    .from('users')
    .select('rep_id')
    .ilike('email', user.email)
    .limit(1)
    .maybeSingle()
  if (uerr) throw new Error(uerr.message)
  const repId = (urow as any)?.rep_id ?? null
  if (!repId) throw new Error('No rep_id associated with this user')

  const { data: projects, error: perr } = await supabase
    .from('podio_data')
    .select('*')
    .eq('rep_id', repId)
    .order('updated_at', { ascending: false })
  if (perr) throw new Error(perr.message)
  return (projects || []) as ProjectRow[]
}
