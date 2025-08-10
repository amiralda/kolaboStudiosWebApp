import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, serviceType } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Log the contact form submission
    console.log("📧 Contact form submission:", {
      name,
      email,
      phone,
      message: message.substring(0, 100) + "...",
      serviceType,
      timestamp: new Date().toISOString(),
    })

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM system

    // For now, we'll just simulate success
    const adminEmail = process.env.ADMIN_EMAIL

    if (adminEmail) {
      console.log(`✅ Contact form would be sent to: ${adminEmail}`)
    } else {
      console.log("⚠️ No ADMIN_EMAIL configured - contact form logged only")
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

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
