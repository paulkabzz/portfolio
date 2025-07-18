// lib/utils/image-utils.ts
import { appwriteConfig } from './appwrite'

export const getImageUrl = (imageId: string, storageId: string = appwriteConfig.experienceStorageId!) => {
  return `${appwriteConfig.url}/storage/buckets/${storageId}/files/${imageId}/view?project=${appwriteConfig.projectId}`
}

export const getImagePreview = (imageId: string, storageId: string = appwriteConfig.experienceStorageId!, width: number = 400, height: number = 300) => {
  return `${appwriteConfig.url}/storage/buckets/${storageId}/files/${imageId}/preview?project=${appwriteConfig.projectId}&width=${width}&height=${height}`
}

export const validateImageFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.'
  }
  
  if (file.size > maxSize) {
    return 'File size too large. Please upload images smaller than 10MB.'
  }
  
  return null
}

export const compressImage = async (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        } else {
          resolve(file)
        }
      }, file.type, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}