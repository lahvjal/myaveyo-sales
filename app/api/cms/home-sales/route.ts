import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const defaultSalesData = {
  grid: {
    h3_text: {
      text: 'UNLIMITED POTENTIAL. PROVEN METHODS. MASSIVE EARNINGS. REAL FREEDOM. AND A CULTURE THAT CARES. HERE, YOUR HARD WORK SPEAKS FOR ITSELF.'
    },
    copyright: {
      icon: '/images/world.svg',
      text: '2025 aveyo_sales'
    },
    text_block: {
      title: 'A COMPLETELY KITTED TOOL KIT.',
      content: 'No limits, just wins. From your first deal to your biggest bonus, we set you up with the tools, training, and support you need to crush goals and climb fast. When you win, the whole team wins—and we celebrate every step of the way.'
    },
    large_image: {
      alt: 'Sales representative',
      url: '/images/donny-hammond.jpeg'
    },
    stat_card_1: {
      title: 'Sales Reps Nationwide',
      value: '150',
      prefix: '',
      suffix: '+',
      description: 'We are a growing team across the country'
    },
    stat_card_2: {
      title: 'Industry leading leadership',
      value: '3',
      prefix: 'TOP',
      suffix: '',
      description: 'And Sales Support'
    },
    bottom_image: {
      alt: 'Team photo',
      url: '/images/Alpha Aveyo-4.jpeg'
    },
    button_block: {
      text: 'JOIN THE TEAM',
      variant: 'primary'
    },
    section_title: {
      title: 'Not your average sales gig.',
      prefix: '(3)',
      content: ''
    }
  }
}

export async function GET() {
  try {
    console.log('[CMS][home-sales][GET] fetching content for section_key=home_sales')
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
      console.log('[CMS][home-sales][GET] no row found, returning defaultSalesData')
      return NextResponse.json(defaultSalesData)
    }

    console.log('[CMS][home-sales][GET] found row, returning content')
    return NextResponse.json(data.content)
  } catch (error) {
    console.error('Error in GET /api/cms/home-sales:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Writes for this section are centralized in POST /api/cms/content
