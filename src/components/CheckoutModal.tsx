import React, { useState } from 'react'
import { Product } from '../services/database'
import PayPalCheckout from './PayPalCheckout'
import './CheckoutModal.css'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: { [key: number]: number }
  products: Product[]
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  products
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId))
      return total + (product?.price || 0) * quantity
    }, 0)
  }

  const getCartItems = () => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId))
      return { product, quantity }
    }).filter((item): item is { product: Product; quantity: number } => item.product !== undefined)
  }

  const handlePaymentSuccess = async (orderId: string, details: any) => {
    setIsProcessing(true)
    
    try {
      // Send order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalOrderId: orderId,
          paypalDetails: details,
          cart: cart,
          customerInfo: {
            email: details.payer.email_address,
            name: `${details.payer.name.given_name} ${details.payer.name.surname}`
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process order');
      }

      const result = await response.json();
      console.log('Order processed:', result);
      
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
    alert('Payment failed. Please try again.')
  }

  const handlePaymentCancel = () => {
    setIsProcessing(false)
    console.log('Payment cancelled')
  }

  const handleClose = () => {
    if (!isProcessing) {
      setOrderComplete(false)
      setOrderId('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="checkout-modal-overlay" onClick={handleClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose} disabled={isProcessing}>
          ×
        </button>

        {!orderComplete ? (
          <>
            <div className="checkout-header">
              <h2>Checkout</h2>
              <p>Complete your purchase securely with PayPal</p>
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-items">
                {getCartItems().map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{product.name}</span>
                      <span className="item-quantity">Qty: {quantity}</span>
                    </div>
                    <span className="item-price">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-amount">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-section">
              <h3>Payment</h3>
              <PayPalCheckout
                cart={cart}
                products={products}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
                className="paypal-container"
              />
            </div>
          </>
        ) : (
          <div className="success-section">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase.</p>
            <p className="order-id">Order ID: {orderId}</p>
            <p>You will receive a confirmation email shortly.</p>
            <button className="btn btn-primary" onClick={handleClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
