import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/database/supabase"
import { sendContactEmail, sendContactConfirmation } from "@/lib/email/resend-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, serviceType } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()
    await supabase.from('contact_inquiries').insert({
      name,
      email,
      phone,
      shoot_type: serviceType,
      message,
      source: 'website_footer',
      status: 'new',
    })

    await sendContactEmail({
      name,
      email,
      phone,
      message,
      serviceInterest: serviceType,
    })

    await sendContactConfirmation({
      name,
      email,
      phone,
      message,
      serviceInterest: serviceType,
    })

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    })
  } catch (error) {
    console.error("❌ Contact form error:", error)

    return NextResponse.json(
      {
        error: "Failed to send message. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
