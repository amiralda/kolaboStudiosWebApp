// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY_LIVE ||
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY_TEST;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kolabostudios.com";

const DEPOSIT_RATE = Number(process.env.DEPOSIT_RATE || "0.6"); // 60%

if (!STRIPE_SECRET_KEY) {
  // Fail early (prevents silent 500s)
  throw new Error(
    "Missing STRIPE_SECRET_KEY(_LIVE/_TEST). Add it to your environment."
  );
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

type Body = {
  // one of: "wedding" | "engagement" | "maternity"
  service?: string;
  serviceKey?: string;

  // optional total price (USD) – if sent, deposit = 60% of this
  // if not sent, a fallback per-service table is used
  fullPrice?: number;

  // ISO 8601 date/time (e.g., 2025-09-12T14:00:00-04:00)
  dateISO?: string;
  date?: string;
  time?: string;

  // free text
  location?: string;

  // customer context (for receipt + metadata)
  customerName?: string;
  customerEmail?: string;

  // "en" | "fr" | "es" | "ht" (Haitian Creole)
  language?: string;

  // optional: reference id from your UI
  referenceId?: string;
};

const DEFAULT_SERVICE_PRICE_USD: Record<string, number> = {
  // used only if client did not send fullPrice
  wedding: 2500,
  engagement: 750,
  maternity: 550,
};

function dollarsToCents(x: number) {
  return Math.max(50, Math.round(x * 100)); // never below $0.50
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const rawService = (body.service || body.serviceKey || "wedding").toLowerCase();
    const service =
      Object.keys(DEFAULT_SERVICE_PRICE_USD).find((key) => rawService.startsWith(key)) ||
      rawService;
    const fullPriceUsd =
      typeof body.fullPrice === "number" && body.fullPrice > 0
        ? body.fullPrice
        : DEFAULT_SERVICE_PRICE_USD[service] ?? 1000;

    // compute the 60% deposit in cents
    const depositUsd = fullPriceUsd * DEPOSIT_RATE;
    const amount_cents = dollarsToCents(depositUsd);

    const combinedDate = body.dateISO ?? (body.date ? `${body.date}T${body.time ?? "00:00"}` : undefined);

    const title =
      `${capitalize(service)} Deposit (${Math.round(DEPOSIT_RATE * 100)}%)` +
      (combinedDate ? ` — ${formatShortDate(combinedDate)}` : "");

    // Clean metadata to keep Stripe dashboard tidy
    const metadata: Record<string, string> = {
      kind: "deposit",
      service,
      deposit_rate: String(DEPOSIT_RATE),
      full_price_usd: String(fullPriceUsd),
      date_iso: combinedDate || "",
      location: body.location || "",
      customer_name: body.customerName || "",
      language: (body.language || "en").toLowerCase(),
      reference_id: body.referenceId || "",
      site_url: SITE_URL,
      service_key: body.serviceKey || "",
    };

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
      // Attach the same metadata at the session level too
      metadata,
      payment_intent_data: {
        receipt_email: body.customerEmail || undefined,
        metadata,
      },
      // Allow only card by default. Add other payment methods if desired.
      payment_method_types: ["card"],
      // Promotion codes optional:
      allow_promotion_codes: false,
      // Automatic tax can be enabled later if you need it:
      // automatic_tax: { enabled: true },
      consent_collection: {
        terms_of_service: "required",
      },
      // Optional: custom text (shows under the pay button)
      custom_text: {
        submit: {
          message:
            "You’re paying a 60% deposit to secure your date. You’ll receive an email receipt.",
        },
      },
    });

    return NextResponse.json(
      { id: session.id, url: session.url, sessionId: session.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("checkout error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Unable to create checkout session" },
      { status: 500 }
    );
  }
}

/* ------------ helpers ------------ */

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function formatShortDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    // e.g., Sep 14, 2025 2:00 PM
    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
