import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get the first incentive to test its image
    const { data: incentives, error } = await supabase
      .from('public_incentives')
      .select('background_image_url')
      .limit(1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!incentives || incentives.length === 0) {
      return NextResponse.json({ message: 'No incentives found' }, { status: 404 })
    }

    const imageUrl = incentives[0].background_image_url

    // Test if the image URL is accessible
    try {
      const imageResponse = await fetch(imageUrl)
      return NextResponse.json({
        imageUrl,
        accessible: imageResponse.ok,
        status: imageResponse.status,
        statusText: imageResponse.statusText,
        headers: Object.fromEntries(imageResponse.headers.entries())
      })
    } catch (fetchError) {
      return NextResponse.json({
        imageUrl,
        accessible: false,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
      })
    }

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
