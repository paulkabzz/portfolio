"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { databases, storage, appwriteConfig } from "@/lib/appwrite";
import { ID, Query } from 'appwrite'

interface CV {
  cv_id: string
  cv_name: string
  $id: string
  $createdAt: string
  $updatedAt: string
}

interface JobApplication {
  $id: string
  job_title: string
  company_name: string
  job_url?: string
  application_date: string
  status: 'APPLIED' | 'INTERVIEWING' | 'OFFER_RECEIVED' | 'OFFER_REJECTED' | 'ARCHIVED'
  location: string
  contact_person?: string
  contact_email?: string
  notes?: string
  cv_url?: string
  source?: string
  feedback?: string
  min_salary: number
  max_salary: number
  cv_id?: string
  fk_cv_id?: string
  interview_dates: string[]
  featured_application: boolean
  urgent_application: boolean
  next_steps?: string
  response_deadline?: string
  $createdAt: string
  $updatedAt: string
}

interface CreateJobApplicationData {
  job_title: string
  company_name: string
  job_url?: string
  application_date: string
  status: 'APPLIED' | 'INTERVIEWING' | 'OFFER_RECEIVED' | 'OFFER_REJECTED' | 'ARCHIVED'
  location: string
  contact_person?: string
  contact_email?: string | null
  notes?: string
  cv_url?: string
  source?: string
  feedback?: string
  min_salary: number
  max_salary: number
  cv_id?: string
  fk_cv_id?: string
  interview_dates: string[]
  featured_application: boolean
  urgent_application: boolean
  next_steps?: string
  response_deadline?: string
}

interface JobContextType {
  jobApplications: JobApplication[]
  cvs: CV[]
  isLoading: boolean
  error: string | null
  createJobApplication: (data: CreateJobApplicationData) => Promise<JobApplication>
  updateJobApplication: (id: string, data: Partial<CreateJobApplicationData>) => Promise<JobApplication>
  deleteJobApplication: (id: string) => Promise<void>
  fetchJobApplications: () => Promise<void>
  fetchCVs: () => Promise<void>
  uploadCV: (file: File, name: string) => Promise<CV>

  // methods to speed things uo
  updateApplicationStatus: (id: string, status: JobApplication['status']) => Promise<JobApplication>
  addNotes: (id: string, notes: string) => Promise<JobApplication>
  addFeedback: (id: string, feedback: string) => Promise<JobApplication>
  editApplication: (id: string, updates: Partial<CreateJobApplicationData>) => Promise<JobApplication>
  archiveApplication: (id: string) => Promise<JobApplication>
  markAsUrgent: (id: string, urgent?: boolean) => Promise<JobApplication>
  markAsFeatured: (id: string, featured?: boolean) => Promise<JobApplication>
  addInterviewDate: (id: string, interviewDate: string) => Promise<JobApplication>
  removeInterviewDate: (id: string, interviewDate: string) => Promise<JobApplication>
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [cvs, setCvs] = useState<CV[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobApplications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await databases.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.jobApplicationsCollecionId!,
        [Query.orderDesc('$createdAt')]
      )
      
