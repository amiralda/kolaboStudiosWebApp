import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { createSupabaseServerClient } from "@/lib/database/supabase"
import {
  sendBookingRequestConfirmation,
  sendBookingRequestNotification,
} from "@/lib/email/resend-client"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const ALLOWED_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kolabostudios.com"

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

/**
 * Booking-request flow (2026-11-08): a visitor books by sending ALL shoot
 * details. NO payment happens here — no Stripe call, no charge, no
 * redirect. Dany reviews the request and sends the estimate + a deposit
 * pay link afterwards (see the admin notification email).
 */

/** Server-side price table — the ONLY source of prices. Never trust client amounts. */
const BOOKING_SERVICES = {
  wedding4: { label: "Wedding (4h)", hours: 4, priceUsd: 1500 },
  wedding8: { label: "Wedding (8h)", hours: 8, priceUsd: 2800 },
  engagement4: { label: "Engagement (4h)", hours: 4, priceUsd: 900 },
  engagement5: { label: "Engagement (5h)", hours: 5, priceUsd: 1100 },
  maternity2: { label: "Maternity (2h)", hours: 2, priceUsd: 550 },
  portrait2: { label: "Portrait (2h)", hours: 2, priceUsd: 250 },
  family3: { label: "Family (3h)", hours: 3, priceUsd: 300 },
} as const

type ServiceKey = keyof typeof BOOKING_SERVICES

const DEPOSIT_RATE = 0.6 // 60% non-refundable deposit, paid later via pay link

const BookingRequestSchema = z.object({
  serviceKey: z.enum([
    "wedding4",
    "wedding8",
    "engagement4",
    "engagement5",
    "maternity2",
    "portrait2",
    "family3",
  ]),
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(254),
  phone: z.string().min(7, "Phone number is required").max(20, "Phone number too long").trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time"),
  location: z.string().min(1, "Location is required").max(200, "Location too long").trim(),
  details: z
    .string()
    .min(10, "Please tell us a little more about your shoot (at least 10 characters)")
    .max(2000, "Details too long")
    .trim(),
  // Honeypot: the real form renders this field hidden. Humans never fill
  // it; bots do. A filled value means spam — drop it silently (return
  // the normal success response so the bot cannot tell it was caught).
  company: z.string().max(100).optional(),
})

function makeBookingRef(): string {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "")
  const rand = crypto.randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase()
  return `KS-${day}-${rand}`
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Shared rate limit: 5 requests/min/IP (Upstash when configured,
  // in-memory fallback otherwise).
  if (!(await checkRateLimit(`booking-request:${ip}`, 5, 60))) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { ...corsHeaders, "Retry-After": "60" } }
    )
  }

  try {
    const body = await request.json()
    const parsed = BookingRequestSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid request"
      return NextResponse.json(
        { error: firstError },
        { status: 400, headers: corsHeaders }
      )
    }

    const { serviceKey, name, email, phone, date, time, location, details, company } =
      parsed.data

    // Honeypot filled: spam bot. Log it and return the normal success
    // response without storing or sending anything.
    if (company && company.trim() !== "") {
      console.warn("🍯 Booking honeypot triggered — dropping submission", { ip })
      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your booking request was received.",
          bookingRef: makeBookingRef(),
        },
        { headers: corsHeaders }
      )
    }

    const service = BOOKING_SERVICES[serviceKey as ServiceKey]
    const fullPriceUsd = service.priceUsd
    const depositUsd = Math.round(fullPriceUsd * DEPOSIT_RATE)
    const dateIso = `${date}T${time}`
    const bookingRef = makeBookingRef()

    // Best-effort record: if Supabase is not configured (or the table
    // does not exist yet), log and continue — the emails below are the
    // reliable record of the request.
    let supabase
    try {
      supabase = createSupabaseServerClient()
    } catch {
      console.error("❌ Supabase not configured — skipping booking_requests insert")
    }

    if (supabase) {
      const { error: dbError } = await supabase.from("booking_requests").insert({
        booking_ref: bookingRef,
        name,
        email,
        phone,
        service_key: serviceKey,
        service_label: service.label,
        date_iso: dateIso,
        location,
        details,
        full_price_cents: fullPriceUsd * 100,
        deposit_cents: depositUsd * 100,
        status: "new",
      })
      if (dbError) {
        console.error("❌ Booking request DB insert error:", dbError.message)
      }
    }

    // Step 2 of the flow: (a) immediate confirmation to the customer,
    // (b) full details to Dany so he can send the estimate + pay link.
    // No payment is taken here — neither email contains a charge.
    const [confirmResult, notifyResult] = await Promise.allSettled([
      sendBookingRequestConfirmation({
        bookingRef,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        service: service.label,
        dateIso,
        location,
        details,
        fullAmountUsd: fullPriceUsd,
        depositAmountUsd: depositUsd,
      }),
      sendBookingRequestNotification({
        bookingRef,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        service: service.label,
        dateIso,
        location,
        details,
        fullAmountUsd: fullPriceUsd,
        depositAmountUsd: depositUsd,
      }),
    ])

    if (confirmResult.status === "rejected") {
      console.error("❌ Booking request confirmation email failed:", confirmResult.reason)
    } else if (!confirmResult.value.success) {
      console.error("❌ Booking request confirmation email error:", confirmResult.value.error)
    }
    if (notifyResult.status === "rejected") {
      console.error("❌ Booking request admin notification failed:", notifyResult.reason)
    } else if (!notifyResult.value.success) {
      console.error("❌ Booking request admin notification error:", notifyResult.value.error)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your booking request was received.",
        bookingRef,
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("❌ Booking request error:", error)
    return NextResponse.json(
      { error: "Failed to send your booking request. Please try again later." },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}
