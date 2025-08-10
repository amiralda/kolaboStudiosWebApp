export interface PaymentData {
  serviceId: string
  quantity: number
  rushDelivery: boolean
  customerInfo: {
    name: string
    email: string
    company?: string
    phone?: string
  }
  orderDetails: {
    instructions: string
    fileFormat: string
    files: File[]
  }
}

export interface Order {
  id: string
  stripePaymentIntentId: string
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
  service: string
  quantity: number
  amount: number
  rushDelivery: boolean
  customerInfo: PaymentData['customerInfo']
  orderDetails: PaymentData['orderDetails']
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export function calculateOrderAmount(serviceId: string, quantity: number, rushDelivery: boolean): number {
  const servicePrices: Record<string, number> = {
    'basic-retouch': 15,
    'standard-retouch': 25,
    'premium-retouch': 45,
    'custom-retouch': 0, // Custom pricing handled separately
  }

  let baseAmount = (servicePrices[serviceId] || 0) * quantity
  
  if (rushDelivery) {
    baseAmount *= 1.5 // 50% rush fee
  }

  return Math.round(baseAmount * 100) // Convert to cents for Stripe
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100)
}
