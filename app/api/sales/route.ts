import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Prefer the standardized key 'home_sales', fallback to legacy 'sales'
    let { data, error } = await supabase
      .from('cms_content')
      .select('content')
      .eq('section_key', 'home_sales')
      .single()

    if (error?.code === 'PGRST116' || !data) {
      const fallback = await supabase
        .from('cms_content')
        .select('content')
        .eq('section_key', 'sales')
        .single()
      data = fallback.data as any
      error = fallback.error as any
    }

    if (error) {
      console.error('Error fetching sales content:', error)
      return NextResponse.json({ error: 'Failed to fetch sales content' }, { status: 500 })
    }

    const raw = (data as any)?.content || {}
    const grid = raw?.grid || {}

    // Return the object structured like Supabase stores it
    const response = {
      grid: {
        section_title: {
          prefix: grid?.section_title?.prefix ?? '(3)',
          title: grid?.section_title?.title ?? 'Not your average sales gig.',
          content: grid?.section_title?.content ?? ''
        },
        copyright: {
          icon: grid?.copyright?.icon ?? '/images/world.svg',
          text: grid?.copyright?.text ?? '2025 aveyo_sales'
        },
        h3_text: {
          text: grid?.h3_text?.text ?? ''
        },
        large_image: {
          alt: grid?.large_image?.alt ?? 'Sales representative',
          url: grid?.large_image?.url ?? '/images/donny-hammond.jpeg'
        },
        text_block: {
          title: grid?.text_block?.title ?? '',
          content: grid?.text_block?.content ?? ''
        },
        button_block: {
          text: grid?.button_block?.text ?? 'JOIN THE TEAM',
          variant: grid?.button_block?.variant ?? 'primary'
        },
        stat_card_1: {
          title: grid?.stat_card_1?.title ?? '',
          value: String(grid?.stat_card_1?.value ?? ''),
          prefix: grid?.stat_card_1?.prefix ?? '',
          suffix: grid?.stat_card_1?.suffix ?? '',
          description: grid?.stat_card_1?.description ?? ''
        },
        stat_card_2: {
          title: grid?.stat_card_2?.title ?? '',
          value: String(grid?.stat_card_2?.value ?? ''),
          prefix: grid?.stat_card_2?.prefix ?? '',
          suffix: grid?.stat_card_2?.suffix ?? '',
          description: grid?.stat_card_2?.description ?? ''
        },
        bottom_image: {
          alt: grid?.bottom_image?.alt ?? 'Team photo',
          url: grid?.bottom_image?.url ?? '/images/Alpha Aveyo-4.jpeg'
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching sales content:', error)
    return NextResponse.json({ error: 'Failed to fetch sales content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedContent = await request.json()
    const now = new Date().toISOString()

    // Primary: upsert into standardized key 'home_sales'
    const { error } = await supabase
      .from('cms_content')
      .upsert(
        {
          section_key: 'home_sales',
          content: updatedContent,
          updated_at: now,
        },
        { onConflict: 'section_key' }
      )

    if (error) {
      console.error('Error upserting home_sales content:', error)
      return NextResponse.json({ error: 'Failed to update sales content' }, { status: 500 })
    }

    // Optional: keep legacy 'sales' in sync for backwards compatibility
    await supabase
      .from('cms_content')
      .upsert(
        {
          section_key: 'sales',
          content: updatedContent,
          updated_at: now,
        },
        { onConflict: 'section_key' }
      )

    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error) {
    console.error('Error updating sales content:', error)
    return NextResponse.json({ error: 'Failed to update sales content' }, { status: 500 })
  }
}
