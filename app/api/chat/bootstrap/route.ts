import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Authenticate
    const supabase = createSupabaseServer()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Prefer RLS-safe fetch of General using the user's session
    const { data: convViaRls, error: convErr } = await supabase
      .from('conversations')
      .select('id')
      .eq('title', 'General')
      .limit(1)
      .single()

    if (convViaRls?.id) {
      // Membership is not required for General (RLS opened). Return id.
      return NextResponse.json({ conversationId: convViaRls.id })
    }

    // If not found via RLS, optionally create via admin (service role) if configured
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!hasServiceRole) {
      return NextResponse.json({ error: 'General conversation missing and no service key to create it' }, { status: 500 })
    }

    const { data: convAdmin } = await supabaseAdmin
      .from('conversations')
      .upsert({ title: 'General' }, { onConflict: 'title' })
      .select('id')
      .single()

    if (!convAdmin?.id) {
      return NextResponse.json({ error: 'Failed to create General conversation' }, { status: 500 })
    }

    return NextResponse.json({ conversationId: convAdmin.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
