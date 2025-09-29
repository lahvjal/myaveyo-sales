import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createSupabaseServer()

  // Authenticate user with Supabase (server-side verification)
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr) {
    return NextResponse.json({ error: 'Auth error', details: userErr.message }, { status: 401 })
  }
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Debug: log current user email on the server
  console.log('[API /projects] Authenticated user email:', user.email)

  // 1) Find the user's rep_id in public.users by matching email (case-insensitive)
  if (!user.email) {
    return NextResponse.json({ error: 'Authenticated user has no email' }, { status: 400 })
  }
  const { data: userByEmail, error: byEmailErr } = await supabase
    .from('users')
    .select('rep_id')
    .ilike('email', user.email)
    .limit(1)
    .maybeSingle()
  if (byEmailErr) {
    return NextResponse.json({ error: 'Failed to lookup user by email', details: byEmailErr.message }, { status: 400 })
  }
  const repId = (userByEmail as any)?.rep_id ?? null

  if (!repId) {
    return NextResponse.json({ error: 'No rep_id associated with this user' }, { status: 404 })
  }

  // 2) Query podio_data for this rep_id
  const { data: projects, error: projErr } = await supabase
    .from('podio_data')
    .select('*')
    .eq('rep_id', repId)
    .order('updated_at', { ascending: false })

  if (projErr) {
    return NextResponse.json({ error: 'Failed to fetch projects', details: projErr.message }, { status: 400 })
  }

  return NextResponse.json(projects ?? [])
}
