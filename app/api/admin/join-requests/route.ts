import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    // 1) Authenticate request with Supabase Auth server
    const supabase = createSupabaseServer()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2) Authorize: require admin role in users table
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', authData.user.id)
      .single()

    if (userErr) {
      console.error('[join_requests] users lookup error:', userErr)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!userRow || userRow.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3) Fetch data with elevated client after authz passes
    const { data, error } = await supabaseAdmin
      .from('join_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[join_requests] select error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (e: any) {
    console.error('[join_requests] GET exception:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
