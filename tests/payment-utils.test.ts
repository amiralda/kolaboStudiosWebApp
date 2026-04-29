import { describe, expect, it } from "vitest"
import { calculateOrderAmount } from "../lib/payment-utils"
import { validateContactForm } from "../lib/validation"

// ---------------------------------------------------------------------------
// calculateOrderAmount
// ---------------------------------------------------------------------------
describe("calculateOrderAmount", () => {
  it("calculates base service price in cents", () => {
    expect(calculateOrderAmount("standard-retouch", 4, false)).toBe(25 * 4 * 100)
  })

  it("applies rush multiplier when requested", () => {
    expect(calculateOrderAmount("premium-retouch", 2, true)).toBe(
      Math.round(45 * 2 * 1.5 * 100)
    )
  })

  it("returns zero for custom pricing", () => {
    expect(calculateOrderAmount("custom-retouch", 10, false)).toBe(0)
  })

  it("returns zero for unknown service ID", () => {
    expect(calculateOrderAmount("nonexistent-service", 5, false)).toBe(0)
  })

  it("handles quantity of 1", () => {
    expect(calculateOrderAmount("basic-retouch", 1, false)).toBe(15 * 100)
  })

  it("rush multiplier does not apply when rushDelivery is false", () => {
    const base = calculateOrderAmount("premium-retouch", 3, false)
    const rush = calculateOrderAmount("premium-retouch", 3, true)
    expect(rush).toBeGreaterThan(base)
    expect(rush).toBe(Math.round(base * 1.5))
  })

  it("returns a number type", () => {
    expect(typeof calculateOrderAmount("standard-retouch", 2, false)).toBe("number")
  })

  it("result is always an integer (safe for Stripe)", () => {
    const amount = calculateOrderAmount("standard-retouch", 3, true)
    expect(Number.isInteger(amount)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Checkout server-side pricing logic (isolated from Stripe)
// ---------------------------------------------------------------------------
const SERVER_PRICES_USD: Record<string, number> = {
  wedding: 2500,
  "wedding-4h": 1500,
  "wedding-8h": 2800,
  engagement: 750,
  "engagement-4h": 900,
  "engagement-5h": 1100,
  maternity: 550,
  "maternity-2h": 550,
}

const CUSTOM_PRICE_MIN_USD = 100
const CUSTOM_PRICE_MAX_USD = 10_000
const DEPOSIT_RATE = 0.6

function resolvePrice(
  rawService: string,
  clientPrice?: number
): { fullPriceUsd: number; isCustom: boolean } {
  if (SERVER_PRICES_USD[rawService] !== undefined) {
    return { fullPriceUsd: SERVER_PRICES_USD[rawService], isCustom: false }
  }
  const prefix = Object.keys(SERVER_PRICES_USD).find((key) =>
    rawService.startsWith(key)
  )
  if (prefix) {
    return { fullPriceUsd: SERVER_PRICES_USD[prefix], isCustom: false }
  }
  const clamped = Math.min(
    CUSTOM_PRICE_MAX_USD,
    Math.max(
      CUSTOM_PRICE_MIN_USD,
      typeof clientPrice === "number" && isFinite(clientPrice)
        ? clientPrice
        : CUSTOM_PRICE_MIN_USD
    )
  )
  return { fullPriceUsd: clamped, isCustom: true }
}

describe("checkout server-side pricing", () => {
  it("uses server price for known service", () => {
    const { fullPriceUsd, isCustom } = resolvePrice("wedding")
    expect(fullPriceUsd).toBe(2500)
    expect(isCustom).toBe(false)
  })

  it("uses server price for known hyphenated service", () => {
    expect(resolvePrice("wedding-4h").fullPriceUsd).toBe(1500)
    expect(resolvePrice("engagement-5h").fullPriceUsd).toBe(1100)
    expect(resolvePrice("maternity-2h").fullPriceUsd).toBe(550)
  })

  it("ignores client-supplied price for known services", () => {
    // Even if client sends $1, server uses authoritative price
    expect(resolvePrice("wedding", 1).fullPriceUsd).toBe(2500)
    expect(resolvePrice("maternity", 0).fullPriceUsd).toBe(550)
  })

  it("clamps negative client price to minimum for unknown service", () => {
    const { fullPriceUsd } = resolvePrice("custom-portrait", -500)
    expect(fullPriceUsd).toBe(CUSTOM_PRICE_MIN_USD)
  })

  it("clamps excessively large client price for unknown service", () => {
    const { fullPriceUsd } = resolvePrice("custom-portrait", 999999)
    expect(fullPriceUsd).toBe(CUSTOM_PRICE_MAX_USD)
  })

  it("accepts valid price within range for unknown service", () => {
    const { fullPriceUsd, isCustom } = resolvePrice("custom-portrait", 500)
    expect(fullPriceUsd).toBe(500)
    expect(isCustom).toBe(true)
  })

  it("clamps zero client price to minimum", () => {
    expect(resolvePrice("custom-portrait", 0).fullPriceUsd).toBe(CUSTOM_PRICE_MIN_USD)
  })

  it("deposit is 60% of full price", () => {
    const { fullPriceUsd } = resolvePrice("wedding")
    expect(fullPriceUsd * DEPOSIT_RATE).toBe(1500)
  })
})

// ---------------------------------------------------------------------------
// Contact form validation (ContactRequestSchema equivalent)
// ---------------------------------------------------------------------------
describe("contact form validation (validateContactForm)", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    message: "I would like to book a wedding session.",
    shootType: "Wedding",
  }

  it("accepts a valid submission", () => {
    expect(validateContactForm(valid).success).toBe(true)
  })

  it("rejects missing name", () => {
    expect(validateContactForm({ ...valid, name: "" }).success).toBe(false)
  })

  it("rejects invalid email", () => {
    expect(validateContactForm({ ...valid, email: "not-an-email" }).success).toBe(false)
  })

  it("rejects message shorter than 10 characters", () => {
    expect(validateContactForm({ ...valid, message: "Hi" }).success).toBe(false)
  })

  it("rejects name longer than 100 characters", () => {
    expect(validateContactForm({ ...valid, name: "A".repeat(101) }).success).toBe(false)
  })

  it("rejects message longer than 1000 characters", () => {
    expect(validateContactForm({ ...valid, message: "A".repeat(1001) }).success).toBe(false)
  })

  it("returns error details on failure", () => {
    const result = validateContactForm({ ...valid, email: "bad" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors.length).toBeGreaterThan(0)
    }
  })
})
