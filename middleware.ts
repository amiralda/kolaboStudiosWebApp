import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Protect all /admin/* pages and /api/admin/* API routes with HTTP Basic Auth.
 *
 * Required env var:
 *   ADMIN_SECRET — the password for the admin area (any username accepted).
 *
 * Set it in Vercel → Settings → Environment Variables (production + preview).
 * Locally, add to .env.local:
 *   ADMIN_SECRET=your-strong-secret-here
 */
export function middleware(request: NextRequest) {
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

  const authHeader = request.headers.get("authorization") ?? ""

  if (authHeader.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6))
      // Format is "username:password" — we only check the password
      const password = decoded.slice(decoded.indexOf(":") + 1)
      if (password === adminSecret) {
        return NextResponse.next()
      }
    } catch {
      // Invalid base64 — fall through to 401
    }
  }

  // Prompt the browser to show a native login dialog
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Kolabo Admin", charset="UTF-8"',
    },
  })
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
