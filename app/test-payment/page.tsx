'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, ArrowRight } from 'lucide-react'

const TEST_SCENARIOS = [
  {
    id: 'success',
    title: 'Successful Payment',
    card: '4242424242424242',
    description: 'Test a successful payment flow',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'declined',
    title: 'Declined Payment',
    card: '4000000000000002',
    description: 'Test a declined card scenario',
    color: 'bg-red-50 border-red-200'
  },
  {
    id: 'auth',
    title: 'Requires Authentication',
    card: '4000002500003155',
    description: 'Test 3D Secure authentication',
    color: 'bg-yellow-50 border-yellow-200'
  }
]

export default function TestPaymentPage() {
  const [testOrder, setTestOrder] = useState(null)

  const createTestOrder = () => {
    const orderData = {
      serviceId: 'standard-retouch',
      quantity: 3,
      rushDelivery: false,
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        company: 'Test Studio',
        phone: '(555) 123-4567',
      },
      orderDetails: {
        instructions: 'This is a test order for payment integration',
        fileFormat: 'jpg',
        files: [] // Mock files for testing
      }
    }

    localStorage.setItem('retouchOrder', JSON.stringify(orderData))
    setTestOrder(orderData)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-sora">Test Payment Integration</h1>
          <p className="text-lg text-muted-foreground">
            Test your Stripe integration with these scenarios
          </p>
        </div>

        {/* Configuration Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Stripe Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Publishable Key</span>
                <Badge variant="default">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✓ Connected' : '✗ Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Test Mode</span>
                <Badge variant="secondary">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('test') ? '✓ Active' : 'Live Mode'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Scenarios */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {TEST_SCENARIOS.map((scenario) => (
            <Card key={scenario.id} className={scenario.color}>
              <CardHeader>
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    {scenario.card}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use any future expiry date and any 3-digit CVC
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Order Setup */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Test Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Create a test order to test the complete payment flow
              </p>
              
              {!testOrder ? (
                <Button onClick={createTestOrder} className="bg-primary hover:bg-primary/90">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Create Test Order
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">Test Order Created</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>• Service: Standard Retouching</p>
                      <p>• Quantity: 3 images</p>
                      <p>• Total: $75.00</p>
                    </div>
                  </div>
                  
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/retouch-services/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/retouch-services/order">
              Full Order Flow
            </Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://dashboard.stripe.com/test/payments" target="_blank" rel="noopener noreferrer">
              View Stripe Dashboard
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/stripe-setup">
              Setup Guide
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
