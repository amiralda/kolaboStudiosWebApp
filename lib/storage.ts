// ✅ Safe localStorage wrapper with validation and error handling
import { validateOrderData } from './validation'
import type { OrderData } from './types'

export class SafeStorage {
  private static isClient = typeof window !== 'undefined'

  static setItem<T>(key: string, value: T): boolean {
    if (!this.isClient) {
      console.warn('localStorage not available on server')
      return false
    }

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      return true
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      return false
    }
  }

  static getItem<T>(
    key: string, 
    validator?: (data: unknown) => T | null
  ): T | null {
    if (!this.isClient) {
      console.warn('localStorage not available on server')
      return null
    }

    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const parsed = JSON.parse(item)
      return validator ? validator(parsed) : parsed
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      // Clean up corrupted data
      this.removeItem(key)
      return null
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isClient) {
      console.warn('localStorage not available on server')
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
      return false
    }
  }

  static clear(): boolean {
    if (!this.isClient) {
      console.warn('localStorage not available on server')
      return false
    }

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  // Specialized methods for order data
  static setOrderData(orderData: OrderData): boolean {
    return this.setItem('retouchOrder', orderData)
  }

  static getOrderData(): OrderData | null {
    return this.getItem('retouchOrder', validateOrderData)
  }

  static removeOrderData(): boolean {
    return this.removeItem('retouchOrder')
  }

  // Check storage availability
  static isAvailable(): boolean {
    if (!this.isClient) return false

    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
}
