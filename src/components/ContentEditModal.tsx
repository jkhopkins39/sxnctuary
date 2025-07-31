import React, { useState } from 'react'
import './ContentEditModal.css'

interface ContentField {
  id: string
  label: string
  value: string
  type: 'text' | 'textarea'
  location: string
}

interface ContentEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: ContentField) => void
  content: ContentField
}

const ContentEditModal: React.FC<ContentEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  content 
}) => {
  const [formData, setFormData] = useState<ContentField>(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleClose = () => {
    setFormData(content) // Reset to original values
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="content-modal-overlay" onClick={handleClose}>
      <div className="content-modal" onClick={(e) => e.stopPropagation()}>
        <div className="content-modal-header">
          <h3>Edit Content</h3>
          <button onClick={handleClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="content-modal-form">
          <div className="content-info">
            <p className="content-location">Location: {content.location}</p>
            <p className="content-field">Field: {content.label}</p>
          </div>
          
          <div className="form-group">
            <label>{content.label}</label>
            {content.type === 'textarea' ? (
              <textarea
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                rows={6}
                required
                placeholder={`Enter ${content.label.toLowerCase()}...`}
              />
            ) : (
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                required
                placeholder={`Enter ${content.label.toLowerCase()}...`}
              />
            )}
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContentEditModal 