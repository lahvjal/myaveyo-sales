'use client'

import React, { useState } from 'react'
import { Incentive, CreateIncentiveData, UpdateIncentiveData } from '@/lib/types/incentive'
import Button from '../Button'

interface IncentiveFormProps {
  incentive?: Incentive
  onSubmit: (data: CreateIncentiveData | UpdateIncentiveData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const CATEGORY_OPTIONS = [
  { value: 'Yearly', color: '#f2e181' },
  { value: 'Summer', color: '#93c3f6' },
  { value: 'Monthly', color: '#f093c3' }
]

export default function IncentiveForm({ incentive, onSubmit, onCancel, isLoading = false }: IncentiveFormProps) {
  const [formData, setFormData] = useState({
    title: incentive?.title || '',
    description: incentive?.description || '',
    background_image_url: incentive?.background_image_url || '',
    background_video_url: incentive?.background_video_url || '',
    category: incentive?.category || 'Yearly',
    category_color: incentive?.category_color || '#f2e181',
    start_date: incentive?.start_date ? incentive.start_date.split('T')[0] : '',
    end_date: incentive?.end_date ? incentive.end_date.split('T')[0] : '',
    sort_order: incentive?.sort_order || 0,
    is_published: incentive?.is_published ?? true
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(incentive?.background_image_url || '')
  const [videoPreview, setVideoPreview] = useState<string>(incentive?.background_video_url || '')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)

  // Video compression function
  const compressVideo = (file: File, targetSizeMB: number = 15): Promise<File> => {
    return new Promise((resolve, reject) => {
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
            resolve(compressedFile)
          } else {
            // If still too large, try with lower bitrate
            reject(new Error('Video compression failed - file still too large'))
          }
        }
        
        mediaRecorder.onerror = (event) => {
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
              setCompressionProgress(Math.round((currentTime / duration) * 100))
              requestAnimationFrame(drawFrame)
            }
          } else {
            mediaRecorder.stop()
          }
        }
        
        drawFrame()
      }
      
      video.onerror = () => {
        reject(new Error('Failed to load video for compression'))
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  // Image compression function
  const compressImage = (file: File, targetSizeMB: number = 5): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio
        const MAX_WIDTH = 1920
        const MAX_HEIGHT = 1080
        let { width, height } = img
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        // Start with high quality and reduce until target size is reached
        let quality = 0.9
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (blob) {
              const sizeMB = blob.size / (1024 * 1024)
              
              // If size is good or quality is too low, use current result
              if (sizeMB <= targetSizeMB || quality <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              } else {
                // Reduce quality and try again
                quality -= 0.1
                tryCompress()
              }
            }
          }, 'image/jpeg', quality)
        }
        
        tryCompress()
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let imageUrl = formData.background_image_url
    let videoUrl = formData.background_video_url
    
    // Upload image if a new file was selected
    if (imageFile) {
      setUploadingImage(true)
      try {
        // Compress image before upload
        const originalSizeMB = imageFile.size / (1024 * 1024)
        console.log(`Original image size: ${originalSizeMB.toFixed(2)}MB`)
        
        let fileToUpload = imageFile
        if (originalSizeMB > 3) {
          console.log('Compressing image...')
          fileToUpload = await compressImage(imageFile, 8) // Target max 8MB
          const compressedSizeMB = fileToUpload.size / (1024 * 1024)
          console.log(`Compressed image size: ${compressedSizeMB.toFixed(2)}MB`)
        }
        
        const uploadFormData = new FormData()
        uploadFormData.append('file', fileToUpload)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })
        
        if (response.ok) {
          const { url } = await response.json()
          imageUrl = url
        } else {
          throw new Error('Failed to upload image')
        }
      } catch (error) {
        console.error('Image upload error:', error)
        alert('Failed to upload image. Please try again.')
        return
      } finally {
        setUploadingImage(false)
      }
    }
    
    // Upload video if a new file was selected
    if (videoFile) {
      setUploadingVideo(true)
      setCompressionProgress(0)
      try {
        // Compress video before upload if >= 15MB
        const originalSizeMB = videoFile.size / (1024 * 1024)
        console.log(`Original video size: ${originalSizeMB.toFixed(2)}MB`)
        
        let fileToUpload = videoFile
        if (originalSizeMB >= 15) {
          console.log('Compressing video...')
          fileToUpload = await compressVideo(videoFile, 15) // Target max 15MB
          const compressedSizeMB = fileToUpload.size / (1024 * 1024)
          console.log(`Compressed video size: ${compressedSizeMB.toFixed(2)}MB`)
        }
        
        const uploadFormData = new FormData()
        uploadFormData.append('file', fileToUpload)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })
        
        if (response.ok) {
          const { url } = await response.json()
          videoUrl = url
        } else {
          throw new Error('Failed to upload video')
        }
      } catch (error) {
        console.error('Video upload error:', error)
        alert('Failed to upload video. Please try again.')
        return
      } finally {
        setUploadingVideo(false)
        setCompressionProgress(0)
      }
    }
    
    const submitData = {
      ...formData,
      background_image_url: imageUrl,
      background_video_url: videoUrl,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString()
    }
    
    const finalData = incentive 
      ? { ...submitData, id: incentive.id } as UpdateIncentiveData
      : submitData as CreateIncentiveData

    await onSubmit(finalData)
  }

  const handleCategoryChange = (category: string) => {
    const categoryOption = CATEGORY_OPTIONS.find(opt => opt.value === category)
    setFormData(prev => ({
      ...prev,
      category,
      category_color: categoryOption?.color || prev.category_color
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file')
        return
      }
      
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
      // Clear URL input when file is selected
      setFormData(prev => ({ ...prev, background_video_url: '' }))
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-white text-2xl font-telegraf font-bold mb-6">
        {incentive ? 'Edit Incentive' : 'Create New Incentive'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white resize-none"
          />
        </div>

        {/* Background Media */}
        <div className="space-y-6">
          {/* Background Image Upload */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Background Image
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:cursor-pointer"
              />
              <div className="text-sm text-gray-400">
                Or use URL:
              </div>
              <input
                type="url"
                value={formData.background_image_url}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, background_image_url: e.target.value }))
                  setImagePreview(e.target.value)
                  setImageFile(null)
                }}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Background Video Upload */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Background Video
              <span className="text-gray-400 text-xs ml-2">(Optional - takes priority over image)</span>
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:cursor-pointer"
              />
              <div className="text-sm text-gray-400">
                Or use URL:
              </div>
              <input
                type="url"
                value={formData.background_video_url}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, background_video_url: e.target.value }))
                  setVideoPreview(e.target.value)
                  setVideoFile(null)
                }}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
              />
              
              {/* Compression Progress */}
              {uploadingVideo && compressionProgress > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Compressing video...</span>
                    <span>{compressionProgress}%</span>
                  </div>
                  <div className="w-full bg-[#333] rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${compressionProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {videoPreview && (
                <div className="mt-2">
                  <video 
                    src={videoPreview}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                    muted
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Supported formats: MP4, WebM, MOV. Files ≥15MB will be automatically compressed. Video will auto-loop when displayed.
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400 bg-[#2a2a2a] p-3 rounded-lg">
            <strong>Media Priority:</strong> If both image and video are provided, the video will be displayed. 
            Use image as a fallback for when video fails to load.
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
          >
            {CATEGORY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>

        {/* Category Color Preview */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Category Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={formData.category_color}
              onChange={(e) => setFormData(prev => ({ ...prev, category_color: e.target.value }))}
              className="w-16 h-10 bg-transparent border border-[#333] rounded cursor-pointer"
            />
            <div 
              className="px-4 py-2 rounded-full text-black font-semibold text-sm"
              style={{ backgroundColor: formData.category_color }}
            >
              {formData.category}
            </div>
          </div>
        </div>

        {/* Sort Order and Published Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-5 h-5 text-white bg-[#2a2a2a] border-[#333] rounded focus:ring-white focus:ring-2"
              />
              <span className="text-sm font-medium">Published</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || uploadingImage || uploadingVideo}
            className="flex-1"
          >
            {uploadingVideo ? 'Uploading Video...' : uploadingImage ? 'Uploading Image...' : isLoading ? 'Saving...' : (incentive ? 'Update Incentive' : 'Create Incentive')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
