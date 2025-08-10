import { Resend } from "resend"

// Initialize Resend with proper error handling
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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

export async function sendContactEmail(data: ContactEmailData) {
  try {
    // If no Resend API key, just log and return success (for development)
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("📧 Contact email would be sent:", data)
      console.log("⚠️ No RESEND_API_KEY found - email skipped")
      return { success: true, message: "Email skipped - no API key configured" }
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <noreply@kolabostudios.com>",
      to: [process.env.ADMIN_EMAIL || "hello@kolabostudios.com"],
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #00C6AE; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ""}
            ${data.serviceInterest ? `<p><strong>Service Interest:</strong> ${data.serviceInterest}</p>` : ""}
          </div>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #00C6AE; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="line-height: 1.6;">${data.message}</p>
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

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <hello@kolabostudios.com>",
      to: [data.email],
      subject: "Thank you for contacting Kolabo Studios",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00C6AE; margin: 0;">Kolabo Studios</h1>
            <p style="color: #666; margin: 5px 0;">Professional Photography & Retouching</p>
          </div>
          
          <h2 style="color: #333;">Thank you for reaching out!</h2>
          <p>Hi ${data.name},</p>
          
          <p>Thank you for contacting Kolabo Studios. We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Message:</h3>
            <p style="font-style: italic; color: #555;">"${data.message}"</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul style="line-height: 1.8;">
            <li><a href="https://kolabostudios.com/galleries" style="color: #00C6AE;">Browse our portfolio</a></li>
            <li><a href="https://kolabostudios.com/retouch-services" style="color: #00C6AE;">Learn about our retouching services</a></li>
            <li><a href="https://kolabostudios.com/about" style="color: #00C6AE;">Read more about our story</a></li>
          </ul>
          
          <p>Best regards,<br>
          <strong>The Kolabo Studios Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Kolabo Studios<br>
            Professional Photography & Retouching<br>
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

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("📧 Order confirmation would be sent to:", data.customerEmail)
      console.log("⚠️ No RESEND_API_KEY found - email skipped")
      return { success: true, message: "Email skipped - no API key configured" }
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Kolabo Studios <orders@kolabostudios.com>",
      to: [data.customerEmail],
      subject: `Order Confirmation - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00C6AE; margin: 0;">Kolabo Studios</h1>
            <p style="color: #666; margin: 5px 0;">Order Confirmation</p>
          </div>
          
          <h2 style="color: #333;">Thank you for your order!</h2>
          <p>Hi ${data.customerName},</p>
          
          <p>We've received your order and payment has been processed successfully. We'll begin working on your photos shortly.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.serviceType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px 0; font-size: 18px; color: #00C6AE;"><strong>$${data.totalAmount.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d5a2d;">What's Next?</h3>
            <ol style="line-height: 1.8; color: #2d5a2d;">
              <li>You'll receive upload instructions within the next hour</li>
              <li>Upload your photos using our secure transfer system</li>
              <li>We'll begin processing your order within 24 hours</li>
              <li>Receive your edited photos within 3-5 business days</li>
            </ol>
          </div>
          
          <p>If you have any questions or need to make changes to your order, please contact us immediately.</p>
          
          <p>Best regards,<br>
          <strong>The Kolabo Studios Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Kolabo Studios<br>
            Professional Photography & Retouching<br>
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
