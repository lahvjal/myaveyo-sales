import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Generic CMS content upsert endpoint
// Request body: { section_key: string, content: any, is_published?: boolean }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const section_key = body?.section_key as string
    const rawContent = body?.content ?? {}
    const is_published = Boolean(body?.is_published) || false

    if (!section_key) {
      return NextResponse.json({ error: 'section_key is required' }, { status: 400 })
    }

    // IMPORTANT: Do not reshape content here. Store exactly what caller provides.
    const content = rawContent

    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .upsert(
        {
          section_key,
          content,
          is_published,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section_key' }
      )
      .select('section_key, content, is_published')

    if (error) {
      console.error('[CMS][content][POST] upsert error:', error)
      return NextResponse.json({ error: 'Failed to save cms content', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[CMS][content][POST] exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
