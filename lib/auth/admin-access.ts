/**
 * Combined admin access check for API route handlers.
 *
 * A request is an admin when EITHER passes:
 *   1. HTTP Basic Auth against ADMIN_SECRET (the original admin auth —
 *      kept as a fallback, exactly as before), or
 *   2. a valid per-user session cookie (the new account system).
 *
 * FAILS CLOSED: when neither mechanism is configured, every check
 * returns ok:false with status 503.
 *
 * NOTE: /api/upload and /api/files keep their own direct checkAdminAuth
 * calls (security-fix area, commit 4063b33 — not touched here). A
 * session-only login therefore cannot use gallery upload/files until
 * those two routes are taught to accept sessions; the bookings,
 * estimate, booking-status and users APIs all go through the middleware
 * + this check and work with either mechanism.
 */
import { checkAdminAuth } from "@/lib/auth/admin-auth"
import { getSessionFromHeaders } from "@/lib/auth/session"

export type AdminAccessResult =
  | { ok: true; via: "basic" | "session"; email?: string; userId?: string }
  | { ok: false; status: 503 | 401; reason: "not-configured" | "unauthorized" }

export async function checkAdminAccess(request: {
  headers: Headers
}): Promise<AdminAccessResult> {
  const basic = checkAdminAuth(request)
  if (basic.ok) return { ok: true, via: "basic" }

  const session = await getSessionFromHeaders(request.headers)
  if (session) {
    return { ok: true, via: "session", email: session.email, userId: session.sub }
  }

  const basicConfigured = basic.reason !== "not-configured"
  const sessionConfigured = Boolean(
    process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SECRET
  )
  if (!basicConfigured && !sessionConfigured) {
    return { ok: false, status: 503, reason: "not-configured" }
  }
  return { ok: false, status: 401, reason: "unauthorized" }
}
