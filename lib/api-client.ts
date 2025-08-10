// ✅ Centralized API client with comprehensive error handling
import type { ApiResponse } from './types'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  private static defaultTimeout = 30000 // 30 seconds

  private static async request<T>(
    endpoint: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        )
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: error.code,
        }
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
            code: 'TIMEOUT',
          }
        }

        return {
          success: false,
          error: error.message,
          code: 'NETWORK_ERROR',
        }
      }

      return {
        success: false,
        error: 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      }
    }
  }

  static async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  static async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // Retry mechanism for failed requests
  static async withRetry<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<ApiResponse<T>> {
    let lastError: ApiResponse<T>

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await requestFn()
      
      if (result.success) {
        return result
      }

      lastError = result

      // Don't retry on client errors (4xx)
      if (result.code && result.code.startsWith('4')) {
        break
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }

    return lastError!
  }
}
