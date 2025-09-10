import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('content')
      .eq('section_key', 'home_stats')
      .single()

    if (error) {
      console.error('Error fetching home stats:', error)
      return NextResponse.json({ error: 'Failed to fetch home stats' }, { status: 500 })
    }

    const stats = data?.content?.stats || []
    return NextResponse.json(stats.sort((a: any, b: any) => a.order - b.order))
  } catch (error) {
    console.error('Error fetching home stats:', error)
    return NextResponse.json({ error: 'Failed to fetch home stats' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedStats = await request.json()
    
    // Validate the data structure
    if (!Array.isArray(updatedStats)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    // Update Supabase
    const { error } = await supabase
      .from('cms_content')
      .update({ 
        content: { stats: updatedStats },
        updated_at: new Date().toISOString()
      })
      .eq('section_key', 'home_stats')

    if (error) {
      console.error('Error updating home stats:', error)
      return NextResponse.json({ error: 'Failed to update home stats' }, { status: 500 })
    }

    return NextResponse.json({ success: true, stats: updatedStats })
  } catch (error) {
    console.error('Error updating home stats:', error)
    return NextResponse.json({ error: 'Failed to update home stats' }, { status: 500 })
  }
}
