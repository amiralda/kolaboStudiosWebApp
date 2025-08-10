'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WeTransferUploadGuide } from '@/components/wetransfer-upload-guide'
import { ArrowLeft, Clock, CheckCircle, Mail } from 'lucide-react'

interface OrderData {
  id: string
  customerEmail: string
  serviceId: string
  quantity: number
  amount: number
  status: string
  createdAt: string
}

export default function UploadPage({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'pending' | 'confirmed' | 'received'>('pending')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you'd fetch this from your database
    // For now, we'll simulate order data
    const mockOrderData: OrderData = {
      id: params.orderId,
      customerEmail: 'customer@example.com',
      serviceId: 'standard-retouch',
      quantity: 5,
      amount: 12500, // $125.00 in cents
      status: 'awaiting_upload',
      createdAt: new Date().toISOString()
    }
    
    setOrderData(mockOrderData)
    setIsLoading(false)
  }, [params.orderId])

  const handleUploadConfirmed = () => {
    setUploadStatus('confirmed')
    
    // Here you would typically:
    // 1. Update order status in database
    // 2. Send notification to your team
    // 3. Set up monitoring for file receipt
    
    console.log('Upload confirmed for order:', params.orderId)
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist or has expired.
          </p>
          <Button asChild>
            <Link href="/retouch-services">View Services</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/retouch-services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 font-sora">Upload Your Photos</h1>
            <p className="text-lg text-muted-foreground">
              Order #{orderData.id} - Ready for your files
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{orderData.quantity}</div>
                <div className="text-sm text-muted-foreground">Images</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${(orderData.amount / 100).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Paid</div>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  {orderData.serviceId.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">Service</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-sm font-medium">2-3 Days</span>
                </div>
                <div className="text-sm text-muted-foreground">Delivery</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Status */}
        {uploadStatus === 'pending' && (
          <WeTransferUploadGuide
            orderId={orderData.id}
            customerEmail={orderData.customerEmail}
            onUploadConfirmed={handleUploadConfirmed}
          />
        )}

        {uploadStatus === 'confirmed' && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Upload Confirmed!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for confirming your upload. We'll notify you once we receive 
                  your files and begin processing your order.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-semibold text-blue-900 mb-1">What's Next?</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• We'll confirm file receipt within 2 hours</li>
                        <li>• Processing begins immediately after</li>
                        <li>• You'll receive updates via email</li>
                        <li>• Delivery via WeTransfer when complete</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild variant="outline">
                    <Link href="/retouch-services">Order More Services</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Having Upload Issues?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Try uploading smaller batches</li>
                  <li>• Ensure files are under 20GB total</li>
                  <li>• Contact us if WeTransfer isn't working</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Alternative Upload Methods</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  If WeTransfer isn't working for you, we also accept:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Google Drive shared links</li>
                  <li>• Dropbox shared folders</li>
                  <li>• Email for smaller files (&lt;25MB)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Questions about your order or need assistance?
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
