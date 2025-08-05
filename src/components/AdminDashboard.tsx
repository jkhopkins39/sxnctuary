import React, { useState } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import { useContent } from '../contexts/ContentContext'
import { DatabaseService } from '../services/database'
import './AdminDashboard.css'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  sizes?: string[]
  colors?: string[]
}

interface ContentField {
  id: string
  label: string
  value: string
  type: 'text' | 'textarea'
  location: string
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAdmin()
  const { contentFields, updateContent } = useContent()
  const [activeTab, setActiveTab] = useState<'merch' | 'content'>('merch')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingContent, setEditingContent] = useState<ContentField | null>(null)

  // Mock products data - in a real app, this would come from an API
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'SXNCTUARY Logo T-Shirt',
      description: 'Premium cotton t-shirt with glowing logo design',
      price: 29.99,
      image: '🎽',
      category: 'clothing',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Dark Green']
    },
    {
      id: 2,
      name: 'Digital Dreams Hoodie',
      description: 'Comfortable hoodie featuring album artwork',
      price: 49.99,
      image: '🧥',
      category: 'clothing',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy']
    }
  ])

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      image: '🎽',
      category: 'clothing',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black']
    }
    setEditingProduct(newProduct)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId))
  }

  const handleSaveProduct = (product: Product) => {
    if (product.id && products.find(p => p.id === product.id)) {
      // Update existing product
      setProducts(products.map(p => p.id === product.id ? product : p))
    } else {
      // Add new product
      setProducts([...products, product])
    }
    setEditingProduct(null)
  }

  const handleEditContent = (content: ContentField) => {
    setEditingContent(content)
  }

  const handleSaveContent = async (content: ContentField) => {
    try {
      await updateContent(content.id, content.value)
      setEditingContent(null)
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'merch' ? 'active' : ''}`}
          onClick={() => setActiveTab('merch')}
        >
          Manage Merch
        </button>
        <button 
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Edit Content
        </button>
      </div>

      {activeTab === 'merch' && (
        <div className="merch-management">
          <div className="section-header">
            <h2>Merchandise Management</h2>
            <button onClick={handleAddProduct} className="add-btn">
              Add New Product
            </button>
          </div>

          <div className="products-list">
            {products.map(product => (
              <div key={product.id} className="product-item">
                <div className="product-info">
                  <span className="product-emoji">{product.image}</span>
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <span className="product-price">${product.price}</span>
                  </div>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="content-management">
          <div className="section-header">
            <h2>Content Management</h2>
          </div>

          <div className="content-list">
            {contentFields.map(content => (
              <div key={content.id} className="content-item">
                <div className="content-info">
                  <h3>{content.label}</h3>
                  <p className="content-location">{content.location}</p>
                  <p className="content-preview">{content.value.substring(0, 100)}...</p>
                </div>
                <button 
                  onClick={() => handleEditContent(content)}
                  className="edit-btn"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {/* Content Edit Modal */}
      {editingContent && (
        <ContentEditModal
          content={editingContent}
          onSave={handleSaveContent}
          onCancel={() => setEditingContent(null)}
        />
      )}
    </div>
  )
}

// Product Edit Modal Component
interface ProductEditModalProps {
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Product>(product)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product.id ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onCancel} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
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
            />
          </div>
          
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
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
          
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Content Edit Modal Component
interface ContentEditModalProps {
  content: ContentField
  onSave: (content: ContentField) => void
  onCancel: () => void
}

const ContentEditModal: React.FC<ContentEditModalProps> = ({ content, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ContentField>(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Content</h3>
          <button onClick={onCancel} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>{content.label}</label>
            {content.type === 'textarea' ? (
              <textarea
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                rows={4}
                required
              />
            ) : (
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                required
              />
            )}
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard 