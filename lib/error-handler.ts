// ✅ Centralized error handling and logging
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  PAYMENT = 'PAYMENT',
  STORAGE = 'STORAGE',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorInfo {
  type: ErrorType
  message: string
  code?: string
  details?: any
  timestamp: string
  userId?: string
  sessionId?: string
}

export class ErrorHandler {
  private static isDevelopment = process.env.NODE_ENV === 'development'

  static log(error: ErrorInfo): void {
    const logEntry = {
      ...error,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    }

    if (this.isDevelopment) {
      console.error('Error logged:', logEntry)
    }

    // In production, send to logging service (e.g., Sentry, LogRocket)
    // this.sendToLoggingService(logEntry)
  }

  static handleError(error: unknown, type: ErrorType = ErrorType.UNKNOWN): ErrorInfo {
    const errorInfo: ErrorInfo = {
      type,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    }

    if (error instanceof Error) {
      errorInfo.message = error.message
      errorInfo.details = {
        name: error.name,
        stack: error.stack,
      }
    } else if (typeof error === 'string') {
      errorInfo.message = error
    } else {
      errorInfo.details = error
    }

    this.log(errorInfo)
    return errorInfo
  }

  static createUserFriendlyMessage(error: ErrorInfo): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.'
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again.'
      case ErrorType.PAYMENT:
        return 'Payment failed. Please check your card details and try again.'
      case ErrorType.STORAGE:
        return 'Unable to save data. Please try again.'
      default:
        return 'Something went wrong. Please try again or contact support.'
    }
  }

  // Rate limiting helper
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const record = this.rateLimitMap.get(key)

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  }
}
