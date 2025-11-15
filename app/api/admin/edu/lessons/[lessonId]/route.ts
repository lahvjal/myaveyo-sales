import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// PUT /api/admin/edu/lessons/[lessonId] - Update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params
    const body = await request.json()
    const { title, description, video_url, duration_minutes, sort_order, is_published, region } = body

    const { data, error } = await supabaseAdmin
      .from('lessons')
      .update({
        title,
        description,
        video_url,
        duration_minutes,
        sort_order,
        is_published,
        region,
        updated_at: new Date().toISOString()
      })
      .eq('id', lessonId)
      .select()
      .single()

    if (error) {
      console.error('[ADMIN][EDU][lessons][PUT] Error:', error)
      return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lesson: data })
  } catch (error) {
    console.error('[ADMIN][EDU][lessons][PUT] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/edu/lessons/[lessonId] - Delete lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params

    const { error } = await supabaseAdmin
      .from('lessons')
      .delete()
      .eq('id', lessonId)

    if (error) {
      console.error('[ADMIN][EDU][lessons][DELETE] Error:', error)
      return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN][EDU][lessons][DELETE] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

