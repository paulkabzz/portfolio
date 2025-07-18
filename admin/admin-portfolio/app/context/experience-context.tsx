'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { databases, storage, appwriteConfig } from '@/lib/appwrite'
import { Query } from 'appwrite'

export interface Experience {
  id: string
  title: string
  description: string
  company: string
  location: string
  company_url: string
  startDate: string
  endDate: string
  current: boolean
  skills: string[] // Array of skills
  images: string[] // Array of image URLs
  coverImage?: string // First image URL
  createdAt: string
}

interface ExperienceContextType {
  experiences: Experience[]
  loading: boolean
  error: string | null
  createExperience: (experience: Omit<Experience, 'id' | 'createdAt' | 'coverImage'>, coverImage?: File, additionalImages?: File[]) => Promise<Experience>
  updateExperience: (id: string, experience: Partial<Experience>, coverImage?: File, additionalImages?: File[]) => Promise<Experience>
  deleteExperience: (id: string) => Promise<void>
  getExperience: (id: string) => Experience | undefined
  refreshExperiences: () => Promise<void>
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined)

export const useExperience = () => {
  const context = useContext(ExperienceContext)
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider')
  }
  return context
}

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await databases.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.experinceCollectionId!,
        [Query.orderDesc('$createdAt')]
      )

      const formattedExperiences: Experience[] = response.documents.map((doc: any) => ({
        id: doc.$id,
        title: doc.title || '',
        description: doc.description || '',
        company: doc.company || '',
        location: doc.location || '',
        company_url: doc.company_url || '',
        startDate: doc.start_date || '',
        endDate: doc.end_date || '',
        skills: doc.skills || [], // Handle skills from database
        current: doc.current || false,
        images: doc.images || [],
        coverImage: doc.images?.[0] || undefined,
        createdAt: doc.$createdAt,
      }))

      setExperiences(formattedExperiences)
    } catch (err) {
      console.error('Error fetching experiences:', err)
      setError('Failed to fetch experiences')
    } finally {
      setLoading(false)
    }
  }

  const uploadImageAndGetUrl = async (image: File): Promise<string> => {
    const response = await storage.createFile(
      appwriteConfig.experienceStorageId!,
      'unique()',
      image
    )
    
    // Get the file URL
    const fileUrl = storage.getFileView(appwriteConfig.experienceStorageId!, response.$id)
    return fileUrl
  }

  const uploadImages = async (images: File[]): Promise<string[]> => {
    const uploadPromises = images.map(uploadImageAndGetUrl)
    return Promise.all(uploadPromises)
  }

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      // Extract file ID from URL
      const urlParts = imageUrl.split('/')
      const fileId = urlParts[urlParts.length - 1].split('?')[0]
      
      await storage.deleteFile(appwriteConfig.experienceStorageId!, fileId)
    } catch (err) {
      console.error('Error deleting image:', err)
    }
  }

  const deleteImages = async (imageUrls: string[]) => {
    const deletePromises = imageUrls.map(deleteImageFromStorage)
    await Promise.all(deletePromises)
  }

  const createExperience = async (
    experienceData: Omit<Experience, 'id' | 'createdAt' | 'coverImage'>,
    coverImage?: File,
    additionalImages?: File[]
  ): Promise<Experience> => {
    try {
      setError(null)
      
      let imageUrls: string[] = []
      
      // Upload cover image first (if provided)
      if (coverImage) {
        const coverImageUrl = await uploadImageAndGetUrl(coverImage)
        imageUrls.push(coverImageUrl)
      }
      
      // Upload additional images
      if (additionalImages && additionalImages.length > 0) {
        const additionalImageUrls = await uploadImages(additionalImages)
        imageUrls.push(...additionalImageUrls)
      }

      const response = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.experinceCollectionId!,
        'unique()',
        {
          title: experienceData.title,
          description: experienceData.description,
          company: experienceData.company,
          location: experienceData.location,
          company_url: experienceData.company_url,
          start_date: experienceData.startDate,
          end_date: experienceData.endDate,
          current: experienceData.current,
          skills: experienceData.skills, // Include skills in database creation
          images: imageUrls,
        }
      )

      const newExperience: Experience = {
        id: response.$id,
        title: response.title,
        description: response.description,
        company: response.company,
        location: response.location,
        company_url: response.company_url,
        startDate: response.start_date,
        endDate: response.end_date,
        skills: response.skills || [], // Handle skills from response
        current: response.current,
        images: response.images,
        coverImage: response.images?.[0],
        createdAt: response.$createdAt,
      }

      setExperiences(prev => [newExperience, ...prev])
      return newExperience
    } catch (err) {
      console.error('Error creating experience:', err)
      setError('Failed to create experience')
      throw err
    }
  }

  const updateExperience = async (
    id: string,
    experienceData: Partial<Experience>,
    coverImage?: File,
    additionalImages?: File[]
  ): Promise<Experience> => {
    try {
      setError(null)
      
      const existingExperience = experiences.find(exp => exp.id === id)
      if (!existingExperience) {
        throw new Error('Experience not found')
      }

      let imageUrls = [...existingExperience.images] // Copy existing images
      let imagesToDelete: string[] = []

      // Handle cover image update
      if (coverImage) {
        // If there's an existing cover image, mark it for deletion
        if (existingExperience.images.length > 0) {
          imagesToDelete.push(existingExperience.images[0])
          imageUrls = imageUrls.slice(1) // Remove the old cover image
        }
        
        // Upload new cover image
        const coverImageUrl = await uploadImageAndGetUrl(coverImage)
        imageUrls.unshift(coverImageUrl) // Add as first image (cover)
      }
      
      // Handle additional images update
      if (additionalImages && additionalImages.length > 0) {
        // Delete existing additional images (keep cover image)
        if (existingExperience.images.length > 1) {
          imagesToDelete.push(...existingExperience.images.slice(1))
          imageUrls = imageUrls.slice(0, 1) // Keep only cover image
        }
        
        // Upload new additional images
        const additionalImageUrls = await uploadImages(additionalImages)
        imageUrls.push(...additionalImageUrls)
      }

      // Delete old images that are being replaced
      if (imagesToDelete.length > 0) {
        await deleteImages(imagesToDelete)
      }

      const updateData: any = {
        images: imageUrls
      }
      
      if (experienceData.title !== undefined) updateData.title = experienceData.title
      if (experienceData.description !== undefined) updateData.description = experienceData.description
      if (experienceData.company !== undefined) updateData.company = experienceData.company
      if (experienceData.location !== undefined) updateData.location = experienceData.location
      if (experienceData.company_url !== undefined) updateData.company_url = experienceData.company_url
      if (experienceData.startDate !== undefined) updateData.start_date = experienceData.startDate
      if (experienceData.endDate !== undefined) updateData.end_date = experienceData.endDate
      if (experienceData.current !== undefined) updateData.current = experienceData.current
      if (experienceData.skills !== undefined) updateData.skills = experienceData.skills // Include skills in update

      const response = await databases.updateDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.experinceCollectionId!,
        id,
        updateData
      )

      const updatedExperience: Experience = {
        id: response.$id,
        title: response.title,
        description: response.description,
        company: response.company,
        location: response.location,
        company_url: response.company_url,
        startDate: response.start_date,
        endDate: response.end_date,
        current: response.current,
        skills: response.skills || [], // Handle skills from response
        images: response.images,
        coverImage: response.images?.[0],
        createdAt: response.$createdAt,
      }

      setExperiences(prev => prev.map(exp => exp.id === id ? updatedExperience : exp))
      return updatedExperience
    } catch (err) {
      console.error('Error updating experience:', err)
      setError('Failed to update experience')
      throw err
    }
  }

  const deleteExperience = async (id: string): Promise<void> => {
    try {
      setError(null)
      
      const experienceToDelete = experiences.find(exp => exp.id === id)
      if (experienceToDelete && experienceToDelete.images.length > 0) {
        await deleteImages(experienceToDelete.images)
      }

      await databases.deleteDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.experinceCollectionId!,
        id
      )

      setExperiences(prev => prev.filter(exp => exp.id !== id))
    } catch (err) {
      console.error('Error deleting experience:', err)
      setError('Failed to delete experience')
      throw err
    }
  }

  const getExperience = (id: string): Experience | undefined => {
    return experiences.find(exp => exp.id === id)
  }

  const refreshExperiences = async (): Promise<void> => {
    await fetchExperiences()
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  const value: ExperienceContextType = {
    experiences,
    loading,
    error,
    createExperience,
    updateExperience,
    deleteExperience,
    getExperience,
    refreshExperiences
  }

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  )
}