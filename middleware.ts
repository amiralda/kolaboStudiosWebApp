import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkAdminAuth, adminUnauthorizedResponse } from "@/lib/auth/admin-auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

/**
 * Protect all /admin/* pages and /api/admin/* API routes with HTTP Basic Auth.
 *
 * Required env var:
 *   ADMIN_SECRET — the password for the admin area (any username accepted).
 *
 * Set it in Vercel → Settings → Environment Variables (production + preview).
 * Locally, add to .env.local:
 *   ADMIN_SECRET=your-strong-secret-here
 *
 * Optional hardening env vars:
 *   ADMIN_IP_ALLOWLIST — comma-separated client IPs allowed into /admin.
 *     When set, any other IP gets 403. Leave unset to allow any IP.
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — shared store for
 *     the failed-login rate limit. Without them the limit is in-memory
 *     (best-effort on serverless). Alternatively use Vercel WAF rules.
 *
 * Failed logins are rate limited: 10 failed attempts per IP per 15
 * minutes, then 429. When ADMIN_SECRET is not configured, the admin
 * area is locked entirely (503) — fail closed.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin")

  if (!isAdminRoute) return NextResponse.next()

  const adminSecret = process.env.ADMIN_SECRET

  // If no secret is configured, lock the admin area entirely
  if (!adminSecret) {
    return NextResponse.json(
      { error: "Admin access is not configured on this server." },
      { status: 503 }
    )
  }

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

  const auth = checkAdminAuth(request)
  if (auth.ok) return NextResponse.next()

  // Failed login: rate-limit guessing (10 failed attempts / 15 min / IP)
  const ip = getClientIp(request)
  const allowed = await checkRateLimit(`admin-fail:${ip}`, 10, 15 * 60)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many failed login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": "900" } }
    )
  }

  // Prompt the browser to show a native login dialog
  return adminUnauthorizedResponse()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
