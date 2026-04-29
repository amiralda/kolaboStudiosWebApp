// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY_LIVE ||
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY_TEST

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kolabostudios.com"

const DEPOSIT_RATE = Number(process.env.DEPOSIT_RATE || "0.6") // 60%

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null

/**
 * Authoritative server-side price table — never trust the client for amounts.
 * All values are in USD. Add new packages here as the business grows.
 */
const SERVER_PRICES_USD: Record<string, number> = {
  wedding: 2500,
  "wedding-4h": 1500,
  "wedding-8h": 2800,
  engagement: 750,
  "engagement-4h": 900,
  "engagement-5h": 1100,
  maternity: 550,
  "maternity-2h": 550,
}

const ALLOWED_SERVICES = new Set(Object.keys(SERVER_PRICES_USD))

/** Clamp custom/unknown prices to a safe range to prevent manipulation */
const CUSTOM_PRICE_MIN_USD = 100
const CUSTOM_PRICE_MAX_USD = 10_000

type Body = {
  service?: string
  serviceKey?: string
  // fullPrice is only used for unrecognized custom services; ignored for known services
  fullPrice?: number
  dateISO?: string
  date?: string
  time?: string
  location?: string
  customerName?: string
  customerEmail?: string
  language?: string
  referenceId?: string
}

function dollarsToCents(x: number) {
  return Math.max(50, Math.round(x * 100))
}

function resolvePrice(rawService: string, clientPrice?: number): { fullPriceUsd: number; isCustom: boolean } {
  // Exact match first, then prefix match (e.g. "wedding-custom" → "wedding")
  if (SERVER_PRICES_USD[rawService] !== undefined) {
    return { fullPriceUsd: SERVER_PRICES_USD[rawService], isCustom: false }
  }

  const prefix = Object.keys(SERVER_PRICES_USD).find((key) => rawService.startsWith(key))
  if (prefix) {
    return { fullPriceUsd: SERVER_PRICES_USD[prefix], isCustom: false }
  }

  // Unknown service — use client-provided price, clamped to safe range
  const clamped = Math.min(
    CUSTOM_PRICE_MAX_USD,
    Math.max(CUSTOM_PRICE_MIN_USD, typeof clientPrice === "number" && isFinite(clientPrice) ? clientPrice : CUSTOM_PRICE_MIN_USD)
  )
  return { fullPriceUsd: clamped, isCustom: true }
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Checkout service not configured." },
        { status: 500 }
      )
    }

    const body = (await req.json()) as Body

    const rawService = ((body.service || body.serviceKey || "wedding") as string)
      .toLowerCase()
      .trim()

    const { fullPriceUsd } = resolvePrice(rawService, body.fullPrice)

    // Normalize service label for display (use first matching known key, or raw value)
    const serviceLabel =
      ALLOWED_SERVICES.has(rawService)
        ? rawService
        : Object.keys(SERVER_PRICES_USD).find((key) => rawService.startsWith(key)) ?? rawService

    const depositUsd = fullPriceUsd * DEPOSIT_RATE
    const amount_cents = dollarsToCents(depositUsd)

    const combinedDate =
      body.dateISO ?? (body.date ? `${body.date}T${body.time ?? "00:00"}` : undefined)

    const title =
      `${capitalize(serviceLabel)} Deposit (${Math.round(DEPOSIT_RATE * 100)}%)` +
      (combinedDate ? ` — ${formatShortDate(combinedDate)}` : "")

    const metadata: Record<string, string> = {
      kind: "deposit",
      service: serviceLabel,
      deposit_rate: String(DEPOSIT_RATE),
      full_price_usd: String(fullPriceUsd),
      date_iso: combinedDate || "",
      location: (body.location || "").slice(0, 500),
      customer_name: (body.customerName || "").slice(0, 200),
      language: ((body.language || "en") as string).toLowerCase(),
      reference_id: (body.referenceId || "").slice(0, 200),
      site_url: SITE_URL,
      service_key: (body.serviceKey || "").slice(0, 100),
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "usd",
      customer_email: body.customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description:
                "Deposit to reserve your Kolabo Studios booking. Remaining balance due per agreement.",
              metadata,
            },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/booking/cancel`,
      metadata,
      payment_intent_data: {
        receipt_email: body.customerEmail || undefined,
        metadata,
      },
      payment_method_types: ["card"],
      allow_promotion_codes: false,
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        submit: {
          message:
            "You're paying a 60% deposit to secure your date. You'll receive an email receipt.",
        },
      },
    })

    return NextResponse.json({ id: session.id, url: session.url }, { status: 200 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unable to create checkout session"
    console.error("checkout error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/* ------------ helpers ------------ */

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function formatShortDate(iso?: string) {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}
