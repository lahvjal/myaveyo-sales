import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Configure for Vercel deployment
export const maxDuration = 60 // Maximum duration for Pro plans
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Max raw upload size allowed by this route (videos should normally use signed URL direct PUT)
const MAX_UPLOAD_MB = 200

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('=== UPLOAD API CALLED ===')
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    // Check environment variables
    console.log('Environment check:', {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseServiceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    })
    
    // Check content length to prevent oversized requests
    const contentLength = request.headers.get('content-length')
    console.log('Content-Length header:', contentLength)
    
    if (contentLength && parseInt(contentLength) > MAX_UPLOAD_MB * 1024 * 1024) {
      console.log('Request too large:', contentLength)
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_UPLOAD_MB}MB.` 
      }, { status: 413 })
    }

    console.log('Parsing form data...')
    const formData = await request.formData()
    console.log('Form data parsed successfully')
    
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'incentives'
    
    console.log('Form data contents:', {
      fileExists: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder
    })
    
    if (!file) {
      console.error('No file provided in form data')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`)

    // Validate file size (client-side compression/direct upload should handle this, but double-check)
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > MAX_UPLOAD_MB) {
      console.log('File size validation failed:', fileSizeMB)
      return NextResponse.json({ 
        error: `File size (${fileSizeMB.toFixed(2)}MB) exceeds ${MAX_UPLOAD_MB}MB limit` 
      }, { status: 413 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    console.log(`Generated file path: ${filePath}`)

    // Convert File to ArrayBuffer for better compatibility with Supabase
    console.log('Converting file to ArrayBuffer...')
    const arrayBuffer = await file.arrayBuffer()
    console.log(`ArrayBuffer created: ${arrayBuffer.byteLength} bytes`)
    
    // Test Supabase connection first
    console.log('Testing Supabase connection...')
    try {
      const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
      if (bucketsError) {
        console.error('Supabase connection test failed:', bucketsError)
        return NextResponse.json({ 
          error: 'Storage service unavailable',
          details: bucketsError.message 
        }, { status: 503 })
      }
      console.log('Supabase connection successful. Available buckets:', buckets?.map(b => b.name))
    } catch (connError) {
      console.error('Supabase connection error:', connError)
      return NextResponse.json({ 
        error: 'Storage service connection failed',
        details: connError instanceof Error ? connError.message : 'Unknown connection error'
      }, { status: 503 })
    }
    
    // Upload to Supabase Storage using admin client (bypasses RLS)
    console.log('Starting Supabase upload...')
    const uploadStartTime = Date.now()
    
    const { data, error } = await supabaseAdmin.storage
      .from('media-assets')
      .upload(filePath, arrayBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    const uploadDuration = Date.now() - uploadStartTime
    console.log(`Upload attempt completed in ${uploadDuration}ms`)

    if (error) {
      console.error('Supabase upload error:', error)
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      return NextResponse.json({ 
        error: `Upload failed: ${error.message}`,
        details: error,
        uploadDuration 
      }, { status: 500 })
    }

    console.log('Upload successful:', data)

    // Get public URL
    console.log('Generating public URL...')
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('media-assets')
      .getPublicUrl(filePath)

    console.log('Public URL generated:', publicUrl)

    const totalDuration = Date.now() - startTime
    console.log(`=== UPLOAD COMPLETED SUCCESSFULLY in ${totalDuration}ms ===`)

    return NextResponse.json({ 
      url: publicUrl,
      path: filePath,
      size: file.size,
      type: file.type,
      uploadDuration,
      totalDuration
    })
  } catch (error) {
    const totalDuration = Date.now() - startTime
    console.error('=== UPLOAD FAILED ===')
    console.error('Unexpected upload error:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'Unknown',
      totalDuration
    })
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage,
      timestamp: new Date().toISOString(),
      totalDuration
    }, { status: 500 })
  }
}
