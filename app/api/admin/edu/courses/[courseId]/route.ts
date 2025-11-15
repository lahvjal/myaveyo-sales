import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// PUT /api/admin/edu/courses/[courseId] - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params
    const body = await request.json()
    const { title, description, slug, sort_order, is_published } = body

    const { data, error } = await supabaseAdmin
      .from('courses')
      .update({
        title,
        description,
        slug,
        sort_order,
        is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      console.error('[ADMIN][EDU][courses][PUT] Error:', error)
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
    }

    return NextResponse.json({ success: true, course: data })
  } catch (error) {
    console.error('[ADMIN][EDU][courses][PUT] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/edu/courses/[courseId] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      console.error('[ADMIN][EDU][courses][DELETE] Error:', error)
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN][EDU][courses][DELETE] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

