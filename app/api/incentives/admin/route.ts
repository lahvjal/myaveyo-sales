import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Admin endpoint to get ALL incentives (including unpublished)
export async function GET() {
  try {
    const { data: incentives, error } = await supabase
      .from('public_incentives')
      .select('*')
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
