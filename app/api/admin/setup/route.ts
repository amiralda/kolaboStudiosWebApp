import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  completeAdminSetup,
  findAdminUserByEmail,
  isSetupTokenValid,
} from "@/lib/auth/admin-users"
import { hashPassword } from "@/lib/auth/passwords"
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  getSessionSecret,
  signSessionToken,
} from "@/lib/auth/session"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Admin account setup — the admin sets their own password through the
 * link emailed to them (48-hour token). Public routes (exempt from the
 * middleware Basic Auth), rate limited.
 *
 * GET  /api/admin/setup?token=...&email=... -> { valid: true|false }
 * POST /api/admin/setup { email, token, password, confirmPassword }
 *      -> sets the password, clears the token, signs the admin in.
 */
const SetupSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    token: z.string().min(1, "Setup link is missing its token."),
    password: z.string().min(12, "Password must be at least 12 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email") ?? ""
    const token = request.nextUrl.searchParams.get("token") ?? ""
    if (!email || !token) {
      return NextResponse.json({ valid: false, error: "This setup link is incomplete." })
    }
    let user
    try {
      user = await findAdminUserByEmail(email)
    } catch {
      return NextResponse.json({
        valid: false,
        error: "Admin accounts are not set up on this server yet.",
      })
    }
    if (!user || !isSetupTokenValid(user, token)) {
      return NextResponse.json({
        valid: false,
        error: "This setup link is invalid or has expired. Ask another admin to send you a new invite.",
      })
    }
    return NextResponse.json({ valid: true, email: user.email })
  } catch (error) {
    console.error("❌ Admin setup check error:", error)
    return NextResponse.json({ valid: false, error: "Could not check this setup link." })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (!(await checkRateLimit(`admin-setup:${ip}`, 10, 15 * 60))) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } }
      )
    }

    const body = await request.json()
    const parsed = SetupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      )
    }

    const secret = getSessionSecret()
    if (!secret) {
      return NextResponse.json(
        { error: "Admin sign-in is not configured on this server yet." },
        { status: 503 }
      )
    }

    let user
    try {
      user = await findAdminUserByEmail(parsed.data.email)
    } catch {
      return NextResponse.json(
        { error: "Admin accounts are not set up on this server yet." },
        { status: 503 }
      )
    }
    if (!user || !isSetupTokenValid(user, parsed.data.token)) {
      return NextResponse.json(
        { error: "This setup link is invalid or has expired. Ask another admin to send you a new invite." },
        { status: 400 }
      )
    }

    await completeAdminSetup(user, hashPassword(parsed.data.password))

    const token = await signSessionToken(
      { id: user.id, email: user.email },
      secret
    )
    const res = NextResponse.json({ success: true, email: user.email })
    res.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    })
    return res
  } catch (error) {
    console.error("❌ Admin setup error:", error)
    return NextResponse.json(
      { error: "Could not set your password. Please try again." },
      { status: 500 }
    )
  }
}
