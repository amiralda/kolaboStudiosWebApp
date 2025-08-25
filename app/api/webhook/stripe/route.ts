// app/api/webhook/stripe/route.ts
import Stripe from "stripe";

/**
 * Force Node runtime (not Edge) and avoid any static optimization.
 * Using raw body via req.text() is required for Stripe signature verification.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Optional (only needed if you plan to call Stripe inside this route):
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
//   apiVersion: "2024-06-20",
// });

/** Select the correct webhook signing secret for test/live */
function getSigningSecret(): string {
  const mode = (process.env.NEXT_PUBLIC_STRIPE_MODE || "live").toLowerCase();
  const secret =
    mode === "test"
      ? process.env.STRIPE_WEBHOOK_SECRET_TEST
      : process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      `Missing Stripe signing secret for mode="${mode}". ` +
        `Set ${mode === "test" ? "STRIPE_WEBHOOK_SECRET_TEST" : "STRIPE_WEBHOOK_SECRET"} in env.`
    );
  }
  return secret;
}

/** Small logger helper so Vercel logs are easy to read */
function log(label: string, data?: unknown) {
  try {
    console.log(`[stripe:webhook] ${label}`, data ?? "");
  } catch {}
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";

  // IMPORTANT: use the *raw body*
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      rawBody,
      sig,
      getSigningSecret()
    );
  } catch (err: any) {
    log("Signature verification FAILED", err?.message || err);
    return new Response("Invalid signature", { status: 400 });
  }

  log("Event received", { id: event.id, type: event.type });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        log("Checkout completed", {
          sessionId: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          customer_email: session.customer_details?.email,
          metadata: session.metadata,
          mode: session.mode,
        });

        // TODO: After deposit confirmation:
        // - Mark booking as confirmed in DB
        // - Create Google Calendar event with buffer
        // - Send confirmation SMS/Email
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        log("PaymentIntent succeeded", {
          id: pi.id,
          amount: pi.amount,
          currency: pi.currency,
          metadata: pi.metadata,
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        log("PaymentIntent FAILED", {
          id: pi.id,
          error: pi.last_payment_error?.message,
        });
        break;
      }

      default: {
        // Keep it quiet but visible in logs
        log("Unhandled event", event.type);
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    log("Handler error", err?.message || err);
    // Signal a temporary failure so Stripe can retry
    return new Response("Webhook handler error", { status: 500 });
  }
}

/** Optional quick GET health check */
export async function GET() {
  return new Response("stripe webhook ok", { status: 200 });
}
