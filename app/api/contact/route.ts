import { type NextRequest, NextResponse } from "next/server"
import { sendContactEmail, sendContactConfirmation } from "@/lib/email/resend-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, serviceType } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    let supabase
    try {
      const { createSupabaseServerClient } = await import('@/lib/database/supabase')
      supabase = createSupabaseServerClient()
    } catch (supabaseError) {
      const detail = supabaseError instanceof Error ? supabaseError.message : 'Supabase not configured'
      console.error('❌ Contact form configuration error:', detail)
      return NextResponse.json(
        { error: "Contact service is not configured. Please try again later." },
        { status: 500 },
      )
    }
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
    const detail = error instanceof Error ? error.message : undefined

    return NextResponse.json(
      {
        error: "Failed to send message. Please try again later.",
        details: process.env.NODE_ENV === "development" ? detail : undefined,
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
