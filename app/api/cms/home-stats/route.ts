import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

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

    // Standardize to grid structure (wrap legacy shapes)
    const defaultContent = {
      grid: {
        cards: [
          { id: '1', title: 'Sales Stats.', subtitle: 'A real-time look into our company-wide sales metrics. They\'d be better if you worked here.', value: '', position: 1 },
          { id: '2', title: '_2025', subtitle: '', value: '', position: 2 },
          { id: '3', title: '5*', subtitle: 'Star Reviews', value: '', position: 3 },
          { id: '4', title: '45 days', subtitle: 'AVG Sale to Install', value: '', position: 4 },
          { id: '5', title: '30 days', subtitle: 'Install to PTO', value: '', position: 5 },
          { id: '6', title: '$679k', subtitle: 'Revenue Generated', value: '', position: 6 }
        ]
      }
    }

    const content = (() => {
      const c = data?.content
      if (!c) return defaultContent
      if (c.grid && c.grid.cards) return c
      // If grid exists with named keys like "card 1", convert to cards array
      if (c.grid && typeof c.grid === 'object' && !Array.isArray(c.grid)) {
        try {
          const gridObj = c.grid as Record<string, any>
          // Case A: keys like "card 1"
          const cardKeyEntries = Object.entries(gridObj)
            .filter(([k, v]) => /^card\s*\d+/i.test(k) && v && typeof v === 'object')
          const cardKeyCards = cardKeyEntries.map(([, v]) => v)
          // Case B: new named keys SectionHeader/decorText/stat1..stat4
          const namedKeys = ['SectionHeader', 'decorText', 'stat1', 'stat2', 'stat3', 'stat4']
          const namedCards = namedKeys
            .map(k => gridObj[k])
            .filter(Boolean)
          const combined = [...cardKeyCards, ...namedCards]
          const cards = combined
            .filter(v => v && typeof v === 'object')
            .sort((a: any, b: any) => Number(a?.position ?? a?.id ?? 0) - Number(b?.position ?? b?.id ?? 0))
          if (cards.length) return { grid: { cards } }
        } catch {}
      }
      if (Array.isArray(c.cards)) return { grid: { cards: c.cards } }
      return defaultContent
    })()

    return NextResponse.json({
      section_key: 'home_stats',
      content,
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
    const body = await request.json().catch(() => ({}))
    console.log('[CMS][home-stats][POST] received body:', JSON.stringify(body))
    const rawContent = body?.content
    const is_published = Boolean(body?.is_published) || false

    if (!rawContent) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    // For stats page, content is expected to include { cards: [...] }
    if (!rawContent.cards || !Array.isArray(rawContent.cards)) {
      return NextResponse.json({ error: 'Invalid data format: content.cards[] required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .upsert(
        {
          section_key: 'home_stats',
          content: rawContent,
          is_published,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section_key' }
      )
      .select('section_key, content, is_published')

    if (error) {
      console.error('[CMS][home-stats][POST] upsert error:', error)
      return NextResponse.json({ error: 'Failed to save home stats', details: error.message }, { status: 500 })
    }

    console.log('[CMS][home-stats][POST] upsert success for section_key=home_stats')
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error saving home stats CMS:', error)
    return NextResponse.json({ error: 'Failed to save home stats' }, { status: 500 })
  }
}
