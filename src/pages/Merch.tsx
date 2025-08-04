import React, { useState, useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import { useContent } from '../contexts/ContentContext'
import { DatabaseService, Product } from '../services/database'
import ProductEditModal from '../components/ProductEditModal'
import ProductDetailModal from '../components/ProductDetailModal'
import './Merch.css'



const Merch: React.FC = () => {
  const { isAdmin } = useAdmin()
  const { getContent } = useContent()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'music', name: 'Music' }
  ]

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const productsData = await DatabaseService.getAllProducts()
        setProducts(productsData)
        
        // Seed products if none exist
        if (productsData.length === 0) {
          await DatabaseService.seedProducts()
          const seededProducts = await DatabaseService.getAllProducts()
          setProducts(seededProducts)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  // Admin functions
  const handleAddProduct = () => {
    setEditingProduct(null)
    setModalMode('create')
    setShowEditModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setModalMode('edit')
    setShowEditModal(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const success = await DatabaseService.deleteProduct(productId)
        if (success) {
          setProducts(products.filter(p => p.id !== productId))
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      if (modalMode === 'create') {
        const newProduct = await DatabaseService.createProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          category: product.category,
          sizes: product.sizes,
          colors: product.colors
        })
        if (newProduct) {
          setProducts([newProduct, ...products])
        }
      } else {
        const updatedProduct = await DatabaseService.updateProduct(product.id, {
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          category: product.category,
          sizes: product.sizes,
          colors: product.colors
        })
        if (updatedProduct) {
          setProducts(products.map(p => p.id === product.id ? updatedProduct : p))
        }
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product)
    setShowDetailModal(true)
  }

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId] -= 1
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId))
      return total + (product?.price || 0) * quantity
    }, 0)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  return (
    <div className="merch-page">
      <div className="merch-header">
        <h1 className="merch-title">{getContent('merch-title')}</h1>
        <p className="merch-subtitle">
          {getContent('merch-subtitle')}
        </p>
        {isAdmin && (
          <button onClick={handleAddProduct} className="add-product-btn">
            + Add New Product
          </button>
        )}
      </div>

      {/* Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="cart-summary">
          <div className="cart-info">
            <span className="cart-count">{getCartItemCount()} items</span>
            <span className="cart-total">${getCartTotal().toFixed(2)}</span>
          </div>
          <button className="btn btn-primary checkout-btn">
            Checkout
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
                          <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="product-main-image"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200x200/333/666?text=No+Image'
                  }}
                />
              ) : (
                <div className="no-image-placeholder">
                  <span>📷</span>
                  <p>No Image</p>
                </div>
              )}
              <div className="product-glow"></div>
            </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-details">
                  {product.sizes && (
                    <div className="product-sizes">
                      <span className="detail-label">Sizes:</span>
                      <span className="detail-value">{product.sizes.join(', ')}</span>
                    </div>
                  )}
                  {product.colors && (
                    <div className="product-colors">
                      <span className="detail-label">Colors:</span>
                      <span className="detail-value">{product.colors.join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="product-price">${product.price}</div>
              </div>

              <div className="product-actions">
                <div className="action-buttons">
                  <button 
                    className="view-btn"
                    onClick={() => handleViewProduct(product)}
                  >
                    View
                  </button>
                  
                  {isAdmin ? (
                    <>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    cart[product.id] ? (
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => removeFromCart(product.id)}
                        >
                          -
                        </button>
                        <span className="quantity">{cart[product.id]}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => addToCart(product.id)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary add-to-cart-btn"
                        onClick={() => addToCart(product.id)}
                      >
                        Add to Cart
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try selecting a different category</p>
        </div>
      )}

      {/* Shipping Info */}
      <div className="shipping-info">
        <h3>Shipping & Returns</h3>
        <div className="shipping-details">
          <div className="shipping-item">
            <span className="shipping-icon">🚚</span>
            <div>
              <h4>Free Shipping</h4>
              <p>On orders over $50</p>
            </div>
          </div>
          <div className="shipping-item">
            <span className="shipping-icon">🔄</span>
            <div>
              <h4>30-Day Returns</h4>
              <p>Easy returns and exchanges</p>
            </div>
          </div>
          <div className="shipping-item">
            <span className="shipping-icon">🛡️</span>
            <div>
              <h4>Secure Checkout</h4>
              <p>SSL encrypted payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Edit Modal */}
      <ProductEditModal
        product={editingProduct || undefined}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProduct}
        mode={modalMode}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={viewingProduct!}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  )
}

export default Merch 