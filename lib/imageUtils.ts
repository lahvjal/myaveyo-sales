/**
 * Image compression and upload utilities for CMS
 */

export interface CompressedImage {
  file: File
  dataUrl: string
  originalSize: number
  compressedSize: number
}

/**
 * Compress an image file before upload
 */
export async function compressImage(
  file: File, 
  maxWidth: number = 1920, 
  maxHeight: number = 1080, 
  quality: number = 0.8
): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
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

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })

          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              file: compressedFile,
              dataUrl: reader.result as string,
              originalSize: file.size,
              compressedSize: compressedFile.size
            })
          }
          reader.readAsDataURL(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Upload compressed image to Supabase storage
 */
export async function uploadImageToSupabase(
  compressedImage: CompressedImage,
  bucket: string = 'cms-images',
  folder: string = 'sales'
): Promise<string> {
  const { supabase } = await import('./supabase')
  
  // Generate unique filename
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  const extension = 'jpg'
  const fileName = `${folder}/${timestamp}-${randomId}.${extension}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, compressedImage.file, {
      contentType: 'image/jpeg',
      upsert: false
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, or WebP)'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file must be less than 10MB'
    }
  }

  return { valid: true }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
