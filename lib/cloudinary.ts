import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Upload image to Cloudinary
export async function uploadImage(
  file: File | Buffer | string,
  folder: string = 'baby-ecommerce',
  options: any = {}
) {
  try {
    const uploadOptions = {
      folder,
      resource_type: 'auto' as const,
      quality: 'auto' as const,
      fetch_format: 'auto' as const,
      ...options,
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions)
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return {
      success: result.result === 'ok',
      data: result,
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string | number
    format?: string
    crop?: string
    gravity?: string
  } = {}
) {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options

  const transformations = []
  
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (quality) transformations.push(`q_${quality}`)
  if (format) transformations.push(`f_${format}`)
  if (crop) transformations.push(`c_${crop}`)
  if (gravity) transformations.push(`g_${gravity}`)

  const transformationString = transformations.join(',')
  
  return cloudinary.url(publicId, {
    transformation: transformationString ? [{ raw_transformation: transformationString }] : undefined,
    secure: true,
  })
}

// Generate responsive image URLs for different screen sizes
export function getResponsiveImageUrls(publicId: string, baseOptions: any = {}) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { ...baseOptions, width: 150, height: 150 }),
    small: getOptimizedImageUrl(publicId, { ...baseOptions, width: 300, height: 300 }),
    medium: getOptimizedImageUrl(publicId, { ...baseOptions, width: 600, height: 600 }),
    large: getOptimizedImageUrl(publicId, { ...baseOptions, width: 1200, height: 1200 }),
    original: getOptimizedImageUrl(publicId, baseOptions),
  }
}

// Extract public ID from Cloudinary URL
export function extractPublicId(url: string): string | null {
  try {
    const regex = /\/v\d+\/(.+)\./
    const match = url.match(regex)
    return match ? match[1] : null
  } catch {
    return null
  }
}
