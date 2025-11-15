import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/edu/lessons?courseId=xxx&region=california - Get lessons for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const region = searchParams.get('region')

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)

    // Filter by region if provided
    if (region) {
      query = query.eq('region', region)
    }

    const { data: lessons, error } = await query.order('sort_order', { ascending: true })

    if (error) {
      console.error('[ADMIN][EDU][lessons][GET] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
    }

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('[ADMIN][EDU][lessons][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/edu/lessons - Create new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { course_id, title, description, video_url, duration_minutes, sort_order, is_published, region } = body

    if (!course_id || !title || !video_url) {
      return NextResponse.json({ error: 'course_id, title, and video_url are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('lessons')
      .insert({
        course_id,
        title,
        description,
        video_url,
        duration_minutes,
        sort_order: sort_order || 0,
        is_published: is_published !== undefined ? is_published : true,
        region: region || 'california'
      })
      .select()
      .single()

    if (error) {
      console.error('[ADMIN][EDU][lessons][POST] Error:', error)
      return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lesson: data })
  } catch (error) {
    console.error('[ADMIN][EDU][lessons][POST] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

