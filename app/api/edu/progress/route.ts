import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

// GET /api/edu/progress - Get user's overall progress summary
// Optional query params: ?region=california
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build query for published lessons
    let lessonsQuery = supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
    
    if (region) {
      lessonsQuery = lessonsQuery.eq('region', region)
    }

    const { count: totalLessons } = await lessonsQuery

    // Get user's completed lessons count
    const { count: completedLessons } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)

    // Get user's most recent completed lesson
    const { data: recentCompleted } = await supabase
      .from('lesson_progress')
      .select(`
        *,
        lesson:lessons (
          id,
          title,
          course:courses (
            title,
            slug
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()

    // Get user's next incomplete lesson (first lesson they haven't completed)
    let allLessonsQuery = supabase
      .from('lessons')
      .select(`
        id,
        title,
        sort_order,
        region,
        course:courses (
          id,
          title,
          slug,
          sort_order
        )
      `)
      .eq('is_published', true)
    
    if (region) {
      allLessonsQuery = allLessonsQuery.eq('region', region)
    }

    const { data: allLessons } = await allLessonsQuery
      .order('course.sort_order', { ascending: true })
      .order('sort_order', { ascending: true })

    // Get user's progress
    const { data: userProgress } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)

    // Find first incomplete lesson
    const nextLesson = allLessons?.find(lesson => 
      !userProgress?.find(p => p.lesson_id === lesson.id && p.completed)
    )

    return NextResponse.json({
      totalLessons: totalLessons || 0,
      completedLessons: completedLessons || 0,
      recentCompleted: recentCompleted || null,
      nextLesson: nextLesson || null
    })
  } catch (error) {
    console.error('[EDU][progress][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/edu/progress - Mark lesson as complete
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, completed } = body

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
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

    // Upsert progress
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: completed !== undefined ? completed : true,
        completed_at: completed !== false ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single()

    if (error) {
      console.error('[EDU][progress][POST] Error upserting progress:', error)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true, progress: data })
  } catch (error) {
    console.error('[EDU][progress][POST] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

