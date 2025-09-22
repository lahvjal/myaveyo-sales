import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

const defaultIncentivesCopy = {
  section_number: '(2)',
  section_title: 'Incentives.',
  description:
    'Great commissions are nice, but incredible incentives can be even cooler. Check out what we have cooking.',
  is_published: false,
  filters: ['All', 'Live', 'Coming Soon', 'Done'],
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('section_key', 'home_incentives')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching incentives copy:', error)
      return NextResponse.json({ error: 'Failed to fetch incentives copy' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json(defaultIncentivesCopy)
    }

    return NextResponse.json({ ...defaultIncentivesCopy, ...data.content })
  } catch (error) {
    console.error('Error in GET /api/cms/home-incentives:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, is_published } = await request.json()

    const { data, error } = await supabase
      .from('cms_content')
      .upsert({
        section_key: 'home_incentives',
        content,
        is_published: is_published ?? false,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Error saving incentives copy:', error)
      return NextResponse.json({ error: 'Failed to save incentives copy' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in POST /api/cms/home-incentives:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
