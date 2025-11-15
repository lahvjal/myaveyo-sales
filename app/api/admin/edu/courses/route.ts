import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/edu/courses - Get all courses (including unpublished)
export async function GET(request: NextRequest) {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[ADMIN][EDU][courses][GET] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('[ADMIN][EDU][courses][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/edu/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, slug, sort_order, is_published } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'title and slug are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert({
        title,
        description,
        slug,
        sort_order: sort_order || 0,
        is_published: is_published !== undefined ? is_published : true
      })
      .select()
      .single()

    if (error) {
      console.error('[ADMIN][EDU][courses][POST] Error:', error)
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
    }

    return NextResponse.json({ success: true, course: data })
  } catch (error) {
    console.error('[ADMIN][EDU][courses][POST] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

