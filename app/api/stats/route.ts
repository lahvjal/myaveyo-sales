import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateStatsContentData, UpdateStatsContentData } from '@/lib/types/stats'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('stats_content')
      .select('*')
      .order('section')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching stats content:', error)
    return NextResponse.json({ error: 'Failed to fetch stats content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateStatsContentData = await request.json()
    
    const { data, error } = await supabase
      .from('stats_content')
      .insert([{
        section: body.section,
        title: body.title,
        subtitle: body.subtitle,
        content: body.content
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating stats content:', error)
    return NextResponse.json({ error: 'Failed to create stats content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: UpdateStatsContentData = await request.json()
    
    const { data, error } = await supabase
      .from('stats_content')
      .update({
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating stats content:', error)
    return NextResponse.json({ error: 'Failed to update stats content' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('stats_content')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting stats content:', error)
    return NextResponse.json({ error: 'Failed to delete stats content' }, { status: 500 })
  }
}
