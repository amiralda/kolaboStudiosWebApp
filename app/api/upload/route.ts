export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import {
  uploadFile,
  uploadPhoto,
  uploadClientFile,
  validateFileType,
  validateFileSize,
  validateMagicBytes,
} from "@/lib/storage/vercel-blob"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/tiff", "image/heic"]
const ALLOWED_CLIENT_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
]

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL

// ---------------------------------------------------------------------------
// Rate limiting — 10 uploads per minute per IP (best-effort, serverless)
// ---------------------------------------------------------------------------
const uploadRateMap = new Map<string, { count: number; resetTime: number }>()
const UPLOAD_LIMIT = 10
const UPLOAD_WINDOW_MS = 60_000

function checkUploadRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = uploadRateMap.get(ip)

  if (uploadRateMap.size > 5000) {
    for (const [k, v] of uploadRateMap) {
      if (now > v.resetTime) uploadRateMap.delete(k)
    }
  }

  if (!record || now > record.resetTime) {
    uploadRateMap.set(ip, { count: 1, resetTime: now + UPLOAD_WINDOW_MS })
    return true
  }
  if (record.count >= UPLOAD_LIMIT) return false
  record.count++
  return true
}

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------
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

/**
 * Validates that a URL belongs to Vercel Blob storage to prevent
 * arbitrary file deletion via the DELETE endpoint.
 */
function isVercelBlobUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return (
      hostname.endsWith(".blob.vercel-storage.com") ||
      hostname.endsWith(".public.blob.vercel-storage.com")
    )
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// POST — upload a file
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"

  if (!checkUploadRateLimit(ip)) {
    return withCors(
      NextResponse.json(
        { error: "Too many uploads. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": "60" } }
      )
    )
  }

  try {
    const originCheck = ensureSameOrigin(request)
    if (originCheck) return originCheck

    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadType = (formData.get("type") as string) || "general"
    const category = (formData.get("category") as string) || "general"
    const orderId = formData.get("orderId") as string

    if (!file) {
      return withCors(NextResponse.json({ error: "No file provided" }, { status: 400 }))
    }

    let uploadResult

    switch (uploadType) {
      case "photo":
        uploadResult = await uploadPhoto(file, category)
        break

      case "client": {
        if (!orderId) {
          return withCors(
            NextResponse.json({ error: "Order ID required for client uploads" }, { status: 400 })
          )
        }
        uploadResult = await uploadClientFile(file, orderId)
        break
      }

      default: {
        const allowedTypes = ALLOWED_IMAGE_TYPES

        if (!validateFileType(file, allowedTypes)) {
          return withCors(
            NextResponse.json(
              { error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` },
              { status: 400 }
            )
          )
        }

        if (!validateFileSize(file, 50)) {
          return withCors(
            NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 })
          )
        }

        // Magic byte check — MIME type can be spoofed by the browser
        const magicOk = await validateMagicBytes(file)
        if (!magicOk) {
          return withCors(
            NextResponse.json(
              { error: "File content does not match its declared type." },
              { status: 400 }
            )
          )
        }

        uploadResult = await uploadFile(file, category || "uploads")
        break
      }
    }

    if (!uploadResult.success) {
      console.error("❌ Upload failed:", uploadResult.error)
      return withCors(
        NextResponse.json({ error: uploadResult.error || "Upload failed" }, { status: 500 })
      )
    }

    return withCors(
      NextResponse.json({
        success: true,
        message: "File uploaded successfully",
        file: {
          size: file.size,
          type: file.type,
          url: uploadResult.url,
          pathname: uploadResult.pathname,
        },
      })
    )
  } catch (error) {
    console.error("❌ Upload API error:", error)
    return withCors(
      NextResponse.json(
        { error: "Internal server error. Please try again later." },
        { status: 500 }
      )
    )
  }
}

// ---------------------------------------------------------------------------
// DELETE — delete a file (must be a Vercel Blob URL)
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const originCheck = ensureSameOrigin(request)
    if (originCheck) return originCheck

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get("url") ?? ""

    if (!fileUrl) {
      return withCors(NextResponse.json({ error: "File URL is required" }, { status: 400 }))
    }

    // Prevent deletion of arbitrary URLs — only allow Vercel Blob URLs
    if (!isVercelBlobUrl(fileUrl)) {
      return withCors(
        NextResponse.json({ error: "Invalid file URL" }, { status: 400 })
      )
    }

    const { deleteFile } = await import("@/lib/storage/vercel-blob")
    const deleteResult = await deleteFile(fileUrl)

    if (!deleteResult.success) {
      return withCors(
        NextResponse.json({ error: deleteResult.error || "Delete failed" }, { status: 500 })
      )
    }

    return withCors(NextResponse.json({ success: true, message: "File deleted successfully" }))
  } catch (error) {
    console.error("❌ Delete API error:", error)
    return withCors(
      NextResponse.json(
        { error: "Internal server error. Please try again later." },
        { status: 500 }
      )
    )
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  if (ALLOWED_ORIGIN) response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
  response.headers.set("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")
  response.headers.set("Vary", "Origin")
  return response
}
