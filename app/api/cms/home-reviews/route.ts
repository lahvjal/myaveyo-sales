import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

const defaultReviewsCopy = {
  section_number: '(3)',
  section_title: 'Reviews.',
  description:
    'Hear from real customers and reps about their experiences with our solar solutions.',
  is_published: false,
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('section_key', 'home_reviews')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching reviews copy:', error)
      return NextResponse.json({ error: 'Failed to fetch reviews copy' }, { status: 500 })
    }

    return NextResponse.json({ ...defaultReviewsCopy, ...data?.content })
  } catch (error) {
    console.error('Error in GET /api/cms/home-reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, is_published } = await request.json()

    const { error } = await supabase
      .from('cms_content')
      .upsert({
        section_key: 'home_reviews',
        content,
        is_published: is_published ?? false,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error saving reviews copy:', error)
      return NextResponse.json({ error: 'Failed to save reviews copy' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/cms/home-reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
