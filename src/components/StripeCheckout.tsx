import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripeConfig, stripeOptions } from '../config/stripe'
import './StripeCheckout.css'

// Load Stripe
const stripePromise = loadStripe(stripeConfig.publishableKey)

interface StripeCheckoutProps {
  amount: number
  onSuccess: (paymentIntentId: string, details: any) => void
  onError: (error: any) => void
  onCancel: () => void
  items: Array<{ product: any; quantity: number }>
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({
  amount,
  onSuccess,
  onError,
  onCancel,
  items
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create payment intent on the server
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          items: items
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required'
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        onError(confirmError)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id, {
          paymentMethod: 'stripe',
          amount: amount,
          currency: 'usd',
          status: paymentIntent.status,
          timestamp: new Date().toISOString()
        })
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'Payment failed')
      onError(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="payment-info">
        <h3>Complete Payment</h3>
        <p className="amount">Total: ${amount.toFixed(2)}</p>
      </div>

      <PaymentElement />

      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}

      <div className="payment-actions">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="pay-button"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

export default StripeCheckout
