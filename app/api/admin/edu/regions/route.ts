import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/edu/regions - Get all regions (including inactive)
export async function GET(request: NextRequest) {
  try {
    const { data: regions, error } = await supabaseAdmin
      .from('regions')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[ADMIN][EDU][regions][GET] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 })
    }

    return NextResponse.json({ regions })
  } catch (error) {
    console.error('[ADMIN][EDU][regions][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/edu/regions - Create new region
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, sort_order, is_active } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('regions')
      .insert({
        name,
        slug,
        sort_order: sort_order || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single()

    if (error) {
      console.error('[ADMIN][EDU][regions][POST] Error:', error)
      return NextResponse.json({ error: 'Failed to create region' }, { status: 500 })
    }

    return NextResponse.json({ success: true, region: data })
  } catch (error) {
    console.error('[ADMIN][EDU][regions][POST] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

