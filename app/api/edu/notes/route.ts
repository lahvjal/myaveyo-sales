import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

// GET /api/edu/notes - Get all user's notes (optionally filter by lesson)
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    let query = supabase
      .from('lesson_notes')
      .select(`
        *,
        lesson:lessons (
          id,
          title,
          course:courses (
            id,
            title,
            slug
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    const { data: notes, error } = await query

    if (error) {
      console.error('[EDU][notes][GET] Error fetching notes:', error)
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
    }

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('[EDU][notes][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/edu/notes - Create note for a lesson
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, content } = body

    if (!lessonId || !content) {
      return NextResponse.json({ error: 'lessonId and content are required' }, { status: 400 })
    }

    // Verify lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('lesson_notes')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        content
      })
      .select()
      .single()

    if (error) {
      console.error('[EDU][notes][POST] Error creating note:', error)
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
    }

    return NextResponse.json({ success: true, note: data })
  } catch (error) {
    console.error('[EDU][notes][POST] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

