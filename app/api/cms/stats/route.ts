import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET: fetch content for the standalone Stats page CMS (section_key = 'stats_page')
// Returns standardized { grid: { cards: [...] } }, wrapping legacy shapes when needed.
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('section_key', 'stats_page')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[CMS][stats][GET] error:', error)
      return NextResponse.json({ error: 'Failed to fetch stats page CMS' }, { status: 500 })
    }

    const defaultContent = {
      grid: {
        pageHeader: {
          prefix: '(1)',
          text: 'WHY SELL SOLAR WITH AVEYO?'
        },
        subHeader: {
          whiteText: 'Real Numbers. Real earnings. real impact.',
          greyText: "Here’s how aveyo stacks up against the jobs most people settle for"
        },
        Section1: {
          title: 'THE BIG COMPARISON',
          stat1: { name: 'Food Delivery', prefix: '$', value: '13', suffix: 'K' },
          stat2: { name: 'Retail Associates', prefix: '$', value: '25', suffix: 'K' },
          stat3: { name: 'Call Center Rep', prefix: '$', value: '35', suffix: 'K' },
          stat4: { name: 'Aveyo Solar Sales Rep', prefix: '$', value: '120+', suffix: 'K' }
        },
        Section2: {
          title: 'YOUR GROWTH PATH WITH AVEYO',
          stat1: { name: 'Rookie', prefix: '$', value: '30', suffix: 'K' },
          stat2: { name: 'Growing Rep', prefix: '$', value: '70', suffix: 'K' },
          stat3: { name: 'Pro', prefix: '$', value: '140', suffix: 'K' },
          stat4: { name: 'Veteran', prefix: '$', value: '200+', suffix: 'K' }
        },
        Section3: {
          title: 'WHAT ONE SALE MEANS',
          stat1: { name: 'Your Commission', prefix: '$', value: '2500', suffix: '' },
          stat2: { name: 'Customer Savings (1 year)', prefix: '$', value: '1500', suffix: '' },
          stat3: { name: 'Carbon Offset', prefix: '', value: '15', suffix: 'Trees Planted' }
        }
      }
    }

    const content = (() => {
      const c = data?.content
      if (!c) return defaultContent
      // For stats_page we use nested grid object; if grid exists, pass through
      if (c.grid && typeof c.grid === 'object') return c
      return defaultContent
    })()

    // If row missing or had no content, seed the table once with defaultContent
    try {
      if (!data?.content) {
        await supabaseAdmin
          .from('cms_content')
          .upsert(
            {
              section_key: 'stats_page',
              content,
              is_published: false,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'section_key' }
          )
      }
    } catch (seedErr) {
      console.warn('[CMS][stats][GET] seed warning:', seedErr)
    }

    return NextResponse.json({
      section_key: 'stats_page',
      content,
      is_published: data?.is_published || false,
      created_at: data?.created_at || null,
      updated_at: data?.updated_at || null
    })
  } catch (error) {
    console.error('[CMS][stats][GET] exception:', error)
    return NextResponse.json({ error: 'Failed to fetch stats page CMS' }, { status: 500 })
  }
}
