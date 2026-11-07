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
import { checkAdminAuth } from "@/lib/auth/admin-auth"
import { verifyUploadToken } from "@/lib/upload-token"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import Stripe from "stripe"

// A client upload token is issued when the PaymentIntent is CREATED, i.e.
// before the customer pays. Without this check anyone could create a
// PaymentIntent, keep the token and upload files without paying.
// Non-admin client uploads therefore also require the PaymentIntent
// (orderId) to be paid. Fails closed when Stripe is not configured.
const PAID_STATUSES = new Set(["succeeded", "processing"])

async function isOrderPaid(orderId: string): Promise<boolean> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || !/^pi_[A-Za-z0-9]+$/.test(orderId)) return false
  try {
    const stripe = new Stripe(key)
    const intent = await stripe.paymentIntents.retrieve(orderId)
    return PAID_STATUSES.has(intent.status)
  } catch {
    return false
  }
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/tiff", "image/heic"]
const ALLOWED_CLIENT_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
]

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------
// NOTE: the Origin check below is defense-in-depth only — it is NOT
// authentication. curl and scripts send no Origin header and pass it.
// Real protection on this route is the admin auth / upload-token checks.
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

/**
 * Admin auth gate for the file API. Returns a response to send when the
 * caller is NOT an admin, or null when the caller is authorized.
 * Fails closed (503) when ADMIN_SECRET is not configured.
 */
function adminGate(request: NextRequest): NextResponse | null {
  const auth = checkAdminAuth(request)
  if (auth.ok) return null
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

// ---------------------------------------------------------------------------
// POST — upload a file
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Shared rate limit: 10 uploads per minute per IP (Upstash when
  // configured, in-memory fallback otherwise).
  if (!(await checkRateLimit(`upload-post:${ip}`, 10, 60))) {
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

    // --- Authorization -----------------------------------------------
    // "photo" / "general" uploads are admin-only (the gallery manager
    // in /admin is the only caller). "client" uploads need either admin
    // auth or a signed upload token issued for exactly this orderId
    // (see lib/upload-token.ts; tokens are issued with the
    // create-payment-intent response, bound to the payment intent id).
    const admin = checkAdminAuth(request)
    if (uploadType === "client") {
      const token = formData.get("uploadToken")
      const tokenOk =
        !!orderId && verifyUploadToken(token, orderId)
      if (!admin.ok && !tokenOk) {
        return withCors(
          NextResponse.json(
            { error: "A valid upload token for this order is required." },
            { status: 401 }
          )
        )
      }
      if (!admin.ok && !(await isOrderPaid(orderId))) {
        return withCors(
          NextResponse.json(
            { error: "This order is not paid yet." },
            { status: 402 }
          )
        )
      }
    } else if (!admin.ok) {
      const gate = adminGate(request)
      if (gate) return gate
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
// DELETE — delete a file (must be a Vercel Blob URL). Admin-only.
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request)

  // Shared rate limit: 20 deletes per minute per IP.
  if (!(await checkRateLimit(`upload-delete:${ip}`, 20, 60))) {
    return withCors(
      NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": "60" } }
      )
    )
  }

  try {
    const originCheck = ensureSameOrigin(request)
    if (originCheck) return originCheck

    // Deleting files is admin-only. Fails closed (503) when ADMIN_SECRET
    // is not configured.
    const gate = adminGate(request)
    if (gate) return gate

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
