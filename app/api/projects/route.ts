import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { getMyProjects } from '@/lib/data/projects'

export async function GET() {
  const supabase = createSupabaseServer()
  try {
    const projects = await getMyProjects(supabase)
    return NextResponse.json(projects ?? [])
  } catch (e: any) {
    const msg = e?.message || 'Failed to fetch projects'
    const status = msg === 'Unauthorized' ? 401 : 400
    return NextResponse.json({ error: msg }, { status })
  }
}
