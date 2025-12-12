import { describe, expect, it } from 'vitest'
import { calculateOrderAmount } from '../lib/payment-utils'

describe('calculateOrderAmount', () => {
  it('calculates base service price in cents', () => {
    const amount = calculateOrderAmount('standard-retouch', 4, false)
    expect(amount).toBe(25 * 4 * 100)
  })

  it('applies rush multiplier when requested', () => {
    const amount = calculateOrderAmount('premium-retouch', 2, true)
    expect(amount).toBe(Math.round(45 * 2 * 1.5 * 100))
  })

  it('returns zero for custom pricing', () => {
    const amount = calculateOrderAmount('custom-retouch', 10, false)
    expect(amount).toBe(0)
  })
})
