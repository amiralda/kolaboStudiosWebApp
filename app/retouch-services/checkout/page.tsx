'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PaymentForm } from '@/components/payment-form'
import { retouchServices } from '@/lib/retouch-data'
import { calculateOrderAmount, formatCurrency } from '@/lib/payment-utils'
import type { OrderData } from '@/lib/types'
import { SafeStorage } from '@/lib/storage'
import { CheckCircle, Clock, FileImage, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const data = SafeStorage.getOrderData()
      if (data && data.serviceId && data.customerInfo?.email) {
        setPaymentData(data)
      } else {
        setError('No order data found. Please start a new order.')
      }
    } catch (err) {
      console.error('Error loading order data:', err)
      setError('Failed to load order data. Please start a new order.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handlePaymentSuccess = (paymentIntentId: string) => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          'paymentSuccess',
          JSON.stringify({
            paymentIntentId,
            orderData: paymentData,
          }),
        )
      }

      // Redirect to success page
      router.push('/retouch-services/success')
    } catch (err) {
      console.error('Error handling payment success:', err)
      setError('Payment succeeded but failed to redirect. Please contact support.')
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    setError(error)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !paymentData) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Unable to Load Checkout</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'No order data found. Please start a new order.'}
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/retouch-services/order">Start New Order</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/retouch-services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const service = retouchServices.find(s => s.id === paymentData.serviceId)
  
  if (!service) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-4">The selected service is no longer available.</p>
          <Button asChild>
            <Link href="/retouch-services">View Available Services</Link>
          </Button>
        </div>
      </div>
    )
  }

  const amount = calculateOrderAmount(paymentData.serviceId, paymentData.quantity, paymentData.rushDelivery)

  // Handle custom pricing
  if (amount === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Custom Quote Required</h1>
          <p className="text-muted-foreground mb-4">This service requires a custom quote.</p>
          <Button asChild>
            <Link href="/contact">Contact Us for Quote</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-sora">Complete Your Order</h1>
          <p className="text-lg text-muted-foreground">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sora">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional photo retouching
                    </p>
                  </div>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service price:</span>
                    <span>${service.price} per image</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of images:</span>
                    <span>{paymentData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(service.price * paymentData.quantity).toFixed(2)}</span>
                  </div>
                  {paymentData.rushDelivery && (
                    <div className="flex justify-between">
                      <span>Rush delivery (50%):</span>
                      <span>+${((service.price * paymentData.quantity) * 0.5).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{paymentData.customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{paymentData.customerInfo.email}</span>
                </div>
                {paymentData.customerInfo.company && (
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <span>{paymentData.customerInfo.company}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>Delivery: {paymentData.rushDelivery ? '24 hours' : service.turnaroundTime}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FileImage className="h-4 w-4 mr-2 text-primary" />
                  <span>Format: {paymentData.orderDetails.fileFormat.toUpperCase()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  <span>2 revisions included</span>
                </div>
                {paymentData.rushDelivery && (
                  <div className="flex items-center text-sm">
                    <Zap className="h-4 w-4 mr-2 text-primary" />
                    <span>Rush delivery enabled</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </CardContent>
              </Card>
            )}
            
            <PaymentForm
              paymentData={paymentData}
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
