import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

// GET /api/edu/regions - List all active regions
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()

    const { data: regions, error } = await supabase
      .from('regions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[EDU][regions][GET] Error fetching regions:', error)
      return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 })
    }

    return NextResponse.json({ regions })
  } catch (error) {
    console.error('[EDU][regions][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

