import React, { useState } from 'react'
import './Merch.css'

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

const Merch: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cart, setCart] = useState<{ [key: number]: number }>({})

  const products: Product[] = [
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
    },
    {
      id: 3,
      name: 'Hacker Cap',
      description: 'Futuristic baseball cap with LED accent',
      price: 24.99,
      image: '🧢',
      category: 'accessories',
      sizes: ['One Size'],
      colors: ['Black']
    },
    {
      id: 4,
      name: 'Glow Stickers Pack',
      description: 'Set of 10 glow-in-the-dark stickers',
      price: 9.99,
      image: '✨',
      category: 'accessories',
      sizes: ['One Size'],
      colors: ['Mixed']
    },
    {
      id: 5,
      name: 'Digital Dreams Vinyl',
      description: 'Limited edition vinyl record with digital download',
      price: 34.99,
      image: '💿',
      category: 'music',
      sizes: ['12"'],
      colors: ['Clear Green']
    },
    {
      id: 6,
      name: 'USB Drive Collection',
      description: '16GB USB with exclusive tracks and artwork',
      price: 19.99,
      image: '💾',
      category: 'music',
      sizes: ['16GB'],
      colors: ['Black']
    }
  ]

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'music', name: 'Music' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

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
        <h1 className="merch-title">SXNCTUARY Merch</h1>
        <p className="merch-subtitle">
          Official merchandise featuring futuristic designs and premium quality
        </p>
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
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <span className="product-emoji">{product.image}</span>
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
              {cart[product.id] ? (
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
              )}
            </div>
          </div>
        ))}
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
    </div>
  )
}

export default Merch 