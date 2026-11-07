/**
 * Shared rate limiting for API routes and middleware.
 *
 * Uses Upstash Redis (REST API) when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set, so limits are shared across all
 * Vercel serverless instances. Without those env vars it falls back to
 * an in-memory Map, which is best-effort only: per-instance and reset
 * on cold start. The fallback exists so the site keeps working before
 * Upstash is configured, but it is NOT real protection.
 *
 * Required Vercel env vars for real protection:
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * (Upstash console -> your database -> REST API credentials.)
 *
 * If the Upstash request itself fails (network error, bad credentials),
 * the limiter fails OPEN and logs a warning, so a Redis outage cannot
 * take the site down. Watch the logs for "rate-limit-upstash-error".
 *
 * Edge-compatible: uses only fetch, Map and Date, so middleware can
 * import it too.
 */

type RateRecord = { count: number; resetTime: number }

const memoryStore = new Map<string, RateRecord>()
const MEMORY_PRUNE_AT = 5000

function memoryCheck(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  if (memoryStore.size > MEMORY_PRUNE_AT) {
    for (const [k, v] of memoryStore) {
      if (now > v.resetTime) memoryStore.delete(k)
    }
  }
  const record = memoryStore.get(key)
  if (!record || now > record.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  if (record.count >= limit) return false
  record.count++
  return true
}

async function upstashCheck(
  url: string,
  token: string,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean | null> {
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        // Only set the expiry when the key is fresh (NX), so a burst
        // cannot extend its own window.
        ["EXPIRE", key, windowSeconds, "NX"],
      ]),
    })
    if (!res.ok) {
      console.warn("[rate-limit] Upstash request failed:", res.status)
      return null
    }
    const data = (await res.json()) as {
      result?: Array<{ result?: number | string }>
    }
    const count = Number(data?.result?.[0]?.result)
    if (!Number.isFinite(count)) {
      console.warn("[rate-limit] Upstash unexpected response")
      return null
    }
    return count <= limit
  } catch (err) {
    console.warn("[rate-limit] Upstash error, failing open:", err)
    return null
  }
}

/**
 * Fixed-window rate limit. Returns true when the request is allowed.
 * `key` should already be namespaced per route, e.g. "contact:1.2.3.4".
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  const windowMs = windowSeconds * 1000

  if (url && token) {
    const allowed = await upstashCheck(
      url.replace(/\/$/, ""),
      token,
      `kolabo:rl:${key}`,
      limit,
      windowSeconds
    )
    if (allowed !== null) return allowed
    // Upstash failed: fall through to the in-memory limiter.
  }

  return memoryCheck(`kolabo:rl:${key}`, limit, windowMs)
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: { headers: Headers }): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}
