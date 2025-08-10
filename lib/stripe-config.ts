import { loadStripe } from '@stripe/stripe-js'

// Safely handle environment variables
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Only load Stripe if the key is available
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export { stripePromise }

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}

// Check if Stripe is properly configured
export const isStripeConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_SECRET_KEY
  )
}

// Stripe product/price IDs - these would be created in your Stripe dashboard
export const STRIPE_PRICES = {
  'basic-retouch': 'price_basic_retouch_id',
  'standard-retouch': 'price_standard_retouch_id', 
  'premium-retouch': 'price_premium_retouch_id',
  'rush-delivery': 'price_rush_delivery_id',
}
