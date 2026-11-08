/**
 * Admin password + setup-token hashing.
 *
 * Node.js runtime ONLY (uses node:crypto) — import from API route
 * handlers and server components, never from middleware (edge).
 *
 * Passwords: scrypt with a random salt, stored as
 *   scrypt$v1$N$r$p$<salt base64>$<hash base64>
 * No new dependency — Node's built-in scrypt.
 *
 * Setup tokens: the raw token is emailed to the admin and only its
 * SHA-256 hex is stored (same hash the SQL bootstrap uses, so a token
 * created in the Supabase SQL editor verifies here).
 */
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto"

const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LENGTH = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  })
  return [
    "scrypt",
    "v1",
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("base64"),
    hash.toString("base64"),
  ].join("$")
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split("$")
    if (parts.length !== 7 || parts[0] !== "scrypt" || parts[1] !== "v1") {
      return false
    }
    const N = Number(parts[2])
    const r = Number(parts[3])
    const p = Number(parts[4])
    const salt = Buffer.from(parts[5], "base64")
    const expected = Buffer.from(parts[6], "base64")
    if (!N || !r || !p || salt.length === 0 || expected.length === 0) {
      return false
    }
    const hash = scryptSync(password, salt, expected.length, { N, r, p })
    return timingSafeEqual(hash, expected)
  } catch {
    return false
  }
}

/** 256-bit random setup token, hex-encoded (emailed to the admin). */
export function makeSetupToken(): string {
  return randomBytes(32).toString("hex")
}

/** SHA-256 hex of the token's UTF-8 bytes — the value stored in the DB. */
export function hashSetupToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex")
}
