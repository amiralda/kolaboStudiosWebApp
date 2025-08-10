'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Download, Mail, Calendar } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const successData = localStorage.getItem('paymentSuccess')
    if (successData) {
      const data = JSON.parse(successData)
      setOrderData(data)
      // Clear the stored data
      localStorage.removeItem('paymentSuccess')
      localStorage.removeItem('retouchOrder')
    } else {
      // Redirect if no success data found
      router.push('/retouch-services')
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!orderData) {
    return null
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-sora">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We've received your payment and images.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-sora">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono text-sm">{orderData.paymentIntentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{orderData.orderData.serviceId.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
              </div>
              <div className="flex justify-between">
                <span>Images:</span>
                <span>{orderData.orderData.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Rush delivery:</span>
                <span>{orderData.orderData.rushDelivery ? 'Yes' : 'No'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sora">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">You'll receive a confirmation email within 5 minutes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <div>
                  <p className="font-medium">Processing Begins</p>
                  <p className="text-sm text-muted-foreground">Our team will start working on your images</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.orderData.rushDelivery ? 'Within 24 hours' : 'Within 2-3 business days'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• A confirmation email has been sent to {orderData.orderData.customerInfo.email}</li>
                <li>• You'll receive updates on your order progress via email</li>
                <li>• Your retouched images will be delivered through a secure download link</li>
                <li>• Files will be available for download for 30 days after delivery</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/retouch-services">
              <Calendar className="h-4 w-4 mr-2" />
              Order More Services
            </Link>
          </Button>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Questions about your order? Contact us at support@kolabostudios.com</p>
        </div>
      </div>
    </div>
  )
}
