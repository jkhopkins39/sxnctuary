import React, { useState, useRef } from 'react'
import { Product, CreateProductData, UpdateProductData, DatabaseService } from '../services/database'
import './ProductEditModal.css'

interface ProductEditModalProps {
  product?: Product
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  mode: 'create' | 'edit'
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onSave, 
  mode 
}) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    images: product?.images || [''],
    category: product?.category || 'clothing',
    sizes: product?.sizes || ['S', 'M', 'L', 'XL'],
    colors: product?.colors || ['Black']
  })

  const [sizesInput, setSizesInput] = useState(product?.sizes?.join(', ') || 'S, M, L, XL')
  const [colorsInput, setColorsInput] = useState(product?.colors?.join(', ') || 'Black')
  const [uploadedImages, setUploadedImages] = useState<string[]>(product?.images || [])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const processedData = {
      ...formData,
      images: uploadedImages,
      sizes: sizesInput.split(',').map(s => s.trim()).filter(s => s),
      colors: colorsInput.split(',').map(c => c.trim()).filter(c => c)
    }

    if (mode === 'edit' && product) {
      onSave({
        ...product,
        ...processedData
      })
    } else {
      onSave({
        id: Date.now(), // Temporary ID for new products
        ...processedData
      })
    }
    
    onClose()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed 4 total images
    if (uploadedImages.length + files.length > 4) {
      alert('You can only upload up to 4 images total')
      return
    }

    setIsUploading(true)
    try {
      const imageUrls = await DatabaseService.uploadImages(files)
      setUploadedImages(prev => [...prev, ...imageUrls])
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      images: product?.images || [''],
      category: product?.category || 'clothing',
      sizes: product?.sizes || ['S', 'M', 'L', 'XL'],
      colors: product?.colors || ['Black']
    })
    setSizesInput(product?.sizes?.join(', ') || 'S, M, L, XL')
    setColorsInput(product?.colors?.join(', ') || 'Black')
    setUploadedImages(product?.images || [])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="product-modal-overlay" onClick={handleClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          <h3>{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h3>
          <button onClick={handleClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-modal-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={3}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="music">Music</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Images (Upload up to 4 images)</label>
            <div className="image-upload-section">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || uploadedImages.length >= 4}
              >
                {isUploading ? 'Uploading...' : 'Choose Images'}
              </button>
              <small className="form-help">
                {uploadedImages.length}/4 images uploaded. The first image will be the main display image.
              </small>
            </div>
            
            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="image-preview-grid">
                {uploadedImages.map((imageUrl, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={imageUrl} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Sizes (comma-separated)</label>
            <input
              type="text"
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              placeholder="S, M, L, XL"
            />
          </div>
          
          <div className="form-group">
            <label>Colors (comma-separated)</label>
            <input
              type="text"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              placeholder="Black, Dark Green"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductEditModal 