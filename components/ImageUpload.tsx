'use client'

import { useState, useRef } from 'react'
import { compressImage, uploadImageToSupabase, validateImageFile, formatFileSize, type CompressedImage } from '@/lib/imageUtils'

interface ImageUploadProps {
  currentUrl?: string
  currentAlt?: string
  onImageChange: (url: string, alt: string) => void
  label: string
  className?: string
}

export default function ImageUpload({ 
  currentUrl = '', 
  currentAlt = '', 
  onImageChange, 
  label,
  className = '' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [preview, setPreview] = useState<string>(currentUrl)
  const [altText, setAltText] = useState<string>(currentAlt)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsUploading(true)
    setUploadProgress('Compressing image...')

    try {
      // Compress image
      const compressedImage: CompressedImage = await compressImage(file, 1920, 1080, 0.8)
      
      const compressionRatio = ((compressedImage.originalSize - compressedImage.compressedSize) / compressedImage.originalSize * 100).toFixed(1)
      setUploadProgress(`Compressed by ${compressionRatio}% (${formatFileSize(compressedImage.originalSize)} → ${formatFileSize(compressedImage.compressedSize)})`)

      // Set preview immediately
      setPreview(compressedImage.dataUrl)

      // Upload to Supabase
      setUploadProgress('Uploading to storage...')
      const publicUrl = await uploadImageToSupabase(compressedImage)
      
      // Update parent component
      onImageChange(publicUrl, altText)
      setPreview(publicUrl)
      setUploadProgress('Upload complete!')

      // Clear progress after 2 seconds
      setTimeout(() => setUploadProgress(''), 2000)

    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setUploadProgress('')
    } finally {
      setIsUploading(false)
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAltTextChange = (newAlt: string) => {
    setAltText(newAlt)
    onImageChange(currentUrl || preview, newAlt)
  }

  const handleUrlChange = (newUrl: string) => {
    setPreview(newUrl)
    onImageChange(newUrl, altText)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-[#888d95] text-sm mb-2">{label}</label>
        
        {/* Current Image Preview */}
        {(preview || currentUrl) && (
          <div className="mb-4 p-4 bg-[#0d0d0d] border border-[#333] rounded-lg">
            <img 
              src={preview || currentUrl} 
              alt={altText || currentAlt}
              className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            <p className="text-xs text-[#888d95]">Current image</p>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload New Image'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="mb-3 p-2 bg-[#0d0d0d] border border-[#333] rounded text-sm text-[#888d95]">
            {uploadProgress}
          </div>
        )}

        {/* Manual URL Input (fallback) */}
        <div className="mb-3">
          <label className="block text-[#888d95] text-xs mb-1">Or enter image URL manually:</label>
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Alt Text Input */}
        <div>
          <label className="block text-[#888d95] text-xs mb-1">Alt text (for accessibility):</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => handleAltTextChange(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            placeholder="Describe the image..."
          />
        </div>
      </div>
    </div>
  )
}
