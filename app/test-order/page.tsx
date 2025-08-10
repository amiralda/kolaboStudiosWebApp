'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { retouchServices } from '@/lib/retouch-data'

export default function TestOrderPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    serviceId: 'standard-retouch',
    quantity: 3,
    name: 'Test Customer',
    email: 'test@example.com',
    company: 'Test Studio',
    phone: '(555) 123-4567',
    rushDelivery: false
  })

  const createTestOrder = () => {
    const orderData = {
      serviceId: formData.serviceId,
      quantity: formData.quantity,
      rushDelivery: formData.rushDelivery,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
      },
      orderDetails: {
        instructions: 'This is a test order for payment integration',
        fileFormat: 'jpg',
        files: [] // Mock files for testing
      }
    }

    localStorage.setItem('retouchOrder', JSON.stringify(orderData))
    router.push('/retouch-services/checkout')
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-sora">Create Test Order</h1>
          <p className="text-lg text-muted-foreground">
            Create a test order to test the payment flow
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {retouchServices.filter(s => s.price > 0).map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Customer Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-center space-y-4">
                <div className="text-lg font-semibold">
                  Total: ${((retouchServices.find(s => s.id === formData.serviceId)?.price || 0) * formData.quantity).toFixed(2)}
                </div>
                
                <Button onClick={createTestOrder} className="bg-primary hover:bg-primary/90" size="lg">
                  Create Test Order & Go to Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Use these test card numbers in the checkout:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <strong>Success:</strong> 4242 4242 4242 4242
            </div>
            <div className="bg-white p-3 rounded border">
              <strong>Declined:</strong> 4000 0000 0000 0002
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use any future expiry date and any 3-digit CVC
          </p>
        </div>
      </div>
    </div>
  )
}
