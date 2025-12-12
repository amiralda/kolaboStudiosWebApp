export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // do not prerender this route

import { type NextRequest, NextResponse } from "next/server"
import { listFiles } from "@/lib/storage/vercel-blob"

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
