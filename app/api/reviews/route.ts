import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'customer', 'rep', or null for all
    const featured = searchParams.get('featured') // 'true' for featured only
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query with optional filters
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (type && (type === 'customer' || type === 'rep')) {
      query = query.eq('type', type)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data: reviews, error } = await query.limit(limit)

    if (error) throw error

    return NextResponse.json(reviews || [])
  } catch (error) {
    console.error('Reviews API Error:', error)
    
    // Return mock data as fallback
    const mockReviews = [
      {
        id: '1',
        title: 'Amazing Solar Installation Experience',
        description: 'Customer shares their positive experience with Aveyo solar installation',
        video_url: '/videos/customer-review-1.mp4',
        thumbnail_url: '/images/customer-review-1-thumb.jpg',
        type: 'customer',
        featured: true,
        customer_name: 'John Smith',
        location: 'Austin, TX',
        date_recorded: '2024-12-15',
        status: 'active'
      },
      {
        id: '2',
        title: 'Top Rep Performance Review',
        description: 'Sales rep discusses their success strategies',
        video_url: '/videos/rep-review-1.mp4',
        thumbnail_url: '/images/rep-review-1-thumb.jpg',
        type: 'rep',
        featured: true,
        rep_name: 'Austin Townsend',
        location: 'Dallas, TX',
        date_recorded: '2024-12-10',
        status: 'active'
      },
      {
        id: '3',
        title: 'Family Loves Their Solar System',
        description: 'Happy family testimonial about their solar savings',
        video_url: '/videos/customer-review-2.mp4',
        thumbnail_url: '/images/customer-review-2-thumb.jpg',
        type: 'customer',
        featured: false,
        customer_name: 'Sarah Johnson',
        location: 'Houston, TX',
        date_recorded: '2024-12-08',
        status: 'active'
      },
      {
        id: '4',
        title: 'Rep Training Success Story',
        description: 'New rep shares their training experience',
        video_url: '/videos/rep-review-2.mp4',
        thumbnail_url: '/images/rep-review-2-thumb.jpg',
        type: 'rep',
        featured: false,
        rep_name: 'Sawyer Kieffer',
        location: 'San Antonio, TX',
        date_recorded: '2024-12-05',
        status: 'active'
      }
    ]

    return NextResponse.json(mockReviews)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: review, error } = await supabase
      .from('reviews')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(review)
  } catch (error) {
    console.error('Create Review Error:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const { data: review, error } = await supabase
      .from('reviews')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(review)
  } catch (error) {
    console.error('Update Review Error:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Review Error:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
