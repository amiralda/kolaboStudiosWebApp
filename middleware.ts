import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkAdminAuth } from "@/lib/auth/admin-auth"
import { getSessionFromHeaders } from "@/lib/auth/session"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

/**
 * Protect all /admin/* pages and /api/admin/* API routes.
 *
 * Two ways in (either one passes):
 *   1. HTTP Basic Auth against ADMIN_SECRET (the original admin auth —
 *      kept as a fallback; any username accepted, password checked).
 *   2. A per-user session cookie from /admin/login (the account system,
 *      Dany 2026-11-08 — each admin signs in with their own email +
 *      password; the cookie is an HMAC-signed token, verified here
 *      without a database hit).
 *
 * Public (no auth): the login page, the setup page, and the login /
 * setup / logout API routes — otherwise nobody could ever sign in.
 *
 * FAILS CLOSED: without a valid Basic Auth or session, admin pages
 * redirect to /admin/login and admin APIs answer 401. The login page
 * and login API explain when the account system itself is not
 * configured yet (no database / no session secret).
 *
 * Optional hardening env vars:
 *   ADMIN_IP_ALLOWLIST — comma-separated client IPs allowed into /admin.
 *     When set, any other IP gets 403. Leave unset to allow any IP.
 *   ADMIN_SESSION_SECRET — HMAC secret for session cookies. Falls back
 *     to ADMIN_SECRET when unset. Rotate it to sign everyone out.
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — shared store for
 *     the failed-login rate limit. Without them the limit is in-memory
 *     (best-effort on serverless). Alternatively use Vercel WAF rules.
 *
 * Failed Basic Auth guesses are rate limited: 10 failed attempts per
 * IP per 15 minutes, then 429. (Session sign-ins are rate limited in
 * the login API itself.)
 */
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/setup",
  "/api/admin/login",
  "/api/admin/setup",
  "/api/admin/logout",
])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin")

  if (!isAdminRoute) return NextResponse.next()

  // The login / setup flow must be reachable without any credentials.
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next()

  // Optional IP allowlist (exact matches, comma-separated)
  const allowlist = process.env.ADMIN_IP_ALLOWLIST
  if (allowlist) {
    const ip = getClientIp(request)
    const allowed = allowlist
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    if (!allowed.includes(ip)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  // Way in #1: the original Basic Auth (kept as a fallback).
  const auth = checkAdminAuth(request)
  if (auth.ok) return NextResponse.next()

  // Way in #2: a valid per-user session cookie.
  const session = await getSessionFromHeaders(request.headers)
  if (session) return NextResponse.next()

  // A presented Basic Auth that failed is a guessing attempt: slow it.
  if (request.headers.has("authorization")) {
    const ip = getClientIp(request)
    const allowed = await checkRateLimit(`admin-fail:${ip}`, 10, 15 * 60)
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Try again later." },
        { status: 429, headers: { "Retry-After": "900" } }
      )
    }
  }

  // Not signed in: pages go to the login page, APIs get a 401.
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { error: "Admin sign-in required." },
      { status: 401 }
    )
  }
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = "/admin/login"
  loginUrl.search = ""
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
