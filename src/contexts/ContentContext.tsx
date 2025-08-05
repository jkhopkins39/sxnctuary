import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface ContentField {
  id: string
  label: string
  value: string
  type: 'text' | 'textarea'
  location: string
}

interface ContentContextType {
  contentFields: ContentField[]
  updateContent: (id: string, value: string) => Promise<void>
  getContent: (id: string) => string
  isLoading: boolean
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export const useContent = () => {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

interface ContentProviderProps {
  children: ReactNode
}

const API_BASE_URL = 'http://localhost:3001/api'

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [contentFields, setContentFields] = useState<ContentField[]>([
    {
      id: 'hero-title',
      label: 'Hero Title',
      value: 'SXNCTUARY',
      type: 'text',
      location: 'Home Page'
    },
    {
      id: 'hero-subtitle',
      label: 'Hero Subtitle',
      value: 'Drum\'n\'Bass Producer',
      type: 'text',
      location: 'Home Page'
    },
    {
      id: 'hero-description',
      label: 'Hero Description',
      value: 'Pushing the boundaries of drum\'n\'bass with futuristic soundscapes, innovative production techniques, and cutting-edge technology.',
      type: 'textarea',
      location: 'Home Page'
    },
    {
      id: 'latest-release-name',
      label: 'Latest Release Name',
      value: 'RUNNERS',
      type: 'text',
      location: 'Home Page'
    },
    {
      id: 'latest-release-description',
      label: 'Latest Release Description',
      value: 'My latest drum\'n\'bass track',
      type: 'textarea',
      location: 'Home Page'
    },
    {
      id: 'merch-title',
      label: 'Merch Title',
      value: 'SXNCTUARY Merch',
      type: 'text',
      location: 'Merch Page'
    },
    {
      id: 'merch-subtitle',
      label: 'Merch Subtitle',
      value: 'Official merchandise featuring futuristic designs and premium quality',
      type: 'textarea',
      location: 'Merch Page'
    },
    {
      id: 'footer-description',
      label: 'Footer Description',
      value: 'Pushing the boundaries of electronic music with futuristic soundscapes and innovative production.',
      type: 'textarea',
      location: 'Footer'
    }
  ])
  const [isLoading, setIsLoading] = useState(true)

  // Load content from backend on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content`)
        if (response.ok) {
          const contentData = await response.json()
          
          // Update content fields with data from backend
          setContentFields(prev => 
            prev.map(field => {
              const savedContent = contentData.find((c: any) => c.id === field.id)
              return savedContent ? { ...field, value: savedContent.value } : field
            })
          )
        }
      } catch (error) {
        console.error('Error loading content:', error)
        // If there's an error loading content, try to seed it
        try {
          await fetch(`${API_BASE_URL}/seed-content`, { method: 'POST' })
          // Reload content after seeding
          const response = await fetch(`${API_BASE_URL}/content`)
          if (response.ok) {
            const contentData = await response.json()
            setContentFields(prev => 
              prev.map(field => {
                const savedContent = contentData.find((c: any) => c.id === field.id)
                return savedContent ? { ...field, value: savedContent.value } : field
              })
            )
          }
        } catch (seedError) {
          console.error('Error seeding content:', seedError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  const updateContent = async (id: string, value: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, value })
      })

      if (response.ok) {
        setContentFields(prev => 
          prev.map(field => 
            field.id === id ? { ...field, value } : field
          )
        )
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Error updating content:', error)
      throw error
    }
  }

  const getContent = (id: string): string => {
    const field = contentFields.find(f => f.id === id)
    return field?.value || ''
  }

  const value: ContentContextType = {
    contentFields,
    updateContent,
    getContent,
    isLoading
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
} 