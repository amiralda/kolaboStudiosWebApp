// app/api/webhook/stripe/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'            // ensure Node runtime (not Edge)
export const dynamic = 'force-dynamic'     // do not prerender this route

// Lazy init Stripe server SDK
let stripe: Stripe | null = null
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    stripe = new Stripe(key, { apiVersion: '2024-06-20' })
  }
  return stripe!
}

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature')
    const secret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !secret) {
      // Don’t throw—return 200 so Stripe doesn’t retry forever in prod while you’re configuring
      console.warn('Missing stripe signature or webhook secret env')
      return NextResponse.json({ ok: true, skipped: true }, { status: 200 })
    }

    // Stripe needs the *raw* request body string
    const rawBody = await req.text()

    // Verify event
    const event = getStripe().webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      secret
    )

    // Handle a few common event types (no-ops — extend as you need)
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'charge.succeeded':
      case 'checkout.session.completed':
        // TODO: update order in DB, send emails, etc.
        break
      default:
        // Optional: log unhandled types for later
        // console.log(`Unhandled event type ${event.type}`)
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err: any) {
    console.error('Stripe webhook error:', err?.message || err)
    // Return 200 to avoid endless Stripe retries during setup; switch to 400 later if desired
    return NextResponse.json({ error: 'webhook verification failed' }, { status: 200 })
  }
}
