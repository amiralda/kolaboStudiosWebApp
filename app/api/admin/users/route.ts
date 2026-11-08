import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { checkAdminAccess } from "@/lib/auth/admin-access"
import {
  buildSetupUrl,
  inviteAdminUser,
  listAdminUsers,
} from "@/lib/auth/admin-users"
import { sendAdminSetupEmail } from "@/lib/email/resend-client"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Admin accounts management (add more Kolabo staff later).
 *
 * GET  /api/admin/users -> list accounts (safe fields only).
 * POST /api/admin/users { email } -> create/re-invite the account and
 *      email them a setup link so they set their own password.
 *
 * Both require admin access (Basic Auth OR a valid session) — checked
 * here as well as in the middleware, because this endpoint creates
 * accounts.
 */
const InviteSchema = z.object({
  email: z.string().email("Enter a valid email address."),
})

export async function GET(request: NextRequest) {
  const access = await checkAdminAccess(request)
  if (!access.ok) {
    return NextResponse.json(
      { error: "Admin sign-in required." },
      { status: access.status }
    )
  }
  try {
    const users = await listAdminUsers()
    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        hasPassword: Boolean(u.password_hash),
        setupPending: Boolean(u.setup_token_hash),
        createdAt: u.created_at,
        lastLoginAt: u.last_login_at,
      })),
    })
  } catch {
    return NextResponse.json(
      { error: "Admin accounts are not set up on this server yet." },
      { status: 503 }
    )
  }
}

export async function POST(request: NextRequest) {
  const access = await checkAdminAccess(request)
  if (!access.ok) {
    return NextResponse.json(
      { error: "Admin sign-in required." },
      { status: access.status }
    )
  }

  const ip = getClientIp(request)
  if (!(await checkRateLimit(`admin-invite:${ip}`, 10, 60))) {
    return NextResponse.json(
      { error: "Too many invites. Try again in a minute." },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const parsed = InviteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      )
    }

    let invited
    try {
      invited = await inviteAdminUser(parsed.data.email)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create the account."
      const status = message.includes("already has an admin account") ? 409 : 503
      return NextResponse.json({ error: message }, { status })
    }

    const emailResult = await sendAdminSetupEmail({
      email: invited.user.email,
      setupUrl: buildSetupUrl(invited.user.email, invited.setupToken),
    })
    if (!emailResult.success) {
      return NextResponse.json(
        {
          error:
            "Account created, but the setup email could not be sent. Send the invite again once email is working.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, email: invited.user.email })
  } catch (error) {
    console.error("❌ Admin invite error:", error)
    return NextResponse.json(
      { error: "Could not send the invite. Please try again." },
      { status: 500 }
    )
  }
}
