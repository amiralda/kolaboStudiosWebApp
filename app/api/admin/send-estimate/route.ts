import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import Stripe from "stripe"
import { createSupabaseServerClient } from "@/lib/database/supabase"
import { sendEstimateEmail } from "@/lib/email/resend-client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Step 3 of the booking-request flow (admin only).
 *
 * Auth: this route lives under /api/admin/*, which middleware.ts already
 * protects with HTTP Basic Auth (ADMIN_SECRET). No new auth system here.
 *
 * Dany fills in the estimate form on /admin/bookings; this endpoint:
 *   1. looks the booking up in Supabase by its ref,
 *   2. creates a Stripe Payment Link for the deposit,
 *   3. emails the customer the estimate (from hello@, reply-to hello@)
 *      with the pay link,
 *   4. marks the booking "quoted".
 *
 * If Supabase is not configured the lookup fails and the endpoint
 * answers 503 — Dany then uses the Stripe Dashboard fallback instead
 * (create the Payment Link there and email the customer directly).
 */

const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY_LIVE ||
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY_TEST

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null

const SendEstimateSchema = z
  .object({
    bookingRef: z.string().min(1, "Booking ref is required").max(50),
    fullPriceUsd: z.number().min(100, "Full price is too low").max(10_000, "Full price is too high"),
    depositUsd: z.number().min(50, "Deposit is too low").max(10_000, "Deposit is too high"),
    message: z.string().min(10, "Please write a short message for the customer").max(2000, "Message too long"),
  })
  .refine((v) => v.depositUsd <= v.fullPriceUsd, {
    message: "Deposit cannot be more than the full price",
  })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = SendEstimateSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid request"
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { bookingRef, fullPriceUsd, depositUsd, message } = parsed.data

    let supabase
    try {
      supabase = createSupabaseServerClient()
    } catch {
      return NextResponse.json(
        { error: "Booking storage is not configured on this server. Create the Stripe Payment Link in the Stripe Dashboard and email the customer directly instead." },
        { status: 503 }
      )
    }

    const { data: booking, error: lookupError } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("booking_ref", bookingRef)
      .single()

    if (lookupError || !booking) {
      return NextResponse.json(
        { error: `Booking ${bookingRef} was not found.` },
        { status: 404 }
      )
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured on this server. Create the Payment Link in the Stripe Dashboard and email the customer directly instead." },
        { status: 500 }
      )
    }

    const depositCents = Math.max(50, Math.round(depositUsd * 100))

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${booking.service_label} Deposit (60%) — ${bookingRef}`,
              description:
                "Deposit to reserve your Kolabo Studios booking. Remaining balance due on or before your session day.",
              metadata: {
                kind: "deposit",
                booking_ref: bookingRef,
                service_key: booking.service_key,
                full_price_usd: String(fullPriceUsd),
                customer_email: booking.email,
              },
            },
            unit_amount: depositCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "deposit",
        booking_ref: bookingRef,
        service_key: booking.service_key,
        full_price_usd: String(fullPriceUsd),
        customer_email: booking.email,
      },
    })

    const emailResult = await sendEstimateEmail({
      bookingRef,
      customerName: booking.name,
      customerEmail: booking.email,
      service: booking.service_label,
      dateIso: booking.date_iso,
      location: booking.location,
      fullAmountUsd: fullPriceUsd,
      depositAmountUsd: depositUsd,
      message,
      paymentLinkUrl: paymentLink.url,
    })

    if (!emailResult.success) {
      // The pay link exists — return it so Dany can send it manually.
      return NextResponse.json(
        {
          success: false,
          error: `Pay link created, but the estimate email failed to send: ${emailResult.error ?? "unknown error"}. You can copy the link below and email it to the customer yourself.`,
          paymentLinkUrl: paymentLink.url,
        },
        { status: 500 }
      )
    }

    // Best-effort status update; a failure here must not fail the request.
    const { error: updateError } = await supabase
      .from("booking_requests")
      .update({ status: "quoted" })
      .eq("booking_ref", bookingRef)
    if (updateError) {
      console.error("❌ Booking status update error:", updateError.message)
    }

    return NextResponse.json({ success: true, paymentLinkUrl: paymentLink.url })
  } catch (error) {
    console.error("❌ Send estimate error:", error)
    return NextResponse.json(
      { error: "Failed to send the estimate. Please try again." },
      { status: 500 }
    )
  }
}
