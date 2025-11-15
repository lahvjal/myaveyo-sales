import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

// PUT /api/edu/notes/[noteId] - Update existing note
export async function PUT(
  request: NextRequest,
  { params }: { params: { noteId: string } }
) {
  try {
    const supabase = createSupabaseServer()
    const { noteId } = params

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    // Update note (RLS will ensure user owns it)
    const { data, error } = await supabase
      .from('lesson_notes')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('[EDU][notes][PUT] Error updating note:', error)
      return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, note: data })
  } catch (error) {
    console.error('[EDU][notes][PUT] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/edu/notes/[noteId] - Delete note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { noteId: string } }
) {
  try {
    const supabase = createSupabaseServer()
    const { noteId } = params

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete note (RLS will ensure user owns it)
    const { error } = await supabase
      .from('lesson_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[EDU][notes][DELETE] Error deleting note:', error)
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[EDU][notes][DELETE] Exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

