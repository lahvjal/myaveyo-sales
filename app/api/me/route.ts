import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { getMe } from '@/lib/data/me'

export async function GET() {
  const supabase = createSupabaseServer()

  const me = await getMe(supabase)
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(me, { status: 200 })
}
