'use client'

import { useState, useRef } from 'react'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const compressVideo = (file: File, targetSizeMB: number = 25): Promise<File> => {
    return new Promise((resolve, reject) => {
      setCompressing(true)
      
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      video.onloadedmetadata = () => {
        // Set canvas dimensions (reduce resolution if needed for compression)
        const maxWidth = 1280
        const maxHeight = 720
        let { videoWidth: width, videoHeight: height } = video
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Create MediaRecorder for compression
        const stream = canvas.captureStream(30) // 30 FPS
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 1000000 // Start with 1Mbps, will adjust if needed
        })
        
        const chunks: BlobPart[] = []
        let currentTime = 0
        const duration = video.duration
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data)
          }
        }
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' })
          const sizeMB = blob.size / (1024 * 1024)
          
          if (sizeMB <= targetSizeMB) {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webm'), {
              type: 'video/webm',
              lastModified: Date.now()
            })
            setCompressing(false)
            resolve(compressedFile)
          } else {
            // If still too large, try with lower bitrate
            setCompressing(false)
            reject(new Error('Video compression failed - file still too large'))
          }
        }
        
        mediaRecorder.onerror = (event) => {
          setCompressing(false)
          reject(new Error('Video compression failed'))
        }
        
        // Start recording
        mediaRecorder.start()
        
        // Draw video frames to canvas
        const drawFrame = () => {
          if (currentTime < duration) {
            video.currentTime = currentTime
            video.onseeked = () => {
              ctx.drawImage(video, 0, 0, width, height)
              currentTime += 1/30 // 30 FPS
              setProgress(Math.round(25 + (currentTime / duration) * 50)) // 25-75% for compression
              requestAnimationFrame(drawFrame)
            }
          } else {
            mediaRecorder.stop()
          }
        }
        
        drawFrame()
      }
      
      video.onerror = () => {
        setCompressing(false)
        reject(new Error('Failed to load video for compression'))
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  const generateThumbnail = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        video.currentTime = 1 // Seek to 1 second for thumbnail
      }
      
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg'
            })
            resolve(thumbnailFile)
          } else {
            reject(new Error('Failed to generate thumbnail'))
          }
        }, 'image/jpeg', 0.8)
      }
      
      video.onerror = () => reject(new Error('Failed to load video for thumbnail'))
      video.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      // Always compress video to target range (8MB-45MB)
      const originalSizeMB = file.size / (1024 * 1024)
      console.log(`Original video size: ${originalSizeMB.toFixed(2)}MB`)
      
      let videoFile = file
      let targetSize = 25 // Default target size in MB
      
      // Determine target size based on original file size
      if (originalSizeMB > 100) {
        targetSize = 45 // Large files get compressed to 45MB
      } else if (originalSizeMB > 50) {
        targetSize = 35 // Medium files get compressed to 35MB
      } else if (originalSizeMB > 25) {
        targetSize = 25 // Smaller files get compressed to 25MB
      } else if (originalSizeMB > 8) {
        targetSize = Math.max(8, originalSizeMB * 0.8) // Compress slightly if over 8MB
      } else {
        // Files under 8MB don't need compression
        targetSize = originalSizeMB
      }
      
      if (originalSizeMB > 8) {
        console.log(`Compressing video to target size: ${targetSize}MB`)
        setProgress(10)
        videoFile = await compressVideo(file, targetSize)
        const compressedSizeMB = videoFile.size / (1024 * 1024)
        console.log(`Compressed video size: ${compressedSizeMB.toFixed(2)}MB`)
      }

      // Generate thumbnail
      setProgress(75)
      const thumbnailFile = await generateThumbnail(videoFile)

      // Upload video
      setProgress(85)
      const videoFormData = new FormData()
      videoFormData.append('file', videoFile)
      videoFormData.append('folder', `${folder}/videos`)

      const videoResponse = await fetch('/api/upload', {
        method: 'POST',
        body: videoFormData
      })

      if (!videoResponse.ok) throw new Error('Video upload failed')
      const videoResult = await videoResponse.json()

      // Upload thumbnail
      setProgress(95)
      const thumbnailFormData = new FormData()
      thumbnailFormData.append('file', thumbnailFile)
      thumbnailFormData.append('folder', `${folder}/thumbnails`)

      const thumbnailResponse = await fetch('/api/upload', {
        method: 'POST',
        body: thumbnailFormData
      })

      if (!thumbnailResponse.ok) throw new Error('Thumbnail upload failed')
      const thumbnailResult = await thumbnailResponse.json()

      setProgress(100)
      onUploadComplete(videoResult.url, thumbnailResult.url)
      
      // Reset
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setCompressing(false)
      setProgress(0)
    }
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
          Any size accepted • Compresses to 8-45MB • Supports: MP4, WebM, MOV
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 text-center">
            {compressing ? 'Compressing video...' : `Uploading... ${progress}%`}
          </div>
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
        <p>• Videos of any size accepted and automatically compressed to 8-45MB range</p>
        <p>• Large files (&gt;100MB) compressed to 45MB, medium files (50-100MB) to 35MB</p>
        <p>• Thumbnails are generated automatically from the first second</p>
        <p>• Resolution limited to 1280x720 for optimal compression</p>
      </div>
    </div>
  )
}
