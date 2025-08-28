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
  { value: 'Monthly', color: '#f093c3' },
  { value: 'Weekly', color: '#93f0c3' }
]

export default function IncentiveForm({ incentive, onSubmit, onCancel, isLoading = false }: IncentiveFormProps) {
  const [formData, setFormData] = useState({
    title: incentive?.title || '',
    description: incentive?.description || '',
    background_image_url: incentive?.background_image_url || '',
    category: incentive?.category || 'Yearly',
    category_color: incentive?.category_color || '#f2e181',
    start_date: incentive?.start_date ? incentive.start_date.split('T')[0] : '',
    end_date: incentive?.end_date ? incentive.end_date.split('T')[0] : '',
    sort_order: incentive?.sort_order || 0,
    is_published: incentive?.is_published ?? true
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(incentive?.background_image_url || '')
  const [uploadingImage, setUploadingImage] = useState(false)

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
    
    const submitData = {
      ...formData,
      background_image_url: imageUrl,
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

        {/* Background Image Upload */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Background Image *
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
            disabled={isLoading || uploadingImage}
            className="flex-1"
          >
            {uploadingImage ? 'Uploading Image...' : isLoading ? 'Saving...' : (incentive ? 'Update Incentive' : 'Create Incentive')}
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
