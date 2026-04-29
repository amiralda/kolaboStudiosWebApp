import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@kolabostudios.com"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

interface ContactEmailData {
  name: string
  email: string
  phone?: string
  message: string
  serviceInterest?: string
}

interface OrderConfirmationData {
  customerEmail: string
  customerName: string
  orderId: string
  serviceType: string
  totalAmount: number
}

interface BookingConfirmationData {
  customerEmail: string
  customerName: string
  service: string
  dateIso?: string
  location?: string
  depositAmountUsd: number
  fullAmountUsd: number
  sessionId: string
}

export async function sendContactEmail(data: ContactEmailData) {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("📧 Contact email would be sent:", data)
      console.log("⚠️ No RESEND_API_KEY found - email skipped")
      return { success: true, message: "Email skipped - no API key configured" }
    }

    const name = escapeHtml(data.name)
    const email = escapeHtml(data.email)
    const phone = data.phone ? escapeHtml(data.phone) : null
    const service = data.serviceInterest ? escapeHtml(data.serviceInterest) : null
    const message = escapeHtml(data.message)

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <noreply@kolabostudios.com>",
      to: [ADMIN_EMAIL],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #00C6AE; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ""}
            ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ""}
          </div>
          <div style="background: white; padding: 20px; border-left: 4px solid #00C6AE; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; text-align: center;">
            This email was sent from the Kolabo Studios contact form<br>
            <a href="https://kolabostudios.com">kolabostudios.com</a>
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Resend API error:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Contact notification email sent successfully")
    return { success: true, data: emailData }
  } catch (error) {
    console.error("❌ Email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendContactConfirmation(data: ContactEmailData) {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("📧 Confirmation email would be sent to:", data.email)
      console.log("⚠️ No RESEND_API_KEY found - email skipped")
      return { success: true, message: "Email skipped - no API key configured" }
    }

    const name = escapeHtml(data.name)
    const message = escapeHtml(data.message)

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <hello@kolabostudios.com>",
      to: [data.email],
      subject: "Thank you for contacting Kolabo Studios",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00C6AE; margin: 0;">Kolabo Studios</h1>
            <p style="color: #666; margin: 5px 0;">Professional Photography &amp; Retouching</p>
          </div>
          <h2 style="color: #333;">Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for contacting Kolabo Studios. We've received your message and will get back to you within 24 hours.</p>
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Message:</h3>
            <p style="font-style: italic; color: #555; white-space: pre-wrap;">"${message}"</p>
          </div>
          <p>In the meantime, feel free to:</p>
          <ul style="line-height: 1.8;">
            <li><a href="https://kolabostudios.com/galleries" style="color: #00C6AE;">Browse our portfolio</a></li>
            <li><a href="https://kolabostudios.com/retouch-services" style="color: #00C6AE;">Learn about our retouching services</a></li>
            <li><a href="https://kolabostudios.com/about" style="color: #00C6AE;">Read more about our story</a></li>
          </ul>
          <p>Best regards,<br><strong>The Kolabo Studios Team</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Kolabo Studios<br>Professional Photography &amp; Retouching<br>
            <a href="https://kolabostudios.com" style="color: #00C6AE;">kolabostudios.com</a></p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Confirmation email error:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Confirmation email sent successfully")
    return { success: true, data: emailData }
  } catch (error) {
    console.error("❌ Confirmation email service error:", error)
    return { success: false, error: "Failed to send confirmation email" }
  }
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("📧 Booking confirmation would be sent to:", data.customerEmail)
      console.log("⚠️ No RESEND_API_KEY found - email skipped")
      return { success: true, message: "Email skipped - no API key configured" }
    }

    const name = escapeHtml(data.customerName)
    const service = escapeHtml(data.service)
    const location = data.location ? escapeHtml(data.location) : null

    let formattedDate = ""
    if (data.dateIso) {
      try {
        formattedDate = new Date(data.dateIso).toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      } catch {
        formattedDate = data.dateIso
      }
    }

    const remaining = data.fullAmountUsd - data.depositAmountUsd

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <hello@kolabostudios.com>",
      to: [data.customerEmail],
      subject: `Booking Confirmed — ${service} Session | Kolabo Studios`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00C6AE; margin: 0;">Kolabo Studios</h1>
            <p style="color: #666; margin: 5px 0;">Professional Photography</p>
          </div>

          <div style="background: #e8f8f6; border: 2px solid #00C6AE; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <div style="font-size: 40px; margin-bottom: 8px;">🎉</div>
            <h2 style="color: #00776a; margin: 0 0 6px;">Your Booking is Confirmed!</h2>
            <p style="color: #555; margin: 0;">We can't wait to work with you.</p>
          </div>

          <p>Hi ${name},</p>
          <p>Your deposit has been received and your <strong>${service}</strong> session is officially on the books. Here are your booking details:</p>

          <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 40%;"><strong>Service</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${service}</td>
              </tr>
              ${formattedDate ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Date &amp; Time</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formattedDate}</td>
              </tr>` : ""}
              ${location ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Location</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${location}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Deposit Paid</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #00C6AE; font-weight: bold;">${formatUSD(data.depositAmountUsd)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Remaining Balance</strong></td>
                <td style="padding: 10px 0;">${formatUSD(remaining)} <span style="color: #999; font-size: 13px;">(due at session)</span></td>
              </tr>
            </table>
          </div>

          <div style="background: #fff8e1; border-left: 4px solid #f6c026; border-radius: 4px; padding: 16px; margin: 20px 0;">
            <strong>What happens next?</strong>
            <ol style="margin: 8px 0 0; padding-left: 20px; line-height: 1.8;">
              <li>We'll send you a detailed questionnaire within 48 hours</li>
              <li>We'll confirm the exact shoot location and logistics closer to your date</li>
              <li>Remaining balance (${formatUSD(remaining)}) is due on or before your session day</li>
            </ol>
          </div>

          <p>Questions? Just reply to this email or reach out through <a href="https://kolabostudios.com/contact" style="color: #00C6AE;">kolabostudios.com/contact</a>.</p>

          <p>We're so excited to capture these memories with you!<br>
          <strong>The Kolabo Studios Team</strong></p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Booking ref: ${escapeHtml(data.sessionId)}<br>
            <a href="https://kolabostudios.com" style="color: #00C6AE;">kolabostudios.com</a>
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Booking confirmation email error:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Booking confirmation sent to", data.customerEmail)
    return { success: true, data: emailData }
  } catch (error) {
    console.error("❌ Booking confirmation email service error:", error)
    return { success: false, error: "Failed to send booking confirmation" }
  }
}

export async function sendBookingAdminNotificationEmail(data: BookingConfirmationData) {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("📧 Admin booking notification would be sent")
      return { success: true, message: "Email skipped - no API key configured" }
    }

    const name = escapeHtml(data.customerName)
    const service = escapeHtml(data.service)
    const location = data.location ? escapeHtml(data.location) : "Not specified"

    let formattedDate = "Not specified"
    if (data.dateIso) {
      try {
        formattedDate = new Date(data.dateIso).toLocaleString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit",
        })
      } catch {
        formattedDate = data.dateIso
      }
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <noreply@kolabostudios.com>",
      to: [ADMIN_EMAIL],
      subject: `💰 New Booking: ${service} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00C6AE; border-bottom: 2px solid #00C6AE; padding-bottom: 10px;">
            New Booking Received
          </h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; width: 40%;"><strong>Customer</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(data.customerEmail)}">${escapeHtml(data.customerEmail)}</a></td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Service</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${service}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Date</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formattedDate}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Location</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${location}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Deposit Paid</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #00C6AE; font-weight: bold;">${formatUSD(data.depositAmountUsd)}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Full Package</strong></td><td style="padding: 8px 0;">${formatUSD(data.fullAmountUsd)}</td></tr>
            </table>
          </div>
          <p style="color: #666; font-size: 13px;">Stripe session: <code>${escapeHtml(data.sessionId)}</code></p>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Admin notification email error:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Admin booking notification sent")
    return { success: true, data: emailData }
  } catch (error) {
    console.error("❌ Admin notification email service error:", error)
    return { success: false, error: "Failed to send admin notification" }
  }
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("📧 Order confirmation would be sent to:", data.customerEmail)
      console.log("⚠️ No RESEND_API_KEY found - email skipped")
      return { success: true, message: "Email skipped - no API key configured" }
    }

    const name = escapeHtml(data.customerName)
    const orderId = escapeHtml(data.orderId)
    const serviceType = escapeHtml(data.serviceType)

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <orders@kolabostudios.com>",
      to: [data.customerEmail],
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00C6AE; margin: 0;">Kolabo Studios</h1>
            <p style="color: #666; margin: 5px 0;">Order Confirmation</p>
          </div>
          <h2 style="color: #333;">Thank you for your order!</h2>
          <p>Hi ${name},</p>
          <p>We've received your order and payment has been processed successfully. We'll begin working on your photos shortly.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${serviceType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px 0; font-size: 18px; color: #00C6AE;"><strong>${formatUSD(data.totalAmount)}</strong></td>
              </tr>
            </table>
          </div>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d5a2d;">What's Next?</h3>
            <ol style="line-height: 1.8; color: #2d5a2d;">
              <li>You'll receive upload instructions within the next hour</li>
              <li>Upload your photos using our secure transfer system</li>
              <li>We'll begin processing your order within 24 hours</li>
              <li>Receive your edited photos within 3–5 business days</li>
            </ol>
          </div>
          <p>Best regards,<br><strong>The Kolabo Studios Team</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Kolabo Studios<br>Professional Photography &amp; Retouching<br>
            <a href="https://kolabostudios.com" style="color: #00C6AE;">kolabostudios.com</a></p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Order confirmation email error:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Order confirmation email sent successfully")
    return { success: true, data: emailData }
  } catch (error) {
    console.error("❌ Order confirmation email service error:", error)
    return { success: false, error: "Failed to send order confirmation email" }
  }
}
