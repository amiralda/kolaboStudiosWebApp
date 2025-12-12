export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import {
  uploadFile,
  uploadPhoto,
  uploadClientFile,
  validateFileType,
  validateFileSize,
} from "@/lib/storage/vercel-blob"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/tiff", "image/heic"]

const ALLOWED_CLIENT_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
]

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

export async function POST(request: NextRequest) {
  try {
    const originCheck = ensureSameOrigin(request)
    if (originCheck) return originCheck

    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadType = (formData.get("type") as string) || "general"
    const category = (formData.get("category") as string) || "general"
    const orderId = formData.get("orderId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("📤 Upload request:", {
      filename: file.name,
      type: file.type,
      size: file.size,
      uploadType,
      category,
      orderId,
    })

    let uploadResult

    // Handle different upload types
    switch (uploadType) {
      case "photo":
        uploadResult = await uploadPhoto(file, category)
        break
      case "client":
        if (!orderId) {
          return NextResponse.json({ error: "Order ID required for client uploads" }, { status: 400 })
        }
        uploadResult = await uploadClientFile(file, orderId)
        break
      default:
        // General upload
        const allowedTypes = uploadType === "client" ? ALLOWED_CLIENT_FILE_TYPES : ALLOWED_IMAGE_TYPES

        if (!validateFileType(file, allowedTypes)) {
          return NextResponse.json(
            {
              error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
              allowedTypes,
            },
            { status: 400 },
          )
        }

        const maxSize = uploadType === "client" ? 100 : 50
        if (!validateFileSize(file, maxSize)) {
          return NextResponse.json(
            {
              error: `File too large. Maximum size is ${maxSize}MB.`,
              maxSize,
            },
            { status: 400 },
          )
        }

        uploadResult = await uploadFile(file, category || "uploads")
        break
    }

    if (!uploadResult.success) {
      console.error("❌ Upload failed:", uploadResult.error)
      return NextResponse.json({ error: uploadResult.error || "Upload failed" }, { status: 500 })
    }

    console.log("✅ Upload successful:", uploadResult.url)

    return withCors(NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: uploadResult.url,
        pathname: uploadResult.pathname,
      },
      uploadType,
      category,
      orderId,
    }))
  } catch (error) {
    console.error("❌ Upload API error:", error)
    return withCors(NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    ))
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const originCheck = ensureSameOrigin(request)
    if (originCheck) return originCheck

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get("url")

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 })
    }

    console.log("🗑️ Delete request:", fileUrl)

    const { deleteFile } = await import("@/lib/storage/vercel-blob")
    const deleteResult = await deleteFile(fileUrl)

    if (!deleteResult.success) {
      console.error("❌ Delete failed:", deleteResult.error)
      return NextResponse.json({ error: deleteResult.error || "Delete failed" }, { status: 500 })
    }

    console.log("✅ Delete successful:", fileUrl)

    return withCors(NextResponse.json({
      success: true,
      message: "File deleted successfully",
    }))
  } catch (error) {
    console.error("❌ Delete API error:", error)
    return withCors(NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    ))
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, {
    status: 200,
  })
  if (ALLOWED_ORIGIN) {
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
  }
  response.headers.set("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")
  response.headers.set("Vary", "Origin")
  return response
}
