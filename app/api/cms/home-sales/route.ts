import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const defaultSalesData = {
  cards: [
    { id: '1', type: 'text', title: 'Not your average sales gig.', gridArea: '1 / 1', position: 1 },
    { id: '2', type: 'stat', title: '$100K+', subtitle: 'Average First Year Earnings', gridArea: '1 / 2', position: 2 },
    { id: '3', type: 'text', title: 'Apply Now', gridArea: '1 / 3', position: 3 },
    { id: '4', type: 'image', title: 'Sales Team Image', imageUrl: '/images/2980e3438b2a66112f1488048f70f451e7596fe1.png', gridArea: '3 / 1 / span 2', position: 4 },
    { id: '5', type: 'stat', title: '50+', subtitle: 'Sales Reps Nationwide', gridArea: '2 / 2', position: 5 },
    { id: '6', type: 'stat', title: '95%', subtitle: 'Customer Satisfaction', gridArea: '3 / 2', position: 6 },
    { id: '7', type: 'description', title: 'Join Our Team', description: 'We are looking for motivated individuals to join our growing sales team. Competitive compensation and comprehensive training provided.', gridArea: '2 / 3 / span 2', position: 7 },
    { id: '8', type: 'text', title: 'Remote Opportunities', gridArea: '4 / 2', position: 8 },
    { id: '9', type: 'text', title: 'Flexible Schedule', gridArea: '5 / 1', position: 9 },
    { id: '10', type: 'stat', title: '24/7', subtitle: 'Support Available', gridArea: '5 / 2', position: 10 },
    { id: '11', type: 'text', title: 'Career Growth', gridArea: '5 / 3', position: 11 }
  ],
  is_published: false
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('section_key', 'home_sales')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching sales data:', error)
      return NextResponse.json({ error: 'Failed to fetch sales data' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json(defaultSalesData)
    }

    return NextResponse.json(data.content)
  } catch (error) {
    console.error('Error in GET /api/cms/home-sales:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, is_published } = await request.json()

    const { data, error } = await supabase
      .from('cms_content')
      .upsert({
        section_key: 'home_sales',
        content,
        is_published: is_published || false,
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error saving sales data:', error)
      return NextResponse.json({ error: 'Failed to save sales data' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in POST /api/cms/home-sales:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
