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

    // Find General conversation
    const { data: conv } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('title', 'General')
      .limit(1)
      .single()

    if (!conv?.id) {
      return NextResponse.json({ error: 'General conversation missing' }, { status: 500 })
    }

    // Ensure membership
    await supabaseAdmin
      .from('conversation_members')
      .upsert({ conversation_id: conv.id, user_id: authData.user.id }, { onConflict: 'conversation_id,user_id' })

    return NextResponse.json({ conversationId: conv.id })
  } catch (e: any) {
    console.error('[chat/bootstrap] error', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
