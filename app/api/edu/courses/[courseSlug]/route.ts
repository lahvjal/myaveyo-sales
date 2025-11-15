import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

// GET /api/edu/courses/[courseSlug] - Get course with lessons and user progress
// Optional query params: ?region=california
export async function GET(
  request: NextRequest,
  { params }: { params: { courseSlug: string } }
) {
  try {
    const supabase = createSupabaseServer()
    const { courseSlug } = params
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'california'

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', courseSlug)
      .eq('is_published', true)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Get lessons for this course and region
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course.id)
      .eq('region', region)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (lessonsError) {
      console.error('[EDU][course][GET] Error fetching lessons:', lessonsError)
      return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
    }

    // Get user's progress for these lessons
    const lessonIds = lessons?.map(l => l.id) || []
    const { data: progress, error: progressError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .in('lesson_id', lessonIds)

    if (progressError) {
      console.error('[EDU][course][GET] Error fetching progress:', progressError)
    }

    // Merge progress into lessons
    const lessonsWithProgress = lessons?.map(lesson => ({
      ...lesson,
      completed: progress?.find(p => p.lesson_id === lesson.id)?.completed || false,
      completed_at: progress?.find(p => p.lesson_id === lesson.id)?.completed_at || null
    }))

    return NextResponse.json({
      course,
      lessons: lessonsWithProgress
    })
  } catch (error) {
    console.error('[EDU][course][GET] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

