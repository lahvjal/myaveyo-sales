import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

// GET /api/edu/courses - List all published courses
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[EDU][courses][GET] Error fetching courses:', error)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('[EDU][courses][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

