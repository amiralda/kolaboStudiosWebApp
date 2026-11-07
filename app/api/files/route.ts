export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // do not prerender this route

import { type NextRequest, NextResponse } from "next/server"
import { listFiles } from "@/lib/storage/vercel-blob"
import { checkAdminAuth } from "@/lib/auth/admin-auth"

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL

function ensureSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (origin && ALLOWED_ORIGIN && !origin.startsWith(ALLOWED_ORIGIN)) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 })
  }
  return null
}

function withCors(response: NextResponse) {
  if (ALLOWED_ORIGIN) {
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
    response.headers.set("Vary", "Origin")
  }
  return response
}

export async function GET(request: NextRequest) {
  try {
    const originCheck = ensureSameOrigin(request)
    if (originCheck) return originCheck

    // File listing is admin-only: it exposes every file in Vercel Blob,
    // including clients' private retouch uploads. Fails closed (503)
    // when ADMIN_SECRET is not configured. The admin gallery manager
    // runs in an admin-authenticated browser session, so its fetches
    // carry the Basic Auth header automatically.
    const auth = checkAdminAuth(request)
    if (!auth.ok) {
      if (auth.status === 503) {
        return withCors(
          NextResponse.json(
            { error: "Admin access is not configured on this server." },
            { status: 503 }
          )
        )
      }
      return withCors(
        NextResponse.json(
          { error: "Admin authentication required." },
          {
            status: 401,
            headers: {
              "WWW-Authenticate": 'Basic realm="Kolabo Admin", charset="UTF-8"',
            },
          }
        )
      )
    }

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get("folder") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    console.log("📋 Listing files:", { folder, limit })

    const result = await listFiles(folder, limit)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to list files" }, { status: 500 })
    }

    return withCors(NextResponse.json({
      success: true,
      files: result.files,
      folder,
      count: result.files.length,
    }))
  } catch (error) {
    console.error("❌ File listing error:", error)
    const detail = error instanceof Error ? error.message : undefined

    return withCors(
      NextResponse.json(
        {
          error: "Failed to list files. Please try again later.",
          details: process.env.NODE_ENV === "development" ? detail : undefined,
        },
        { status: 500 },
      ),
    )
  }
}
