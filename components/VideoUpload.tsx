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
  const [progress, setProgress] = useState(0) // legacy
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentTask, setCurrentTask] = useState<UploadTask | null>(null)
  const [queueStatus, setQueueStatus] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null)

  const startUploadProgress = () => {
    setUploadProgress(5)
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current)
    uploadTimerRef.current = setInterval(() => {
      setUploadProgress((p) => (p < 90 ? p + 2 : p))
    }, 300)
  }

  const finalizeUploadProgress = () => {
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current)
      uploadTimerRef.current = null
    }
    setUploadProgress(100)
  }

  const resetUploadProgress = () => {
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current)
      uploadTimerRef.current = null
    }
    setUploadProgress(0)
  }

  const compressVideo = async (file: File, targetSizeMB: number = 25): Promise<File> => {
    const fileSizeMB = file.size / (1024 * 1024)
    console.log(`Starting compression for ${file.name}, target: ${targetSizeMB}MB`)
    
    if (fileSizeMB > 200) {
      throw new Error(`File size (${fileSizeMB.toFixed(1)}MB) is very large. Please compress below 200MB before uploading.`)
    }
    
    // Implement resizing/compression using MediaRecorder
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.src = URL.createObjectURL(file)
      video.muted = true // Prevent audio playback during processing
      video.preload = 'metadata'
      
      video.onloadedmetadata = async () => {
        try {
          console.log(`Original: ${video.videoWidth}x${video.videoHeight}, ${video.duration.toFixed(1)}s`)
          
          // Decide if we must resize: enforce max dimension 1080px
          const mustResize = Math.max(video.videoWidth, video.videoHeight) > 1080
          // Calculate target dimensions: cap at 1080 on the longest side
          let { width, height } = calculateOptimalDimensions(
            video.videoWidth,
            video.videoHeight,
            1080
          )
          // If no resize needed and file is within safe limit, skip processing
          if (!mustResize && fileSizeMB <= 200) {
            console.log('No resize needed and file under cap – skipping compression')
            URL.revokeObjectURL(video.src)
            resolve(file)
            return
          }
          
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
          const videoStream = canvas.captureStream(24) // 24fps for quality/size balance

          // Try to capture original audio and merge with the canvas video stream
          let combinedStream: MediaStream = videoStream
          try {
            const mediaWithAudio: MediaStream | undefined = (video as any).captureStream?.() || (video as any).mozCaptureStream?.()
            if (mediaWithAudio) {
              const audioTracks = mediaWithAudio.getAudioTracks()
              if (audioTracks && audioTracks.length > 0) {
                combinedStream = new MediaStream([
                  ...videoStream.getTracks(),
                  ...audioTracks
                ])
                console.log('Audio track attached to compression stream')
              }
            }
          } catch (e) {
            console.warn('Audio track capture failed, proceeding without audio', e)
          }
          
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
              // Update compression progress based on playback position
              const pct = Math.min(100, Math.max(0, (video.currentTime / video.duration) * 100))
              setCompressionProgress(pct)
              requestAnimationFrame(drawFrame)
            }
          }
          
          video.ontimeupdate = drawFrame
          video.onended = () => {
            console.log(`Processed ${frameCount} frames`)
            mediaRecorder.stop()
            setCompressionProgress(100)
          }
          
          // Start playback (muted) and draw frames to scaled canvas
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

      // Supabase signed upload URLs often cap payloads (~50MB). Fallback to our API for larger files.
      const SIGNED_UPLOAD_SAFE_MB = 50

      if (fileSizeMB > SIGNED_UPLOAD_SAFE_MB) {
        console.log(`File > ${SIGNED_UPLOAD_SAFE_MB}MB, using server upload route /api/upload`)
        const form = new FormData()
        form.append('file', file)
        form.append('folder', `${folder}`)
        startUploadProgress()
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: form })
        if (!uploadRes.ok) {
          const errText = await uploadRes.text()
          resetUploadProgress()
          throw new Error(`Server upload failed: ${uploadRes.status} - ${errText}`)
        }
        const result = await uploadRes.json()
        if (!result?.url) throw new Error('Server upload returned no URL')
        console.log('Server upload successful, public URL:', result.url)
        finalizeUploadProgress()
        return result.url
      }

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
      startUploadProgress()
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
        // Fallback automatically if payload too large (413 / 400 payload) or similar
        if (uploadResponse.status === 413 || uploadResponse.status === 400) {
          console.log('Direct upload rejected due to size. Falling back to server upload...')
          const form = new FormData()
          form.append('file', file)
          form.append('folder', `${folder}`)
          resetUploadProgress()
          startUploadProgress()
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: form })
          if (!uploadRes.ok) {
            const errText = await uploadRes.text()
            resetUploadProgress()
            throw new Error(`Server upload failed: ${uploadRes.status} - ${errText}`)
          }
          const result = await uploadRes.json()
          if (!result?.url) throw new Error('Server upload returned no URL')
          console.log('Server upload (fallback) successful, public URL:', result.url)
          finalizeUploadProgress()
          return result.url
        }
        throw new Error(`Direct upload failed: ${uploadResponse.status} - ${errorText}`)
      }

      console.log('Direct upload successful, public URL:', publicUrl)
      finalizeUploadProgress()
      return publicUrl
    } catch (error) {
      console.error('Direct Supabase upload failed:', error)
      resetUploadProgress()
      throw error
    }
  }

  const generateThumbnail = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      let settled = false
      const settle = (fn: () => void) => {
        if (settled) return
        settled = true
        cleanup()
        fn()
      }

      const cleanup = () => {
        video.onloadedmetadata = null
        video.onseeked = null
        video.onloadeddata = null
        video.onerror = null
        URL.revokeObjectURL(url)
        clearTimeout(overallTimeout)
        if (seekTimeout !== undefined) clearTimeout(seekTimeout)
      }

      const finalizeFromCurrentFrame = () => {
        try {
          canvas.width = Math.max(2, video.videoWidth)
          canvas.height = Math.max(2, video.videoHeight)
          ctx.drawImage(video, 0, 0)
          canvas.toBlob((blob) => {
            if (!blob) return settle(() => reject(new Error('Failed to generate thumbnail blob')))
            const thumbnailFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' })
            settle(() => resolve(thumbnailFile))
          }, 'image/jpeg', 0.85)
        } catch (e) {
          settle(() => reject(new Error(`Failed to draw video frame: ${e}`)))
        }
      }

      const overallTimeout = window.setTimeout(() => {
        settle(() => reject(new Error('Thumbnail generation timed out')))
      }, 20000) // 20s overall timeout

      let seekTimeout: number | undefined = undefined

      video.onloadedmetadata = () => {
        // Kick off a quick seek to an early frame; also listen to loadeddata as fallback
        seekTimeout = window.setTimeout(() => {
          // If seeking never fires, fall back to whatever we have
          finalizeFromCurrentFrame()
        }, 4000) // 4s seek timeout
        const target = Math.min(0.5, Math.max(0.1, video.duration * 0.05))
        try {
          video.currentTime = target
        } catch {
          // Some browsers throw on immediate seek; rely on loadeddata
        }
      }

      video.onloadeddata = () => {
        // If loadeddata fires before seeked, we can already draw a valid first frame
        if (!settled) finalizeFromCurrentFrame()
      }

      video.onseeked = () => {
        if (seekTimeout) clearTimeout(seekTimeout)
        if (!settled) finalizeFromCurrentFrame()
      }

      video.onerror = (event) => {
        settle(() => reject(new Error('Failed to load video for thumbnail')))
      }

      video.crossOrigin = 'anonymous'
      video.preload = 'auto'
      video.src = url
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
      setCompressionProgress(0)
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
      setUploadProgress(0)
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
      
      setUploadProgress(100)
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
      setCompressionProgress(0)
      setUploadProgress(0)
      resetUploadProgress()
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

      {(uploading || compressing || queueStatus) && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Compression</span><span>{Math.round(compressionProgress)}%</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${compressionProgress}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Upload</span><span>{Math.round(uploadProgress)}%</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
          <div className="text-sm text-gray-400 text-center">{queueStatus}</div>
          {currentTask && (
            <div className="text-xs text-gray-500 text-center">
              Processing: {currentTask.file.name} ({(currentTask.file.size / (1024 * 1024)).toFixed(1)}MB)
            </div>
          )}
        </div>
      )}

      {uploadQueue.length > 1 && (
        <div className="text-xs text-blue-400 text-center">
          Queue: {uploadQueue.filter(t => t.status === 'compressing').length} pending, {activeUploads} processing
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Videos of any size accepted and automatically compressed to 8-35MB range</p>
        <p>• Large files (&gt;100MB) compressed to 35MB, medium files (50-100MB) to 25MB</p>
        <p>• Thumbnails are generated automatically from the first second</p>
        <p>• Resolution limited to 1280x720 for optimal compression</p>
      </div>
    </div>
  )
}
