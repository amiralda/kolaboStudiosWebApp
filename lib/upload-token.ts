/**
 * Short-lived signed upload tokens for client (retouch) uploads.
 *
 * Problem solved: POST /api/upload with type=client used to accept ANY
 * orderId from anyone. Now a client upload must present a token that
 * was issued for exactly that orderId. Tokens are HMAC-SHA256 signed
 * with a server secret, so they cannot be forged.
 *
 * Signing secret: UPLOAD_TOKEN_SECRET, falling back to ADMIN_SECRET.
 * If neither is configured, issueUploadToken returns null (no token
 * issued) and verifyUploadToken always fails — fail closed.
 *
 * Token format: v1.<base64url(orderId)>.<expUnix>.<base64url(hmac)>
 * The HMAC covers "v1.<orderId>.<exp>".
 *
 * Scope note: a token only authorizes uploads into its own order's
 * folder (client-files/<orderId>/). It does NOT prove the order was
 * paid — the business must only process files for orders whose Stripe
 * payment actually succeeded (see the payment_intent.succeeded
 * webhook log / Stripe dashboard). Tokens are issued in the
 * create-payment-intent response, bound to that payment intent's id.
 */

import crypto from "crypto"

const TOKEN_VERSION = "v1"
const TOKEN_TTL_SECONDS = 24 * 60 * 60 // 24 hours
const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/

function getSigningSecret(): string | null {
  return process.env.UPLOAD_TOKEN_SECRET || process.env.ADMIN_SECRET || null
}

function base64urlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function base64urlDecode(input: string): string | null {
  try {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/")
    return Buffer.from(padded, "base64").toString("utf8")
  } catch {
    return null
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/** Issue a token for one orderId, or null when no signing secret exists. */
export function issueUploadToken(
  orderId: string,
  ttlSeconds: number = TOKEN_TTL_SECONDS
): string | null {
  const secret = getSigningSecret()
  if (!secret) return null
  if (!ORDER_ID_PATTERN.test(orderId)) return null

  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = `${TOKEN_VERSION}.${orderId}.${exp}`
  const sig = crypto.createHmac("sha256", secret).update(payload).digest()
  return `${TOKEN_VERSION}.${base64urlEncode(orderId)}.${exp}.${base64urlEncode(sig)}`
}

/** Verify that `token` was issued for exactly `orderId` and is unexpired. */
export function verifyUploadToken(token: unknown, orderId: string): boolean {
  if (typeof token !== "string" || !token) return false
  if (!ORDER_ID_PATTERN.test(orderId)) return false
  const secret = getSigningSecret()
  if (!secret) return false

  const parts = token.split(".")
  if (parts.length !== 4 || parts[0] !== TOKEN_VERSION) return false
  const [, orderIdB64, expStr, sigB64] = parts

  const tokenOrderId = base64urlDecode(orderIdB64)
  if (tokenOrderId !== orderId) return false

  const exp = Number.parseInt(expStr, 10)
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) return false

  const payload = `${TOKEN_VERSION}.${orderId}.${exp}`
  const expectedSig = base64urlEncode(
    crypto.createHmac("sha256", secret).update(payload).digest()
  )
  return timingSafeEqual(sigB64, expectedSig)
}
