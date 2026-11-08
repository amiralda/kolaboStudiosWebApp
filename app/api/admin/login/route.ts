import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { findAdminUserByEmail, touchAdminLogin } from "@/lib/auth/admin-users"
import { verifyPassword } from "@/lib/auth/passwords"
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
 * Per-user admin sign-in (Dany, 2026-11-08).
 *
 * POST { email, password } -> sets the httpOnly session cookie.
 * Public route (exempt from the middleware Basic Auth) but rate
 * limited: 10 attempts per IP per 15 minutes, then 429.
 * Fails closed with 503 when the account system is not configured
 * (no Supabase, or no session secret).
 */
const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
})

const WRONG = "Email or password is incorrect."

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (!(await checkRateLimit(`admin-login:${ip}`, 10, 15 * 60))) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } }
      )
    }

    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)
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
        { error: "Admin sign-in is not configured on this server yet." },
        { status: 503 }
      )
    }

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: WRONG }, { status: 401 })
    }
    if (!verifyPassword(parsed.data.password, user.password_hash)) {
      return NextResponse.json({ error: WRONG }, { status: 401 })
    }

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
    await touchAdminLogin(user.id)
    return res
  } catch (error) {
    console.error("❌ Admin login error:", error)
    return NextResponse.json(
      { error: "Sign-in failed. Please try again." },
      { status: 500 }
    )
  }
}
