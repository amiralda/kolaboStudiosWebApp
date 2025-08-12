// app/api/webhook/stripe/route.ts
export const dynamic = 'force-dynamic'
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';          // ensure Node runtime (not Edge)
export const dynamic = 'force-dynamic';   // don’t prerender anything here

let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      // At build-time, don’t crash the whole build — just throw at runtime if called
      throw new Error('Missing STRIPE_SECRET_KEY');
    }
    stripe = new Stripe(key, {
      apiVersion: '2024-06-20', // or your current Stripe API version
    });
  }
  return stripe;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return new Response('Missing stripe-signature or webhook secret', { status: 400 });
  }

  let event: Stripe.Event;
  const rawBody = await req.text(); // IMPORTANT: use raw body for Stripe

  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle events you care about
  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: mark order paid in your DB
      break;
    // add other events as needed
  }

  return new Response('ok', { status: 200 });
}
