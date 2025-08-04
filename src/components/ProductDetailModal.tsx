import React, { useState } from 'react'
import { Product } from '../services/database'
import './ProductDetailModal.css'

interface ProductDetailModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleClose = () => {
    setCurrentImageIndex(0)
    onClose()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  if (!isOpen) return null

  return (
    <div className="product-detail-overlay" onClick={handleClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-detail-header">
          <h3>{product.name}</h3>
          <button onClick={handleClose} className="close-btn">×</button>
        </div>
        
        <div className="product-detail-content">
          {/* Image Gallery */}
          <div className="image-gallery">
            {product.images && product.images.length > 0 ? (
              <>
                <div className="main-image-container">
                  <img 
                    src={product.images[currentImageIndex]} 
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className="main-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x400/333/666?text=Image+Not+Found'
                    }}
                  />
                  
                  {product.images.length > 1 && (
                    <>
                      <button className="nav-btn prev-btn" onClick={prevImage}>
                        ‹
                      </button>
                      <button className="nav-btn next-btn" onClick={nextImage}>
                        ›
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                {product.images.length > 1 && (
                  <div className="thumbnail-nav">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img 
                          src={image} 
                          alt={`Thumbnail ${index + 1}`}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/60x60/333/666?text=X'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-images-placeholder">
                <span>📷</span>
                <p>No Images Available</p>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            <h4 className="product-name">{product.name}</h4>
            <p className="product-description">{product.description}</p>
            
            <div className="product-details">
              <div className="detail-row">
                <span className="detail-label">Price:</span>
                <span className="detail-value price">${product.price}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{product.category}</span>
              </div>
              
              {product.sizes && product.sizes.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Sizes:</span>
                  <span className="detail-value">{product.sizes.join(', ')}</span>
                </div>
              )}
              
              {product.colors && product.colors.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Colors:</span>
                  <span className="detail-value">{product.colors.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal 