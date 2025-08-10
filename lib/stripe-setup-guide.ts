// This file contains setup instructions and validation

export const STRIPE_SETUP_STEPS = [
  {
    step: 1,
    title: "Create Stripe Account",
    description: "Sign up at stripe.com and complete business verification",
    status: "required"
  },
  {
    step: 2,
    title: "Get API Keys",
    description: "Copy publishable and secret keys from Stripe Dashboard",
    status: "required"
  },
  {
    step: 3,
    title: "Set Environment Variables",
    description: "Add keys to your .env.local file",
    status: "required"
  },
  {
    step: 4,
    title: "Configure Webhooks",
    description: "Set up webhook endpoint in Stripe Dashboard",
    status: "required"
  },
  {
    step: 5,
    title: "Test Payments",
    description: "Use test cards to verify everything works",
    status: "recommended"
  }
]

export const TEST_CARDS = {
  success: "4242424242424242",
  declined: "4000000000000002",
  requiresAuth: "4000002500003155",
  insufficient: "4000000000009995"
}

export function validateStripeConfig() {
  const config = {
    publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: !!process.env.STRIPE_SECRET_KEY,
    webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  }

  const isComplete = Object.values(config).every(Boolean)
  
  return {
    isComplete,
    config,
    missing: Object.entries(config)
      .filter(([_, value]) => !value)
      .map(([key]) => key)
  }
}
