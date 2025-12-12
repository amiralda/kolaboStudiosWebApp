'use client'

import { useState, useEffect, useCallback } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react'
import { ApiClient } from '@/lib/api-client'
import { SafeStorage } from '@/lib/storage'
import type { OrderData, StripeCardChangeEvent } from '@/lib/types'

const stripePromise = (() => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    console.error('Stripe publishable key not configured')
    return null
  }

  return loadStripe(key)
})()

interface PaymentFormProps {
  paymentData: OrderData
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({ paymentData, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  const initializePayment = useCallback(async () => {
    const response = await ApiClient.post<{ clientSecret: string; paymentIntentId: string }>(
      '/api/create-payment-intent',
      {
        serviceId: paymentData.serviceId,
        quantity: paymentData.quantity,
        rushDelivery: paymentData.rushDelivery,
        customerInfo: paymentData.customerInfo,
      }
    )

    if (response.success && response.data) {
      setClientSecret(response.data.clientSecret)
    } else {
      const errorMessage = response.error || 'Failed to initialize payment'
      setError(errorMessage)
      onError(errorMessage)
    }
  }, [paymentData, onError])

  useEffect(() => {
    initializePayment()
  }, [initializePayment])

  const handleCardChange = useCallback((event: StripeCardChangeEvent) => {
    setCardComplete(event.complete)
    if (event.error) {
      setError(event.error.message)
    } else {
      setError(null)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      const errorMessage = 'Payment system not ready. Please wait or refresh the page.'
      setError(errorMessage)
      onError(errorMessage)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      const errorMessage = 'Card element not found. Please refresh the page.'
      setError(errorMessage)
      onError(errorMessage)
      return
    }

    if (!cardComplete) {
      setError('Please complete your card information.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: paymentData.customerInfo.name,
              email: paymentData.customerInfo.email,
              phone: paymentData.customerInfo.phone || undefined,
            },
          },
        }
      )

      if (stripeError) {
        let errorMessage = 'Payment failed. Please try again.'

        switch (stripeError.type) {
          case 'card_error':
            errorMessage = stripeError.message || 'Your card was declined.'
            break
          case 'validation_error':
            errorMessage = stripeError.message || 'Please check your card information.'
            break
          case 'invalid_request_error':
            errorMessage = 'Invalid payment request. Please try again.'
            break
          default:
            errorMessage = stripeError.message || 'An unexpected error occurred.'
        }

        setError(errorMessage)
        onError(errorMessage)
      } else if (paymentIntent?.status === 'succeeded') {
        SafeStorage.removeOrderData()
        onSuccess(paymentIntent.id)
      } else {
        const errorMessage = 'Payment status unclear. Please contact support.'
        setError(errorMessage)
        onError(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      onError(errorMessage)
      console.error('Payment confirmation error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: false,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center font-sora">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-gray-50">
            <CardElement 
              options={cardElementOptions} 
              onChange={handleCardChange}
            />
          </div>
          
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-2" />
            <span>Secured by Stripe</span>
            <Lock className="h-4 w-4 ml-2" />
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Test Mode - Use These Cards:</h4>
              <div className="text-xs text-blue-800 space-y-1">
                <div>• Success: <code className="bg-white px-1 rounded">4242 4242 4242 4242</code></div>
                <div>• Declined: <code className="bg-white px-1 rounded">4000 0000 0000 0002</code></div>
                <div>• Use any future date for expiry (e.g., 12/25) and any 3-digit CVC (e.g., 123)</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret || !cardComplete}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </Button>

      <div className="text-xs text-center text-muted-foreground">
        Your payment is secure and encrypted. We never store your card details.
      </div>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  if (!stripePromise) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>
              Payment system unavailable. Please contact support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
    },
  }

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
