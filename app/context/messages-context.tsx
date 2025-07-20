"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { databases, appwriteConfig } from '@/lib/appwrite'
import { AppwriteException, ID, Query } from 'appwrite'

export interface Message {
  $id: string
  message: string
  full_name: string
  email: string
  subject: string
  urgent: boolean
  phone: string
  read: boolean
  archived: boolean
  $createdAt: string
}

export interface CreateMessageData {
  message: string
  full_name: string
  email: string
  subject: string
  urgent: boolean
  phone: string
}

interface MessagesContextType {
  // State
  messages: Message[]
  archivedMessages: Message[]
  loading: boolean
  error: string | null

  // Actions
  submitMessage: (data: CreateMessageData) => Promise<Message>
  fetchMessageById: (id: string) => Promise<Message | null>
  fetchAllMessages: () => Promise<Message[]>
  fetchArchivedMessages: () => Promise<Message[]>
  deleteMessage: (id: string) => Promise<void>
  archiveMessage: (id: string) => Promise<void>
  unarchiveMessage: (id: string) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAsUnread: (id: string) => Promise<void>
  openMessage: (id: string) => Promise<Message | null> // Automatically marks as read
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export const useMessages = () => {
  const context = useContext(MessagesContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
}

interface MessagesProviderProps {
  children: ReactNode
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [archivedMessages, setArchivedMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (error: any) => {
    console.error('Messages Context Error:', error)
    setError(error?.message || 'An unexpected error occurred')
    throw error
  }

  const submitMessage = async (data: CreateMessageData): Promise<Message> => {
    setLoading(true)
    setError(null)
    
    try {
      const messageData = {
        ...data,
        read: false,
        archived: false,
        created_at: new Date().toISOString()
      }

      const response = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        ID.unique(),
        messageData
      )

      const newMessage = response as unknown as Message
      
      // Update local state
      setMessages(prev => [newMessage, ...prev])
      
      return newMessage
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchMessageById = async (id: string): Promise<Message | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        id
      )

      return response as unknown as Message
    } catch (error) {
      if ((error as AppwriteException)?.code === 404) {
        return null
      }
      handleError(error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchAllMessages = async (): Promise<Message[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        [
          Query.equal('archived', false),
          Query.orderDesc('$createdAt'),
          Query.limit(100) // Adjust as needed
        ]
      )

      const fetchedMessages = response.documents as unknown as Message[]
      setMessages(fetchedMessages)
      
      return fetchedMessages
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchArchivedMessages = async (): Promise<Message[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        [
          Query.equal('archived', true),
          Query.orderDesc('$createdAt'),
          Query.limit(100) // Adjust as needed
        ]
      )

      const fetchedArchivedMessages = response.documents as unknown as Message[]
      setArchivedMessages(fetchedArchivedMessages)
      
      return fetchedArchivedMessages
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        id
      )

      // Update local state
      setMessages(prev => prev.filter(msg => msg.$id !== id))
      setArchivedMessages(prev => prev.filter(msg => msg.$id !== id))
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const archiveMessage = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedMessage = await databases.updateDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        id,
        { archived: true }
      )

      const message = updatedMessage as unknown as Message

      // Update local state - move from messages to archived
      setMessages(prev => prev.filter(msg => msg.$id !== id))
      setArchivedMessages(prev => [message, ...prev])
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const unarchiveMessage = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedMessage = await databases.updateDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        id,
        { archived: false }
      )

      const message = updatedMessage as unknown as Message

      // Update local state - move from archived to messages
      setArchivedMessages(prev => prev.filter(msg => msg.$id !== id))
      setMessages(prev => [message, ...prev])
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedMessage = await databases.updateDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        id,
        { read: true }
      )

      const message = updatedMessage as unknown as Message

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.$id === id ? message : msg
      ))
      setArchivedMessages(prev => prev.map(msg => 
        msg.$id === id ? message : msg
      ))
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const markAsUnread = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedMessage = await databases.updateDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.messagesCollectionId!,
        id,
        { read: false }
      )

      const message = updatedMessage as unknown as Message

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.$id === id ? message : msg
      ))
      setArchivedMessages(prev => prev.map(msg => 
        msg.$id === id ? message : msg
      ))
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const openMessage = async (id: string): Promise<Message | null> => {
    setLoading(true)
    setError(null)
    
    try {
      // First get the message
      const message = await fetchMessageById(id)
      
      if (message && !message.read) {
        // Mark as read if not already read
        await markAsRead(id)
        
        // Return the updated message
        return { ...message, read: true }
      }
      
      return message
    } catch (error) {
      handleError(error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const contextValue: MessagesContextType = {
    // State
    messages,
    archivedMessages,
    loading,
    error,

    // Actions
    submitMessage,
    fetchMessageById,
    fetchAllMessages,
    fetchArchivedMessages,
    deleteMessage,
    archiveMessage,
    unarchiveMessage,
    markAsRead,
    markAsUnread,
    openMessage,
  }

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  )
}