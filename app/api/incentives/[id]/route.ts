import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { UpdateIncentiveData, calculateIncentiveStatus } from '@/lib/types/incentive'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: incentive, error } = await supabase
      .from('public_incentives')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching incentive:', error)
      return NextResponse.json({ error: 'Incentive not found' }, { status: 404 })
    }

    return NextResponse.json(incentive)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Omit<UpdateIncentiveData, 'id'> = await request.json()
    
    // Calculate status based on dates if dates are provided
    const updateData = { ...body }
    if (body.start_date && body.end_date) {
      updateData.live_status = calculateIncentiveStatus(body.start_date, body.end_date)
    }
    
    const { data: incentive, error } = await supabase
      .from('public_incentives')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating incentive:', error)
      return NextResponse.json({ error: 'Failed to update incentive' }, { status: 500 })
    }

    return NextResponse.json(incentive)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('public_incentives')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting incentive:', error)
      return NextResponse.json({ error: 'Failed to delete incentive' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Incentive deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
