export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: import.meta.env.STRIPE_SECRET_KEY || ''
}

export const stripeOptions = {
  mode: 'payment' as const,
  currency: 'usd' as const,
  appearance: {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#00ff88',
      colorBackground: '#1a1a1a',
      colorText: '#ffffff',
      colorDanger: '#ff4444',
      fontFamily: 'Share Tech Mono, monospace',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  }
}