      setJobApplications(response.documents as unknown as JobApplication[])
    } catch (err) {
      console.error('Error fetching job applications:', err)
      setError('Failed to fetch job applications')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCVs = async () => {
    try {
      setError(null)
      
      const response = await databases.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.cvCollectionId!,
        [Query.orderDesc('$createdAt')]
      )
      
      setCvs(response.documents as unknown as CV[])
    } catch (err) {
      console.error('Error fetching CVs:', err)
      setError('Failed to fetch CVs')
    }
  }

  const createJobApplication = async (data: CreateJobApplicationData): Promise<JobApplication> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.jobApplicationsCollecionId!,
        ID.unique(),
        data
      )
      
      const newJobApplication = response as unknown as JobApplication
      setJobApplications(prev => [newJobApplication, ...prev])
      
      return newJobApplication
    } catch (err) {
      console.error('Error creating job application:', err)
      setError('Failed to create job application')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateJobApplication = async (id: string, data: Partial<CreateJobApplicationData>): Promise<JobApplication> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await databases.updateDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.jobApplicationsCollecionId!,
        id,
        data
      )
      
      const updatedJobApplication = response as unknown as JobApplication
      setJobApplications(prev => 
        prev.map(job => job.$id === id ? updatedJobApplication : job)
      )
      
      return updatedJobApplication
    } catch (err) {
      console.error('Error updating job application:', err)
      setError('Failed to update job application')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteJobApplication = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      await databases.deleteDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.jobApplicationsCollecionId!,
        id
      )
      
      setJobApplications(prev => prev.filter(job => job.$id !== id))
    } catch (err) {
      console.error('Error deleting job application:', err)
      setError('Failed to delete job application')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const uploadCV = async (file: File, name: string): Promise<CV> => {
    try {
      setError(null)
      
      // Upload file to storage
      const fileResponse = await storage.createFile(
        appwriteConfig.cvStorageId!,
        ID.unique(),
        file
      )
      
      // Create CV document
      const cvData = {
        cv_id: fileResponse.$id,
        cv_name: name
      }
      
      const response = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.cvCollectionId!,
        ID.unique(),
        cvData
      )
      
      const newCV = response as unknown as CV
      setCvs(prev => [newCV, ...prev])
      
      return newCV
    } catch (err) {
      console.error('Error uploading CV:', err)
      setError('Failed to upload CV')
      throw err
    }
  }

  // New convenience methods
  const updateApplicationStatus = async (id: string, status: JobApplication['status']): Promise<JobApplication> => {
    return updateJobApplication(id, { status })
  }

  const addNotes = async (id: string, notes: string): Promise<JobApplication> => {
    const currentApplication = jobApplications.find(app => app.$id === id)
    const existingNotes = currentApplication?.notes || ''
    const updatedNotes = existingNotes 
      ? `${existingNotes}\n\n[${new Date().toLocaleDateString()}] ${notes}` 
      : `[${new Date().toLocaleDateString()}] ${notes}`
    
    return updateJobApplication(id, { notes: updatedNotes })
  }

  const addFeedback = async (id: string, feedback: string): Promise<JobApplication> => {
    const currentApplication = jobApplications.find(app => app.$id === id)
    const existingFeedback = currentApplication?.feedback || ''
    const updatedFeedback = existingFeedback 
      ? `${existingFeedback}\n\n[${new Date().toLocaleDateString()}] ${feedback}` 
      : `[${new Date().toLocaleDateString()}] ${feedback}`
    
    return updateJobApplication(id, { feedback: updatedFeedback })
  }

  const editApplication = async (id: string, updates: Partial<CreateJobApplicationData>): Promise<JobApplication> => {
    return updateJobApplication(id, updates)
  }

  const archiveApplication = async (id: string): Promise<JobApplication> => {
    return updateJobApplication(id, { status: 'ARCHIVED' })
  }

  const markAsUrgent = async (id: string, urgent: boolean = true): Promise<JobApplication> => {
    return updateJobApplication(id, { urgent_application: urgent })
  }

  const markAsFeatured = async (id: string, featured: boolean = true): Promise<JobApplication> => {
    return updateJobApplication(id, { featured_application: featured })
  }

  const addInterviewDate = async (id: string, interviewDate: string): Promise<JobApplication> => {
    const currentApplication = jobApplications.find(app => app.$id === id)
    const existingDates = currentApplication?.interview_dates || []
    const updatedDates = [...existingDates, interviewDate]
    
    return updateJobApplication(id, { interview_dates: updatedDates })
  }

  const removeInterviewDate = async (id: string, interviewDate: string): Promise<JobApplication> => {
    const currentApplication = jobApplications.find(app => app.$id === id)
    const existingDates = currentApplication?.interview_dates || []
    const updatedDates = existingDates.filter(date => date !== interviewDate)
    
    return updateJobApplication(id, { interview_dates: updatedDates })
  }

  useEffect(() => {
    fetchJobApplications()
    fetchCVs()
  }, [])

  const value: JobContextType = {
    jobApplications,
    cvs,
    isLoading,
    error,
    createJobApplication,
    updateJobApplication,
    deleteJobApplication,
    fetchJobApplications,
    fetchCVs,
    uploadCV,

// methds to for convenience
    updateApplicationStatus,
    addNotes,
    addFeedback,
    editApplication,
    archiveApplication,
    markAsUrgent,
    markAsFeatured,
    addInterviewDate,
    removeInterviewDate
  }

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}

export function useJob() {
  const context = useContext(JobContext)
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider')
  }
  return context
}