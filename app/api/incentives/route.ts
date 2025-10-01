import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase-server'
import { getIncentives, calculateIncentiveStatus } from '@/lib/data/incentives'

// Simple types for incentives
interface CreateIncentiveData {
  title: string
  description?: string
  category: string
  category_color: string
  background_image_url: string
  background_video_url?: string
  start_date: string
  end_date: string
  sort_order?: number
  is_published?: boolean
}

// Service-role client for admin writes (retain for POST)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const supabase = createSupabaseServer()
    const incentives = await getIncentives(supabase)
    return NextResponse.json(incentives)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateIncentiveData = await request.json()
    
    // Calculate status based on dates
    const live_status = calculateIncentiveStatus(body.start_date, body.end_date)
    
    const { data: incentive, error } = await supabaseAdmin
      .from('public_incentives')
      .insert([{            
        ...body,
        live_status,
        sort_order: body.sort_order || 0,
        is_published: body.is_published ?? true
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create incentive' }, { status: 500 })
    }

    return NextResponse.json(incentive, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
