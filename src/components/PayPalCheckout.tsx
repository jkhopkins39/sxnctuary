import React from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { Product } from '../services/database'

interface PayPalCheckoutProps {
  cart: { [key: number]: number }
  products: Product[]
  onSuccess: (orderId: string, details: any) => void
  onError: (error: any) => void
  onCancel: () => void
  className?: string
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  cart,
  products,
  onSuccess,
  onError,
  onCancel,
  className = ''
}) => {
  const [{ isPending }] = usePayPalScriptReducer()

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId))
      return total + (product?.price || 0) * quantity
    }, 0)
  }

  const getCartItems = () => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId))
      return {
        name: product?.name || 'Unknown Product',
        quantity: quantity.toString(),
        unit_amount: {
          currency_code: 'USD',
          value: product?.price?.toString() || '0'
        }
      }
    })
  }

  if (isPending) {
    return (
      <div className={`paypal-loading ${className}`}>
        <div className="loading-spinner"></div>
        <p>Loading PayPal...</p>
      </div>
    )
  }

  return (
    <div className={`paypal-checkout ${className}`}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay'
        }}
        createOrder={(data, actions) => {
          const total = getCartTotal()
          const items = getCartItems()
          
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: total.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: 'USD',
                      value: total.toFixed(2)
                    }
                  }
                },
                items: items,
                description: 'SXNCTUARY Merchandise'
              }
            ]
          })
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order?.capture()
            if (details) {
              onSuccess(data.orderID, details)
            }
          } catch (error) {
            onError(error)
          }
        }}
        onError={(err) => {
          onError(err)
        }}
        onCancel={() => {
          onCancel()
        }}
      />
    </div>
  )
}

export default PayPalCheckout
