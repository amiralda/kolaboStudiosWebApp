'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { retouchServices } from '@/lib/retouch-data'
import { SafeStorage } from '@/lib/storage'

const DEFAULT_SERVICE = retouchServices.find((service) => service.price > 0)?.id ?? 'standard-retouch'

export default function RetouchOrderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    serviceId: DEFAULT_SERVICE,
    quantity: 5,
    rushDelivery: false,
    fileFormat: 'jpg',
    instructions: '',
    name: '',
    email: '',
    company: '',
    phone: '',
  })

  const selectedService =
    retouchServices.find((service) => service.id === formData.serviceId) ?? retouchServices[0]

  const subtotal = selectedService.price * formData.quantity
  const rushFee = formData.rushDelivery ? subtotal * 0.5 : 0
  const total = subtotal + rushFee

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const orderPayload = {
        serviceId: formData.serviceId,
        quantity: Math.max(1, formData.quantity),
        rushDelivery: formData.rushDelivery,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
        },
        orderDetails: {
          instructions: formData.instructions,
          fileFormat: formData.fileFormat as 'jpg' | 'tiff' | 'psd',
          files: [],
        },
        createdAt: new Date().toISOString(),
      }

      SafeStorage.setOrderData(orderPayload as any)
      router.push('/retouch-services/checkout')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2">Start your order</p>
          <h1 className="text-4xl md:text-5xl font-bold font-sora mb-4">Retouching Intake Form</h1>
          <p className="text-muted-foreground">
            Tell us what you need and we’ll prep your payment link. You can upload source files after checkout.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sora text-xl">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select service</label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose service" />
                    </SelectTrigger>
                    <SelectContent>
                      {retouchServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} — ${service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of images</label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(event) => setFormData((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Delivery format</label>
                    <Select
                      value={formData.fileFormat}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, fileFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpg">JPEG</SelectItem>
                        <SelectItem value="tiff">TIFF</SelectItem>
                        <SelectItem value="psd">PSD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rushDelivery"
                    checked={formData.rushDelivery}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, rushDelivery: Boolean(checked) }))
                    }
                  />
                  <label htmlFor="rushDelivery" className="text-sm">
                    Rush delivery (adds 50% fee, 24-hour turnaround)
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Retouching notes</label>
                  <Textarea
                    rows={5}
                    placeholder="Share preferences, mood boards, or references..."
                    value={formData.instructions}
                    onChange={(event) => setFormData((prev) => ({ ...prev, instructions: event.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sora text-xl">Contact details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Full name</label>
                  <Input
                    value={formData.name}
                    required
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email address</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Company / Studio (optional)</label>
                  <Input
                    value={formData.company}
                    onChange={(event) => setFormData((prev) => ({ ...prev, company: event.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Phone (optional)</label>
                  <Input
                    value={formData.phone}
                    onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? 'Preparing checkout…' : 'Continue to secure checkout'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-sora text-xl">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Selected service</p>
                <p className="font-semibold">{selectedService.name}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>${selectedService.price} × {formData.quantity}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {formData.rushDelivery && (
                  <div className="flex justify-between">
                    <span>Rush delivery</span>
                    <span>${rushFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-semibold border-t pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <p className="text-xs text-muted-foreground">
                After payment you’ll receive an upload link for RAW/JPEG files plus a shared workspace for revisions.
                Taxes are calculated by Stripe when applicable.
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
