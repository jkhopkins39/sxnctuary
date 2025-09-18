import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Product } from '../services/database'
import './Checkout.css'

interface CartItem {
  product: Product
  quantity: number
}

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Error boundary state
  const [hasError, setHasError] = useState(false)
  
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [products, setProducts] = useState<Product[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [productsLoading, setProductsLoading] = useState(true)

  // Load cart and products from location state or localStorage
  useEffect(() => {
    try {
      const stateCart = location.state?.cart
      if (stateCart) {
        console.log('Loading cart from state:', stateCart)
        setCart(stateCart)
      } else {
        // Fallback to localStorage if no state
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          console.log('Loading cart from localStorage:', savedCart)
          setCart(JSON.parse(savedCart))
        }
      }

      // Load products
      const loadProducts = async () => {
        try {
          setProductsLoading(true)
          const response = await fetch('http://localhost:3001/api/products')
          if (response.ok) {
            const productsData = await response.json()
            console.log('Loaded products:', productsData)
            setProducts(productsData)
          } else {
            console.error('Failed to load products:', response.status, response.statusText)
          }
        } catch (error) {
          console.error('Error loading products:', error)
        } finally {
          setProductsLoading(false)
        }
      }
      loadProducts()
    } catch (error) {
      console.error('Error in checkout useEffect:', error)
      setHasError(true)
    }
  }, [location.state])

  const getCartItems = (): CartItem[] => {
    const items = Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId))
      return { product, quantity }
    }).filter((item): item is CartItem => item.product !== undefined)
    
    console.log('Cart items:', items)
    console.log('Cart state:', cart)
    console.log('Products state:', products)
    
    return items
  }

  const getCartTotal = () => {
    return getCartItems().reduce((total, { product, quantity }) => {
      return total + (product.price * quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  const handlePaymentSuccess = async (orderId: string, details: any) => {
    setIsProcessing(true)
    
    try {
      // Send order to backend
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripeOrderId: orderId,
          stripeDetails: details,
          cart: cart,
          customerInfo: {
            email: 'stripe@example.com',
            name: 'Stripe User'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process order');
      }

      const result = await response.json();
      console.log('Order processed:', result);
      
      // Clear cart from localStorage
      localStorage.removeItem('cart')
      
      setIsProcessing(false)
      setOrderComplete(true)
      setOrderId(orderId)
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false)
      alert('Payment successful but order processing failed. Please contact support.')
    }
  }

  const handlePaymentError = (error: any) => {
    setIsProcessing(false)
    console.error('Payment error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    
    // More specific error messages
    let errorMessage = 'Payment failed. Please try again.'
    
    if (error.details && error.details.length > 0) {
      const firstError = error.details[0]
      if (firstError.issue === 'INSTRUMENT_DECLINED') {
        errorMessage = 'Payment was declined. Please try a different payment method.'
      } else if (firstError.issue === 'PAYER_ACCOUNT_RESTRICTED') {
        errorMessage = 'PayPal account is restricted. Please use a different payment method.'
      } else if (firstError.issue === 'PAYMENT_NOT_APPROVED_FOR_EXECUTION') {
        errorMessage = 'Payment was not approved. Please try again.'
      }
    }
    
    alert(errorMessage)
  }

  const handlePaymentCancel = () => {
    setIsProcessing(false)
    console.log('Payment cancelled')
  }

  const handleContinueShopping = () => {
    navigate('/merch')
  }

  const handleBackToCart = () => {
    navigate('/merch')
  }

  // Show error state
  if (hasError) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-header">
            <button className="back-btn" onClick={() => navigate('/merch')}>
              ← Back to Merch
            </button>
            <h1>Checkout</h1>
          </div>
          
          <div className="checkout-empty">
            <div className="empty-content">
              <h2>Something went wrong</h2>
              <p>There was an error loading the checkout page. Please try again.</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading if products are still loading
  if (productsLoading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    )
  }

  // Show error if products failed to load
  if (products.length === 0 && !productsLoading) {
    return (
      <div className="checkout-empty">
        <div className="empty-content">
          <h2>Failed to load products</h2>
          <p>Please refresh the page and try again.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Redirect if no items in cart
  if (getCartItemCount() === 0 && !orderComplete) {
    return (
      <div className="checkout-empty">
        <div className="empty-content">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
          <button className="btn btn-primary" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button className="back-btn" onClick={handleBackToCart}>
            ← Back to Cart
          </button>
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <span className="step active">1. Review Order</span>
            <span className="step-divider">→</span>
            <span className="step">2. Payment</span>
          </div>
        </div>

        {!orderComplete ? (
          <div className="checkout-content">
            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="cart-items">
                {getCartItems().map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item">
                    <div className="item-image">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/60x60/333/666?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="no-image">📷</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{product.name}</h3>
                      <p className="item-description">{product.description}</p>
                      {product.sizes && (
                        <span className="item-variant">Size: {product.sizes[0]}</span>
                      )}
                    </div>
                    <div className="item-quantity">
                      <span>Qty: {quantity}</span>
                    </div>
                    <div className="item-price">
                      ${(product.price * quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="total-row total-final">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="payment-section">
              <h2>Payment</h2>
              <div className="payment-methods">
                <div className="payment-method">
                  <div className="method-header">
                    <span>💳</span>
                    <span>Credit Card</span>
                  </div>
                  <p>Pay securely with your credit card</p>
                </div>
              </div>
              
              <div className="payment-container">
                <div className="payment-form">
                  <div className="payment-info">
                    <h3>Complete Payment</h3>
                    <p className="amount">Total: ${getCartTotal().toFixed(2)}</p>
                  </div>
                  
                  <div className="payment-fields">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456"
                        className="card-input"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="card-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          className="card-input"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Name on Card</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="card-input"
                      />
                    </div>
                  </div>
                  
                  <div className="payment-actions">
                    <button
                      type="button"
                      onClick={() => handlePaymentSuccess('demo_order_123', {
                        paymentMethod: 'demo',
                        amount: getCartTotal(),
                        currency: 'usd',
                        status: 'completed',
                        timestamp: new Date().toISOString()
                      })}
                      className="pay-button"
                    >
                      Pay ${getCartTotal().toFixed(2)}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handlePaymentCancel}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="success-section">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <h2>Payment Successful!</h2>
              <p>Thank you for your purchase. Your order has been confirmed.</p>
              <div className="order-details">
                <p className="order-id">Order ID: {orderId}</p>
                <p>You will receive a confirmation email shortly.</p>
              </div>
              <button className="btn btn-primary" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
