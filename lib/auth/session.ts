/**
 * Admin session tokens (per-user accounts, Dany 2026-11-08).
 *
 * Stateless HMAC-signed token, verified without a database hit so the
 * edge middleware can check it:
 *   base64url(JSON payload) "." base64url(HMAC-SHA256(secret, payload))
 * Payload: { sub: userId, email, exp: epoch seconds }.
 *
 * EDGE-SAFE: uses only WebCrypto (globalThis.crypto.subtle), TextEncoder
 * and btoa/atob — no node:crypto, so middleware.ts can import this.
 *
 * Signing secret: ADMIN_SESSION_SECRET, falling back to ADMIN_SECRET.
 * When neither is set, no session can be created or verified and the
 * account system reports itself as not configured (fail closed).
 * Rotate the secret to invalidate every session at once.
 */

export const SESSION_COOKIE = "kolabo_admin_session"
/** 30 days — Dany stays logged in on his phone. */
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60

export interface SessionPayload {
  sub: string
  email: string
  exp: number
}

export function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SECRET || null
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64urlDecode(input: string): Uint8Array<ArrayBuffer> {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function signSessionToken(
  user: { id: string; email: string },
  secret: string
): Promise<string> {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const payloadB64 = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  )
  const key = await hmacKey(secret)
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  )
  return `${payloadB64}.${base64urlEncode(new Uint8Array(signature))}`
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  try {
    const [payloadB64, signatureB64] = token.split(".")
    if (!payloadB64 || !signatureB64) return null
    const key = await hmacKey(secret)
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(signatureB64),
      new TextEncoder().encode(payloadB64)
    )
    if (!valid) return null
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(payloadB64))
    ) as SessionPayload
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/** Read + verify the session cookie from a request's headers. */
export async function getSessionFromHeaders(
  headers: Headers
): Promise<SessionPayload | null> {
  const secret = getSessionSecret()
  if (!secret) return null
  const cookieHeader = headers.get("cookie") ?? ""
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
  if (!match) return null
  const token = decodeURIComponent(match.slice(SESSION_COOKIE.length + 1))
  if (!token) return null
  return verifySessionToken(token, secret)
}
