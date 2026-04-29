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

// ---------------------------------------------------------------------------
// Allowed MIME types → safe file extensions (server-side whitelist)
// Never use the extension from the original filename — derive it from MIME type.
// ---------------------------------------------------------------------------
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/tiff": "tiff",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/gif": "gif",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/x-rar-compressed": "rar",
}

/**
 * Build a safe storage path with no original filename components.
 * Prevents path traversal attacks regardless of what the client sends.
 */
function buildSafeFilename(file: File, folder: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  const ext = MIME_TO_EXT[file.type] ?? "bin"
  // No original filename in path — timestamp + random suffix only
  return `${folder}/${timestamp}-${random}.${ext}`
}

// ---------------------------------------------------------------------------
// Magic-byte validation (server-side, cannot be spoofed by the client)
// ---------------------------------------------------------------------------
const MAGIC_BYTES: Array<{ type: string; check: (b: Uint8Array) => boolean }> = [
  // JPEG: FF D8 FF
  { type: "jpeg", check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  { type: "png", check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  // WebP: RIFF????WEBP
  {
    type: "webp",
    check: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  // GIF: GIF8
  { type: "gif", check: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
  // TIFF little-endian: 49 49 2A 00  |  big-endian: 4D 4D 00 2A
  {
    type: "tiff",
    check: (b) =>
      (b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a && b[3] === 0x00) ||
      (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a),
  },
  // HEIC/HEIF: ftyp box at offset 4
  {
    type: "heic",
    check: (b) => b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70,
  },
  // ZIP: PK header (50 4B 03 04 | 05 06 | 07 08)
  {
    type: "zip",
    check: (b) =>
      b[0] === 0x50 && b[1] === 0x4b &&
      (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07),
  },
  // RAR: Rar! (52 61 72 21)
  { type: "rar", check: (b) => b[0] === 0x52 && b[1] === 0x61 && b[2] === 0x72 && b[3] === 0x21 },
]

/**
 * Returns true if the first 12 bytes of the file match at least one known
 * magic-byte signature. Prevents executables and other malicious files from
 * being uploaded with a spoofed MIME type.
 */
export async function validateMagicBytes(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 12).arrayBuffer()
    const bytes = new Uint8Array(buffer)
    return MAGIC_BYTES.some(({ check }) => check(bytes))
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Core upload / delete / list
// ---------------------------------------------------------------------------

export async function uploadFile(file: File, folder = "uploads"): Promise<UploadResult> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("⚠️ No BLOB_READ_WRITE_TOKEN found - file upload skipped")
      return {
        success: false,
        error: "File storage not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables.",
      }
    }

    const filename = buildSafeFilename(file, folder)

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    console.log("✅ File uploaded successfully:", blob.url)
    return { success: true, url: blob.url, pathname: blob.pathname, filename: file.name }
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
      return { success: false, error: "File storage not configured" }
    }
    await del(url)
    console.log("✅ File deleted:", url)
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
      return { success: false, error: "File storage not configured", files: [] }
    }

    const { blobs } = await list({ prefix: folder, limit })
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

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// ---------------------------------------------------------------------------
// Typed upload helpers
// ---------------------------------------------------------------------------

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/tiff", "image/heic", "image/gif"]
const CLIENT_FILE_TYPES = [...IMAGE_TYPES, "application/zip", "application/x-zip-compressed", "application/x-rar-compressed"]

export async function uploadPhoto(file: File, category = "gallery"): Promise<UploadResult> {
  if (!validateFileType(file, IMAGE_TYPES)) {
    return { success: false, error: "Invalid file type. Please upload an image (JPEG, PNG, WebP, TIFF, GIF, or HEIC)." }
  }
  if (!validateFileSize(file, 50)) {
    return { success: false, error: "File too large. Maximum size is 50MB." }
  }
  const magicOk = await validateMagicBytes(file)
  if (!magicOk) {
    return { success: false, error: "File content does not match its declared type." }
  }
  return uploadFile(file, `photos/${category}`)
}

export async function uploadClientFile(file: File, orderId: string): Promise<UploadResult> {
  // Validate orderId to prevent path traversal in the folder name
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(orderId)) {
    return { success: false, error: "Invalid order ID." }
  }
  if (!validateFileType(file, CLIENT_FILE_TYPES)) {
    return { success: false, error: "Invalid file type. Please upload images or zip files only." }
  }
  if (!validateFileSize(file, 100)) {
    return { success: false, error: "File too large. Maximum size is 100MB." }
  }
  const magicOk = await validateMagicBytes(file)
  if (!magicOk) {
    return { success: false, error: "File content does not match its declared type." }
  }
  return uploadFile(file, `client-files/${orderId}`)
}
