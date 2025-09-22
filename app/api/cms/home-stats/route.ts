import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('section_key', 'home_stats')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching home stats CMS:', error)
      return NextResponse.json({ error: 'Failed to fetch home stats' }, { status: 500 })
    }

    // Return the full CMS data structure or default
    const defaultContent = {
      cards: [
        { id: '1', title: 'Sales Stats.', subtitle: 'A real-time look into our company-wide sales metrics. They\'d be better if you worked here.', value: '', position: 1 },
        { id: '2', title: '_2025', subtitle: '', value: '', position: 2 },
        { id: '3', title: '5*', subtitle: 'Star Reviews', value: '', position: 3 },
        { id: '4', title: '45 days', subtitle: 'AVG Sale to Install', value: '', position: 4 },
        { id: '5', title: '30 days', subtitle: 'Install to PTO', value: '', position: 5 },
        { id: '6', title: '$679k', subtitle: 'Revenue Generated', value: '', position: 6 }
      ]
    }

    return NextResponse.json({
      section_key: 'home_stats',
      content: data?.content || defaultContent,
      is_published: data?.is_published || false,
      created_at: data?.created_at || null,
      updated_at: data?.updated_at || null
    })
  } catch (error) {
    console.error('Error fetching home stats CMS:', error)
    return NextResponse.json({ error: 'Failed to fetch home stats' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, is_published } = await request.json()
    
    // Validate the data structure
    if (!content || !content.cards || !Array.isArray(content.cards)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from('cms_content')
      .select('id')
      .eq('section_key', 'home_stats')
      .single()

    let result
    if (existing) {
      // Update existing record
      result = await supabase
        .from('cms_content')
        .update({ 
          content,
          is_published: is_published || false,
          updated_at: new Date().toISOString()
        })
        .eq('section_key', 'home_stats')
        .select()
        .single()
    } else {
      // Insert new record
      result = await supabase
        .from('cms_content')
        .insert({ 
          section_key: 'home_stats',
          content,
          is_published: is_published || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error saving home stats CMS:', result.error)
      return NextResponse.json({ error: 'Failed to save home stats' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: result.data 
    })
  } catch (error) {
    console.error('Error saving home stats CMS:', error)
    return NextResponse.json({ error: 'Failed to save home stats' }, { status: 500 })
  }
}
