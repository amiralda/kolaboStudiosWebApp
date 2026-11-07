import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/database/supabase"
import { sendContactEmail, sendContactConfirmation } from "@/lib/email/resend-client"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const ALLOWED_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kolabostudios.com"

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const ContactRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(254),
  phone: z.string().max(20, "Phone number too long").trim().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long").trim(),
  serviceType: z.string().max(50).trim().optional(),
  // Honeypot: the real form renders this field hidden. Humans never fill
  // it; bots do. A filled value means spam — drop it silently (return
  // the normal success response so the bot cannot tell it was caught).
  company: z.string().max(100).optional(),
})

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Shared rate limit: 5 requests/min/IP (Upstash when configured,
  // in-memory fallback otherwise).
  if (!(await checkRateLimit(`contact:${ip}`, 5, 60))) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { ...corsHeaders, "Retry-After": "60" } }
    )
  }

  try {
    const body = await request.json()
    const parsed = ContactRequestSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid request"
      return NextResponse.json(
        { error: firstError },
        { status: 400, headers: corsHeaders }
      )
    }

    const { name, email, phone, message, serviceType, company } = parsed.data

    // Honeypot filled: spam bot. Log it and return the normal success
    // response without storing or sending anything.
    if (company && company.trim() !== "") {
      console.warn("🍯 Contact honeypot triggered — dropping submission", { ip })
      return NextResponse.json(
        { success: true, message: "Thank you for your message! We'll get back to you soon." },
        { headers: corsHeaders }
      )
    }

    let supabase
    try {
      supabase = createSupabaseServerClient()
    } catch {
      console.error("❌ Supabase not configured — skipping DB insert")
    }

    if (supabase) {
      const { error: dbError } = await supabase.from("contact_inquiries").insert({
        name,
        email,
        phone: phone ?? null,
        shoot_type: serviceType ?? null,
        message,
        source: "website_footer",
        status: "new",
      })
      if (dbError) {
        console.error("❌ Contact DB insert error:", dbError.message)
      }
    }

    // Send emails in parallel; don't let email failure block the response
    const [notifyResult, confirmResult] = await Promise.allSettled([
      sendContactEmail({ name, email, phone, message, serviceInterest: serviceType }),
      sendContactConfirmation({ name, email, phone, message, serviceInterest: serviceType }),
    ])

    if (notifyResult.status === "rejected") {
      console.error("❌ Admin notify email failed:", notifyResult.reason)
    }
    if (confirmResult.status === "rejected") {
      console.error("❌ Customer confirm email failed:", confirmResult.reason)
    }

    return NextResponse.json(
      { success: true, message: "Thank you for your message! We'll get back to you soon." },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("❌ Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}
