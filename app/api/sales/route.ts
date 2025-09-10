import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('content')
      .eq('section_key', 'sales')
      .single()

    if (error) {
      console.error('Error fetching sales content:', error)
      return NextResponse.json({ error: 'Failed to fetch sales content' }, { status: 500 })
    }

    const content = data?.content || {}
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching sales content:', error)
    return NextResponse.json({ error: 'Failed to fetch sales content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedContent = await request.json()
    
    // Update Supabase
    const { error } = await supabase
      .from('cms_content')
      .update({ 
        content: updatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('section_key', 'sales')

    if (error) {
      console.error('Error updating sales content:', error)
      return NextResponse.json({ error: 'Failed to update sales content' }, { status: 500 })
    }

    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error) {
    console.error('Error updating sales content:', error)
    return NextResponse.json({ error: 'Failed to update sales content' }, { status: 500 })
  }
}
