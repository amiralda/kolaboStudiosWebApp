import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth/session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Sign the admin out: clears the session cookie. */
export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return res
}
