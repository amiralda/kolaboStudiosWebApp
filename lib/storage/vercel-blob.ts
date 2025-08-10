import { put, del, list } from "@vercel/blob"

interface UploadResult {
  success: boolean
  url?: string
  pathname?: string
  filename?: string
  error?: string
}

interface DeleteResult {
  success: boolean
  error?: string
}

export async function uploadFile(file: File, folder = "uploads"): Promise<UploadResult> {
  try {
    // Check if Vercel Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("⚠️ No BLOB_READ_WRITE_TOKEN found - file upload skipped")
      return {
        success: false,
        error: "File storage not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables.",
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split(".").pop()
    const baseName = file.name.split(".").slice(0, -1).join(".")
    const filename = `${folder}/${timestamp}-${randomString}-${baseName}.${fileExtension}`

    console.log("📁 Uploading file:", {
      originalName: file.name,
      size: file.size,
      type: file.type,
      filename,
    })

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false, // We're already adding our own suffix
    })

    console.log("✅ File uploaded successfully:", blob.url)

    return {
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name,
    }
  } catch (error) {
    console.error("❌ File upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    }
  }
}

export async function deleteFile(url: string): Promise<DeleteResult> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("⚠️ No BLOB_READ_WRITE_TOKEN found - file deletion skipped")
      return {
        success: false,
        error: "File storage not configured",
      }
    }

    await del(url)
    console.log("✅ File deleted successfully:", url)
    return { success: true }
  } catch (error) {
    console.error("❌ File deletion error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown deletion error",
    }
  }
}

export async function listFiles(folder?: string, limit = 100) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("⚠️ No BLOB_READ_WRITE_TOKEN found - file listing skipped")
      return {
        success: false,
        error: "File storage not configured",
        files: [],
      }
    }

    const { blobs } = await list({
      prefix: folder,
      limit,
    })

    console.log(`📋 Listed ${blobs.length} files from folder: ${folder || "root"}`)

    return {
      success: true,
      files: blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
    }
  } catch (error) {
    console.error("❌ File listing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown listing error",
      files: [],
    }
  }
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const fileExtension = originalName.split(".").pop()
  const baseName = originalName.split(".").slice(0, -1).join(".")

  if (prefix) {
    return `${prefix}/${timestamp}-${randomString}-${baseName}.${fileExtension}`
  }

  return `${timestamp}-${randomString}-${baseName}.${fileExtension}`
}

// Photo-specific upload function
export async function uploadPhoto(file: File, category = "gallery"): Promise<UploadResult> {
  // Validate it's an image
  const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/tiff", "image/heic"]

  if (!validateFileType(file, imageTypes)) {
    return {
      success: false,
      error: "Invalid file type. Please upload an image file (JPEG, PNG, WebP, TIFF, or HEIC).",
    }
  }

  // Validate file size (max 50MB for photos)
  if (!validateFileSize(file, 50)) {
    return {
      success: false,
      error: "File too large. Maximum size is 50MB.",
    }
  }

  // Upload to photos folder with category
  return uploadFile(file, `photos/${category}`)
}

// Client file upload function (for retouch orders)
export async function uploadClientFile(file: File, orderId: string): Promise<UploadResult> {
  // Allow images and zip files for client uploads
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/tiff",
    "image/raw",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
  ]

  if (!validateFileType(file, allowedTypes)) {
    return {
      success: false,
      error: "Invalid file type. Please upload images or zip files only.",
    }
  }

  // Validate file size (max 100MB for client files)
  if (!validateFileSize(file, 100)) {
    return {
      success: false,
      error: "File too large. Maximum size is 100MB.",
    }
  }

  // Upload to client-files folder with order ID
  return uploadFile(file, `client-files/${orderId}`)
}
