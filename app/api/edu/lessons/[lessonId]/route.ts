import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

// GET /api/edu/lessons/[lessonId] - Get lesson details
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const supabase = createSupabaseServer()
    const { lessonId } = params

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get lesson with course info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses (
          id,
          title,
          slug
        )
      `)
      .eq('id', lessonId)
      .eq('is_published', true)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Get user's progress for this lesson
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()

    // Get user's notes for this lesson
    const { data: notes } = await supabase
      .from('lesson_notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })

    // Get all lessons in this course for navigation
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id, title, sort_order')
      .eq('course_id', lesson.course.id)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    // Find previous and next lessons
    const currentIndex = allLessons?.findIndex(l => l.id === lessonId) ?? -1
    const previousLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null
    const nextLesson = currentIndex >= 0 && currentIndex < (allLessons?.length ?? 0) - 1 
      ? allLessons?.[currentIndex + 1] 
      : null

    return NextResponse.json({
      lesson: {
        ...lesson,
        completed: progress?.completed || false,
        completed_at: progress?.completed_at || null
      },
      notes: notes || [],
      navigation: {
        previous: previousLesson,
        next: nextLesson
      }
    })
  } catch (error) {
    console.error('[EDU][lesson][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

