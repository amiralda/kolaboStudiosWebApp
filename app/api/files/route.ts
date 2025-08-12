export const dynamic = 'force-dynamic'
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // do not prerender this route

import { type NextRequest, NextResponse } from "next/server"
import { listFiles } from "@/lib/storage/vercel-blob"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get("folder") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    console.log("📋 Listing files:", { folder, limit })

    const result = await listFiles(folder, limit)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to list files" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      files: result.files,
      folder,
      count: result.files.length,
    })
  } catch (error) {
    console.error("❌ File listing error:", error)

    return NextResponse.json(
      {
        error: "Failed to list files. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
