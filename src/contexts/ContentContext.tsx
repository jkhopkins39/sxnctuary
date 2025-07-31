import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ContentField {
  id: string
  label: string
  value: string
  type: 'text' | 'textarea'
  location: string
}

interface ContentContextType {
  contentFields: ContentField[]
  updateContent: (id: string, value: string) => void
  getContent: (id: string) => string
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

  const updateContent = (id: string, value: string) => {
    setContentFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, value } : field
      )
    )
  }

  const getContent = (id: string): string => {
    const field = contentFields.find(f => f.id === id)
    return field?.value || ''
  }

  const value: ContentContextType = {
    contentFields,
    updateContent,
    getContent
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
} 