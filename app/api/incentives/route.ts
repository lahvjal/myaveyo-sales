import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateIncentiveData, calculateIncentiveStatus } from '@/lib/types/incentive'

export async function GET() {
  try {
    const { data: incentives, error } = await supabase
      .from('public_incentives')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching incentives:', error)
      return NextResponse.json({ error: 'Failed to fetch incentives' }, { status: 500 })
    }

    return NextResponse.json(incentives)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateIncentiveData = await request.json()
    
    // Calculate status based on dates
    const live_status = calculateIncentiveStatus(body.start_date, body.end_date)
    
    const { data: incentive, error } = await supabase
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
      console.error('Error creating incentive:', error)
      return NextResponse.json({ error: 'Failed to create incentive' }, { status: 500 })
    }

    return NextResponse.json(incentive, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
