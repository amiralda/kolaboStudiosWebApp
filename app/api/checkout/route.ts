// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" });

// Keep in sync with /booking
const SERVICES: Record<string, { label: string; hours: number; priceUsd: number }> = {
  wedding4:     { label: "Wedding (4h)",      hours: 4, priceUsd: 1500 },
  wedding8:     { label: "Wedding (8h)",      hours: 8, priceUsd: 2800 },
  engagement4:  { label: "Engagement (4h)",   hours: 4, priceUsd: 900  },
  engagement5:  { label: "Engagement (5h)",   hours: 5, priceUsd: 1100 },
  maternity2:   { label: "Maternity (2h)",    hours: 2, priceUsd: 550  },
};

export async function POST(req: Request) {
  try {
    const { serviceKey, date, time, location, clientEmail } = await req.json();
    const svc = SERVICES[serviceKey];
    if (!svc) return NextResponse.json({ error: "Invalid service." }, { status: 400 });
    if (!date || !time || !location || !clientEmail) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const depositUsd = Math.round(svc.priceUsd * 0.6);
    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/booking?success=1`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/booking?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: clientEmail,
      payment_intent_data: {
        receipt_email: clientEmail, // auto email receipt
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: depositUsd * 100,
            product_data: {
              name: `${svc.label} — Deposit (60%)`,
              description: `Date: ${date} ${time} • Location: ${location}`,
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        serviceKey,
        hours: String(svc.hours),
        date,
        time,
        location,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Checkout error." }, { status: 500 });
  }
}
