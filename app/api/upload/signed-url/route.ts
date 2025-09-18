import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIGNED URL API CALLED ===')
    const { filePath, contentType } = await request.json()
    console.log('Request data:', { filePath, contentType })
    
    if (!filePath) {
      console.error('No file path provided')
      return NextResponse.json({ error: 'File path is required' }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }

    console.log('Creating signed upload URL for:', filePath)
    
    // Create a signed upload URL that bypasses RLS
    const { data, error } = await supabaseAdmin.storage
      .from('media-assets')
      .createSignedUploadUrl(filePath, {
        upsert: false
      })

    if (error) {
      console.error('Signed URL creation error:', error)
      return NextResponse.json({ 
        error: `Failed to create signed URL: ${error.message}` 
      }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }

    console.log('Signed URL created successfully')
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('media-assets')
      .getPublicUrl(filePath)

    console.log('Public URL generated:', publicUrl)

    return NextResponse.json({
      signedUrl: data.signedUrl,
      publicUrl,
      filePath
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  } catch (error) {
    console.error('Signed URL API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
