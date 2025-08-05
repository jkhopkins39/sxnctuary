import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { DatabaseService } from '../services/database'

interface LatestReleaseImageContextType {
  imageUrl: string
  updateImage: (imageUrl: string) => Promise<void>
  uploadImage: (file: File) => Promise<void>
  isLoading: boolean
}

const LatestReleaseImageContext = createContext<LatestReleaseImageContextType | undefined>(undefined)

export const useLatestReleaseImage = () => {
  const context = useContext(LatestReleaseImageContext)
  if (context === undefined) {
    throw new Error('useLatestReleaseImage must be used within a LatestReleaseImageProvider')
  }
  return context
}

interface LatestReleaseImageProviderProps {
  children: ReactNode
}

const API_BASE_URL = 'http://localhost:3001/api'

export const LatestReleaseImageProvider: React.FC<LatestReleaseImageProviderProps> = ({ children }) => {
  const [imageUrl, setImageUrl] = useState<string>('/IMG_3220.jpg')
  const [isLoading, setIsLoading] = useState(true)

  // Load image URL from backend on component mount
  useEffect(() => {
    const loadImageUrl = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content`)
        if (response.ok) {
          const contentData = await response.json()
          const imageContent = contentData.find((c: any) => c.id === 'latest-release-image')
          if (imageContent) {
            setImageUrl(imageContent.value)
          }
        }
      } catch (error) {
        console.error('Error loading latest release image:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImageUrl()
  }, [])

  const updateImage = async (newImageUrl: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 'latest-release-image', value: newImageUrl })
      })

      if (response.ok) {
        setImageUrl(newImageUrl)
      } else {
        throw new Error('Failed to save image URL')
      }
    } catch (error) {
      console.error('Error updating latest release image:', error)
      throw error
    }
  }

  const uploadImage = async (file: File) => {
    try {
      const imageUrls = await DatabaseService.uploadImages([file])
      if (imageUrls.length > 0) {
        await updateImage(imageUrls[0])
      }
    } catch (error) {
      console.error('Error uploading latest release image:', error)
      throw error
    }
  }

  const value: LatestReleaseImageContextType = {
    imageUrl,
    updateImage,
    uploadImage,
    isLoading
  }

  return (
    <LatestReleaseImageContext.Provider value={value}>
      {children}
    </LatestReleaseImageContext.Provider>
  )
} 