// ✅ Global error boundary component
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { ErrorHandler, ErrorType } from '@/lib/error-handler'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorInfo = ErrorHandler.handleError(error, ErrorType.UNKNOWN)
    return {
      hasError: true,
      error,
      errorId: errorInfo.timestamp,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorHandler.log({
      type: ErrorType.UNKNOWN,
      message: error.message,
      details: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
      timestamp: new Date().toISOString(),
    })
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.retry} />
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.retry} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-sora">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-gray-100 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{error.message}</pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for handling async errors in components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: unknown) => {
    const errorInfo = ErrorHandler.handleError(error)
    setError(new Error(ErrorHandler.createUserFriendlyMessage(errorInfo)))
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by error boundary
  if (error) {
    throw error
  }

  return { handleError, clearError }
}
