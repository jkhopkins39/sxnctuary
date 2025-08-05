import React, { useState, useRef } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import { useLatestReleaseImage } from '../contexts/LatestReleaseImageContext'
import './LatestReleaseImageEdit.css'

const LatestReleaseImageEdit: React.FC = () => {
  const { isAuthenticated } = useAdmin()
  const { uploadImage, isLoading } = useLatestReleaseImage()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    try {
      await uploadImage(files[0])
      alert('Image updated successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  if (!isAuthenticated) return null

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        className="edit-image-btn"
        onClick={handleEditClick}
        disabled={isUploading || isLoading}
        title="Edit Latest Release Image"
      >
        {isUploading ? 'Uploading...' : 'Edit Image'}
      </button>
    </>
  )
}

export default LatestReleaseImageEdit 