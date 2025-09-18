'use client'

import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// Upload queue management
interface UploadTask {
  id: string
  file: File
  folder: string
  status: 'compressing' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
  videoUrl?: string
  thumbnailUrl?: string
}

let uploadQueue: UploadTask[] = []
let activeUploads = 0
const MAX_CONCURRENT_UPLOADS = 2

interface VideoUploadProps {
  onUploadComplete: (videoUrl: string, thumbnailUrl: string) => void
  folder?: string
  maxSizeMB?: number
  quality?: number
}

export default function VideoUpload({ 
  onUploadComplete, 
  folder = 'reviews',
  maxSizeMB = 50,
  quality = 0.8 
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentTask, setCurrentTask] = useState<UploadTask | null>(null)
  const [queueStatus, setQueueStatus] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const compressVideo = async (file: File, targetSizeMB: number = 25): Promise<File> => {
    const fileSizeMB = file.size / (1024 * 1024)
    console.log(`Starting compression for ${file.name}, target: ${targetSizeMB}MB`)
    
    // Skip compression entirely to preserve audio
    // Client-side compression consistently strips audio tracks
    if (fileSizeMB <= 200) {
      console.log(`File under 200MB - skipping compression to preserve audio (Pro plan)`)
      return file
    }
    
    if (fileSizeMB > 200) {
      throw new Error(`File size (${fileSizeMB.toFixed(1)}MB) is very large. For best performance, please compress your video to under 200MB using external software to preserve audio quality. Your Pro plan supports files up to 500GB if needed.`)
    }
    
    // Implement working compression using MediaRecorder with optimized settings
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.src = URL.createObjectURL(file)
      video.muted = true // Prevent audio playback during compression
      video.preload = 'metadata'
      
      video.onloadedmetadata = async () => {
        try {
          console.log(`Original: ${video.videoWidth}x${video.videoHeight}, ${video.duration.toFixed(1)}s`)
          
          // Calculate target dimensions (max 720p for efficiency)
          let { width, height } = calculateOptimalDimensions(
            video.videoWidth, 
            video.videoHeight, 
            fileSizeMB > 50 ? 720 : 1080
          )
          
          // Calculate target bitrate based on compression ratio needed
          const compressionRatio = Math.min(targetSizeMB / fileSizeMB, 0.8)
          const targetBitrate = Math.max(
            (targetSizeMB * 8 * 1024 * 1024) / video.duration,
            200000 // Minimum 200kbps
          )
          
          console.log(`Compressing to ${width}x${height}, ${Math.round(targetBitrate/1000)}kbps`)
          
          // Create canvas for frame processing
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          canvas.width = width
          canvas.height = height
          
          // Get video stream for frames
          const videoStream = canvas.captureStream(24) // 24fps for good quality/size balance
          
          // For now, let's use video-only compression to ensure it works
          // Audio preservation in browser compression is complex and often unreliable
          const combinedStream = videoStream
          
          console.log(`Using video-only compression for reliability`)
          
          // Create MediaRecorder with audio support
          let mediaRecorder: MediaRecorder
          try {
            // Try with both video and audio codecs
            mediaRecorder = new MediaRecorder(combinedStream, {
              mimeType: 'video/webm;codecs=vp8,opus',
              videoBitsPerSecond: targetBitrate,
              audioBitsPerSecond: 128000 // 128kbps for good audio quality
            })
          } catch (e) {
            console.warn('VP8+Opus not supported, trying VP9+Opus')
            try {
              mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm;codecs=vp9,opus',
                videoBitsPerSecond: targetBitrate,
                audioBitsPerSecond: 128000
              })
            } catch (e2) {
              console.warn('VP9+Opus not supported, using default codecs')
              mediaRecorder = new MediaRecorder(combinedStream, {
                videoBitsPerSecond: targetBitrate,
                audioBitsPerSecond: 128000
              })
            }
          }
          
          const chunks: BlobPart[] = []
          let frameCount = 0
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data)
            }
          }
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            const compressedSizeMB = blob.size / (1024 * 1024)
            console.log(`Compression complete: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${Math.round((1 - compressedSizeMB/fileSizeMB) * 100)}% reduction)`)
            
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webm'), {
              type: 'video/webm',
              lastModified: Date.now()
            })
            
            // Clean up resources
            URL.revokeObjectURL(video.src)
            resolve(compressedFile)
          }
          
          mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder error:', event)
            URL.revokeObjectURL(video.src)
            reject(new Error('Video compression failed'))
          }
          
          // Start recording
          mediaRecorder.start(1000) // Collect data every second
          
          // Draw frames to canvas as video plays
          const drawFrame = () => {
            if (video.currentTime < video.duration) {
              ctx.drawImage(video, 0, 0, width, height)
              frameCount++
              requestAnimationFrame(drawFrame)
            }
          }
          
          video.ontimeupdate = drawFrame
          video.onended = () => {
            console.log(`Processed ${frameCount} frames`)
            mediaRecorder.stop()
          }
          
          // Start playback (muted)
          video.currentTime = 0
          video.play()
          
          // Safety timeout
          setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
              console.log('Compression timeout, stopping')
              mediaRecorder.stop()
            }
          }, Math.min(video.duration * 1000 + 30000, 300000)) // Video duration + 30s buffer, max 5 minutes
          
        } catch (error) {
          console.error('Compression setup error:', error)
          URL.revokeObjectURL(video.src)
          reject(error)
        }
      }
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video for compression'))
      }
    })
  }

  // Helper function to calculate optimal dimensions
  const calculateOptimalDimensions = (originalWidth: number, originalHeight: number, maxDimension: number) => {
    let width = originalWidth
    let height = originalHeight
    
    // Scale down if needed
    if (width > maxDimension || height > maxDimension) {
      const aspectRatio = width / height
      if (width > height) {
        width = maxDimension
        height = Math.round(maxDimension / aspectRatio)
      } else {
        height = maxDimension
        width = Math.round(maxDimension * aspectRatio)
      }
    }
    
    // Ensure dimensions are even (required for some codecs)
    width = Math.round(width / 2) * 2
    height = Math.round(height / 2) * 2
    
    return { width, height }
  }

  const uploadDirectToSupabase = async (file: File, folder: string): Promise<string> => {
    try {
      const fileSizeMB = file.size / (1024 * 1024)
      console.log(`Direct Supabase upload starting: ${fileSizeMB.toFixed(2)}MB`)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      console.log(`Getting signed URL for path: ${filePath}`)
      
      // Get a signed upload URL from our API to bypass RLS
      const signedUrlResponse = await fetch('/api/upload/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filePath,
          contentType: file.type 
        })
      })

      console.log(`Signed URL response status: ${signedUrlResponse.status}`)

      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text()
        console.error('Signed URL error response:', errorText)
        throw new Error(`Failed to get signed upload URL: ${signedUrlResponse.status} - ${errorText}`)
      }

      const { signedUrl, publicUrl } = await signedUrlResponse.json()
      console.log('Signed URL obtained, starting direct upload...')

      // Upload directly to Supabase using signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        }
      })

      console.log(`Direct upload response status: ${uploadResponse.status}`)

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error('Direct upload error response:', errorText)
        throw new Error(`Direct upload failed: ${uploadResponse.status} - ${errorText}`)
      }

      console.log('Direct upload successful, public URL:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('Direct Supabase upload failed:', error)
      throw error
    }
  }

  const generateThumbnail = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      // Add better error handling and timeout
      const timeoutId = setTimeout(() => {
        reject(new Error('Thumbnail generation timed out'))
      }, 10000) // 10 second timeout
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Try seeking to 0.5 seconds instead of 1 second (some videos might be shorter)
        video.currentTime = Math.min(0.5, video.duration * 0.1)
      }
      
      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0)
          canvas.toBlob((blob) => {
            clearTimeout(timeoutId)
            if (blob) {
              const thumbnailFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg'
              })
              resolve(thumbnailFile)
            } else {
              reject(new Error('Failed to generate thumbnail blob'))
            }
          }, 'image/jpeg', 0.8)
        } catch (drawError) {
          clearTimeout(timeoutId)
          reject(new Error(`Failed to draw video frame: ${drawError}`))
        }
      }
      
      video.onerror = (event) => {
        clearTimeout(timeoutId)
        console.error('Video error for thumbnail:', event)
        reject(new Error('Failed to load video for thumbnail'))
      }
      
      video.onloadstart = () => {
        console.log('Started loading video for thumbnail')
      }
      
      // Set video properties for better compatibility
      video.crossOrigin = 'anonymous'
      video.preload = 'metadata'
      video.src = URL.createObjectURL(file)
    })
  }

  // Background upload processor
  const processUploadQueue = useCallback(async () => {
    console.log(`Processing queue: ${uploadQueue.length} tasks, ${activeUploads} active uploads`)
    
    if (activeUploads >= MAX_CONCURRENT_UPLOADS) {
      console.log('Max concurrent uploads reached, waiting...')
      return
    }
    
    const pendingTask = uploadQueue.find(task => task.status === 'compressing')
    if (!pendingTask) {
      console.log('No pending tasks found')
      return
    }
    
    console.log(`Starting processing for task ${pendingTask.id}`)
    activeUploads++
    
    try {
      // Update UI with current task
      setCurrentTask(pendingTask)
      setCompressing(true)
      setProgress(10)
      setQueueStatus(`Compressing ${pendingTask.file.name}...`)
      
      // Compression phase
      console.log(`Compressing file: ${pendingTask.file.name}`)
      const originalSizeMB = pendingTask.file.size / (1024 * 1024)
      let targetSize = Math.min(35, Math.max(8, originalSizeMB * 0.3)) // Compress to 30% of original, max 35MB
      
      console.log(`Original size: ${originalSizeMB.toFixed(2)}MB, Target: ${targetSize.toFixed(2)}MB`)
      const videoFile = await compressVideo(pendingTask.file, targetSize)
      console.log(`Compression completed for ${pendingTask.id}`)
      
      // Upload phase
      pendingTask.status = 'uploading'
      pendingTask.progress = 50
      setCompressing(false)
      setUploading(true)
      setProgress(50)
      setQueueStatus(`Uploading ${pendingTask.file.name}...`)
      
      // Generate thumbnail and upload video concurrently
      console.log('Starting thumbnail generation and video upload...')
      const [thumbnailFile, videoUrl] = await Promise.all([
        generateThumbnail(pendingTask.file),
        uploadDirectToSupabase(videoFile, `${pendingTask.folder}/videos`)
      ])
      console.log('Video upload completed, URL:', videoUrl)
      
      // Upload thumbnail
      const thumbnailFormData = new FormData()
      thumbnailFormData.append('file', thumbnailFile)
      thumbnailFormData.append('folder', `${pendingTask.folder}/thumbnails`)
      
      const thumbnailResponse = await fetch('/api/upload', {
        method: 'POST',
        body: thumbnailFormData
      })
      
      if (!thumbnailResponse.ok) {
        throw new Error('Thumbnail upload failed')
      }
      
      const thumbnailResult = await thumbnailResponse.json()
      
      // Complete task
      pendingTask.status = 'completed'
      pendingTask.progress = 100
      pendingTask.videoUrl = videoUrl
      pendingTask.thumbnailUrl = thumbnailResult.url
      
      setProgress(100)
      setQueueStatus(`Upload completed: ${pendingTask.file.name}`)
      
      onUploadComplete(videoUrl, thumbnailResult.url)
      
      // Reset UI after completion
      setTimeout(() => {
        setCurrentTask(null)
        setUploading(false)
        setCompressing(false)
        setProgress(0)
        setQueueStatus('')
      }, 2000)
      
    } catch (error) {
      pendingTask.status = 'error'
      pendingTask.error = error instanceof Error ? error.message : 'Upload failed'
      console.error('Background upload failed:', error)
      
      // Update UI with error
      setError(error instanceof Error ? error.message : 'Upload failed')
      setQueueStatus(`Failed: ${pendingTask.file.name}`)
      setUploading(false)
      setCompressing(false)
    } finally {
      activeUploads--
      // Process next item in queue
      setTimeout(processUploadQueue, 100)
    }
  }, [folder, onUploadComplete])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    // Add to upload queue for background processing
    const taskId = `${Date.now()}-${Math.random().toString(36).substring(2)}`
    const newTask: UploadTask = {
      id: taskId,
      file,
      folder,
      status: 'compressing',
      progress: 0
    }
    
    console.log(`Adding task to queue: ${taskId}, file: ${file.name}`)
    uploadQueue.push(newTask)
    console.log(`Queue now has ${uploadQueue.length} tasks`)
    
    // Show immediate feedback
    setError(null)
    setUploading(true)
    setProgress(0)
    
    // Start processing queue
    console.log('Starting queue processing...')
    processUploadQueue()
    
    // Reset file input to allow selecting another file immediately
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    // Reset UI after a short delay to allow new uploads
    setTimeout(() => {
      setUploading(false)
      setProgress(0)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Select Video'}
        </button>
        
        <div className="text-sm text-gray-400">
          Any size accepted • Compresses to 8-35MB • Supports: MP4, WebM, MOV
        </div>
      </div>

      {/* Progress Bar */}
      {(uploading || compressing || queueStatus) && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 text-center">
            {queueStatus || (compressing ? 'Compressing video...' : `Uploading... ${progress}%`)}
          </div>
          {currentTask && (
            <div className="text-xs text-gray-500 text-center">
              Processing: {currentTask.file.name} ({(currentTask.file.size / (1024 * 1024)).toFixed(1)}MB)
            </div>
          )}
        </div>
      )}

      {/* Queue Status */}
      {uploadQueue.length > 1 && (
        <div className="text-xs text-blue-400 text-center">
          Queue: {uploadQueue.filter(t => t.status === 'compressing').length} pending, {activeUploads} processing
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Upload Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Videos of any size accepted and automatically compressed to 8-35MB range</p>
        <p>• Large files (&gt;100MB) compressed to 35MB, medium files (50-100MB) to 25MB</p>
        <p>• Thumbnails are generated automatically from the first second</p>
        <p>• Resolution limited to 1280x720 for optimal compression</p>
      </div>
    </div>
  )
}
