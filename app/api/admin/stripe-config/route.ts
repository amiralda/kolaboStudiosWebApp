import { NextResponse } from 'next/server'
import { validateStripeConfig } from '@/lib/stripe-setup-guide'

export async function GET() {
  const result = validateStripeConfig()

  return NextResponse.json({
    isComplete: result.isComplete,
    missing: result.missing,
    config: {
      publishableKey: result.config.publishableKey,
      secretKey: result.config.secretKey,
      webhookSecret: result.config.webhookSecret,
    },
  })
}
