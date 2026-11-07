/**
 * Admin Basic Auth check, shared by middleware and API routes.
 *
 * The password is ADMIN_SECRET (Vercel env var). Any username is
 * accepted; only the password is checked, matching the existing
 * middleware behaviour.
 *
 * FAILS CLOSED: when ADMIN_SECRET is not configured, every check
 * returns ok:false with status 503, so protected areas stay locked
 * instead of silently opening up.
 *
 * Edge-compatible (uses atob and a manual constant-time compare), so
 * middleware.ts can import it.
 */

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; status: 503 | 401; reason: "not-configured" | "unauthorized" }

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export function checkAdminAuth(request: { headers: Headers }): AdminAuthResult {
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    return { ok: false, status: 503, reason: "not-configured" }
  }

  const authHeader = request.headers.get("authorization") ?? ""

  if (authHeader.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6))
      // Format is "username:password" — we only check the password.
      const password = decoded.slice(decoded.indexOf(":") + 1)
      if (timingSafeEqual(password, adminSecret)) {
        return { ok: true }
      }
    } catch {
      // Invalid base64 — fall through to unauthorized.
    }
  }

  return { ok: false, status: 401, reason: "unauthorized" }
}

/** Build the 401 response browsers understand (native login dialog). */
export function adminUnauthorizedResponse(): Response {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Kolabo Admin", charset="UTF-8"',
    },
  })
}
