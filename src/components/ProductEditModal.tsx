import React, { useState } from 'react'
import { Product, CreateProductData, UpdateProductData } from '../services/database'
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
    image: product?.image || '🎽',
    category: product?.category || 'clothing',
    sizes: product?.sizes || ['S', 'M', 'L', 'XL'],
    colors: product?.colors || ['Black']
  })

  const [sizesInput, setSizesInput] = useState(product?.sizes?.join(', ') || 'S, M, L, XL')
  const [colorsInput, setColorsInput] = useState(product?.colors?.join(', ') || 'Black')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const processedData = {
      ...formData,
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

  const handleClose = () => {
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      image: product?.image || '🎽',
      category: product?.category || 'clothing',
      sizes: product?.sizes || ['S', 'M', 'L', 'XL'],
      colors: product?.colors || ['Black']
    })
    setSizesInput(product?.sizes?.join(', ') || 'S, M, L, XL')
    setColorsInput(product?.colors?.join(', ') || 'Black')
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
            <label>Image Emoji</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="🎽"
              required
            />
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