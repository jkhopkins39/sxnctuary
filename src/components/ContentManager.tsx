import React, { useState } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import { useContent } from '../contexts/ContentContext'
import ContentEditModal from './ContentEditModal'
import './ContentManager.css'

interface ContentField {
  id: string
  label: string
  value: string
  type: 'text' | 'textarea'
  location: string
}

const ContentManager: React.FC = () => {
  const { isAdmin } = useAdmin()
  const { contentFields, updateContent } = useContent()
  const [showContentModal, setShowContentModal] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentField | null>(null)

  const handleEditContent = (content: ContentField) => {
    setSelectedContent(content)
    setShowContentModal(true)
  }

  const handleSaveContent = (content: ContentField) => {
    updateContent(content.id, content.value)
  }

  const handleCloseModal = () => {
    setShowContentModal(false)
    setSelectedContent(null)
  }

  if (!isAdmin) return null

  return (
    <>
      <div className="content-manager">
        <button 
          onClick={() => setShowContentModal(true)}
          className="content-manager-btn"
        >
          📝 Edit Content
        </button>
      </div>

      {/* Content List Modal */}
      {showContentModal && !selectedContent && (
        <div className="content-list-modal-overlay" onClick={handleCloseModal}>
          <div className="content-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="content-list-modal-header">
              <h3>Content Management</h3>
              <button onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            
            <div className="content-list">
              {contentFields.map(content => (
                <div key={content.id} className="content-list-item">
                  <div className="content-item-info">
                    <h4>{content.label}</h4>
                    <p className="content-location">{content.location}</p>
                    <p className="content-preview">{content.value.substring(0, 100)}...</p>
                  </div>
                  <button 
                    onClick={() => handleEditContent(content)}
                    className="edit-content-btn"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Edit Modal */}
      {selectedContent && (
        <ContentEditModal
          isOpen={!!selectedContent}
          onClose={handleCloseModal}
          onSave={handleSaveContent}
          content={selectedContent}
        />
      )}
    </>
  )
}

export default ContentManager 