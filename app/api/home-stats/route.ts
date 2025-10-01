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

    // Support both shapes:
    // - New: content.stats = [{ value, prefix, suffix, title, order }]
    // - Legacy CMS: content.cards = [{ title, value, subtitle, position }]
    const content: any = data?.content || {}
    let stats = Array.isArray(content?.stats) ? content.stats : []

    if (!stats.length && Array.isArray(content?.cards)) {
      // Filter to cards with id 3..6 and order by id ascending
      const wantedIds = new Set(['3', '4', '5', '6', 3, 4, 5, 6])
      const filtered = content.cards
        .filter((c: any) => wantedIds.has(c?.id))
        .sort((a: any, b: any) => Number(a.id) - Number(b.id))

      const deriveFromTitle = (t: string | undefined, subtitle?: string) => {
        const title = String(t || '')
        const sub = String(subtitle || '')
        const hasDollar = title.includes('$') || sub.includes('$')
        const hasPercent = title.includes('%') || sub.includes('%')
        const hasDays = /\bdays?\b/i.test(title) || /\bdays?\b/i.test(sub)
        const hasK = /k$/i.test(title.trim()) || /k$/i.test(sub.trim())
        // Extract number (integer part)
        const numStr = title.match(/[0-9]+/g)?.join('') || '0'
        const num = Number(numStr)

        // If percent/days already indicated, do not compact
        if (hasPercent || hasDays) {
          const prefix = hasDollar ? '$' : undefined
          const suffix = hasPercent ? '%' : hasDays ? 'days' : hasK ? 'k' : undefined
          return { value: String(num), prefix, suffix }
        }

        // Compact numeric to max ~3 digits with k/m
        let compactValue = num
        let compactSuffix: string | undefined
        if (num >= 1_000_000) {
          compactValue = num / 1_000_000
          compactSuffix = 'm'
        } else if (num >= 1_000) {
          compactValue = num / 1_000
          compactSuffix = 'k'
        }

        const toMaxThree = (v: number) => {
          if (v >= 100) return Math.round(v).toString()
          if (v >= 10) return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '')
          return (Math.round(v * 100) / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '')
        }
        const valueStr = compactSuffix ? toMaxThree(compactValue) : String(num)
        const prefix = hasDollar ? '$' : undefined
        const suffix = compactSuffix || (hasK ? 'k' : undefined)
        // Always return a numeric-like string; API returns display value string (may include decimals)
        return { value: valueStr, prefix, suffix }
      }

      const coalesce = (a: any, b: any) => {
        if (a === undefined || a === null) return b
        if (typeof a === 'string' && a.trim() === '') return b
        return a
      }

      stats = filtered.map((c: any, idx: number) => {
        const derived = deriveFromTitle(c?.title, c?.subtitle)
        return {
          value: String(coalesce(c?.value, coalesce(derived.value, '0'))),
          prefix: coalesce(c?.prefix, derived.prefix),
          suffix: coalesce(c?.suffix, derived.suffix),
          title: c?.subtitle ?? '', // label comes from subtitle for these cards
          order: typeof c.order === 'number' ? c.order : (typeof c.position === 'number' ? c.position : idx)
        }
      })
    }

    stats = stats
      .map((s: any, idx: number) => ({
        value: String(s.value ?? '0'),
        prefix: s.prefix ?? undefined,
        suffix: s.suffix ?? undefined,
        title: s.title ?? s.label ?? '',
        order: typeof s.order === 'number' ? s.order : idx
      }))
      .sort((a: any, b: any) => a.order - b.order)

    return NextResponse.json(stats)
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
