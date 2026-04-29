// app/api/webhook/stripe/route.ts
import Stripe from "stripe"
import {
  sendBookingConfirmationEmail,
  sendBookingAdminNotificationEmail,
} from "@/lib/email/resend-client"

/**
 * Force Node runtime (not Edge) and avoid any static optimization.
 * Using raw body via req.text() is required for Stripe signature verification.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Select the correct webhook signing secret for test/live */
function getSigningSecret(): string {
  const mode = (process.env.NEXT_PUBLIC_STRIPE_MODE || "live").toLowerCase()
  const secret =
    mode === "test"
      ? process.env.STRIPE_WEBHOOK_SECRET_TEST
      : process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) {
    throw new Error(
      `Missing Stripe signing secret for mode="${mode}". ` +
        `Set ${mode === "test" ? "STRIPE_WEBHOOK_SECRET_TEST" : "STRIPE_WEBHOOK_SECRET"} in env.`
    )
  }
  return secret
}

function log(label: string, data?: unknown) {
  try {
    console.log(`[stripe:webhook] ${label}`, data ?? "")
  } catch {}
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {}
  const customerEmail =
    session.customer_details?.email ?? meta.customer_email ?? null

  const depositCents = session.amount_total ?? 0
  const depositUsd = depositCents / 100
  const fullUsd = parseFloat(meta.full_price_usd ?? "0") || depositUsd

  const bookingData = {
    customerEmail: customerEmail ?? "",
    customerName: meta.customer_name || session.customer_details?.name || "Valued Customer",
    service: meta.service
      ? meta.service.charAt(0).toUpperCase() + meta.service.slice(1)
      : "Photography",
    dateIso: meta.date_iso || undefined,
    location: meta.location || undefined,
    depositAmountUsd: depositUsd,
    fullAmountUsd: fullUsd,
    sessionId: session.id,
  }

  log("Checkout completed", {
    sessionId: session.id,
    payment_status: session.payment_status,
    amount_total: session.amount_total,
    customer_email: customerEmail,
    service: meta.service,
    date_iso: meta.date_iso,
  })

  if (!customerEmail) {
    log("No customer email — skipping confirmation email", { sessionId: session.id })
    return
  }

  // Send customer confirmation and admin notification in parallel
  const [confirmResult, adminResult] = await Promise.allSettled([
    sendBookingConfirmationEmail(bookingData),
    sendBookingAdminNotificationEmail(bookingData),
  ])

  if (confirmResult.status === "rejected") {
    log("Customer confirmation email failed", confirmResult.reason)
  } else if (!confirmResult.value.success) {
    log("Customer confirmation email error", confirmResult.value.error)
  }

  if (adminResult.status === "rejected") {
    log("Admin notification email failed", adminResult.reason)
  } else if (!adminResult.value.success) {
    log("Admin notification email error", adminResult.value.error)
  }
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  log("PaymentIntent FAILED", {
    id: pi.id,
    error: pi.last_payment_error?.message,
    customer_email: pi.receipt_email,
    metadata: pi.metadata,
  })
  // Stripe's hosted payment page already informs the customer of failure.
  // No additional email needed here — they can retry via the same session URL.
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || ""
  const rawBody = await req.text()

  let event: Stripe.Event

  try {
    event = Stripe.webhooks.constructEvent(rawBody, sig, getSigningSecret())
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log("Signature verification FAILED", msg)
    return new Response("Invalid signature", { status: 400 })
  }

  log("Event received", { id: event.id, type: event.type })

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "payment_intent.succeeded": {
        // Covered by checkout.session.completed for our deposit flow — just log.
        const pi = event.data.object as Stripe.PaymentIntent
        log("PaymentIntent succeeded", { id: pi.id, amount: pi.amount })
        break
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(pi)
        break
      }

      default:
        log("Unhandled event", event.type)
    }

    return new Response("ok", { status: 200 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log("Handler error", { eventId: event.id, error: msg })
    // Return 500 so Stripe retries transient failures (e.g., email service down)
    return new Response("Webhook handler error", { status: 500 })
  }
}

export async function GET() {
  return new Response("stripe webhook ok", { status: 200 })
}
