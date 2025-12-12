// ✅ Comprehensive type definitions
import { Stripe } from '@stripe/stripe-js'

export interface OrderData {
  serviceId: string
  quantity: number
  rushDelivery: boolean
  customerInfo: CustomerInfo
  orderDetails: OrderDetails
  createdAt?: string
  id?: string
}

export interface CustomerInfo {
  name: string
  email: string
  company?: string
  phone?: string
}

export interface OrderDetails {
  instructions: string
  fileFormat: 'jpg' | 'tiff' | 'psd'
  files: File[]
}

export interface StripeCardChangeEvent {
  complete: boolean
  error?: {
    message: string
    type: string
    code?: string
  }
  elementType: string
  empty: boolean
  brand?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
}

export interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

export interface Photo {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
  date?: string
  location?: string
  tags?: string[]
  featured?: boolean
  order?: number
  uploadedAt: string
  fileSize?: number
  dimensions?: {
    width: number
    height: number
  }
}

export interface BlogPost {
  title: string
  date: string
  author: string
  excerpt: string
  image: string
  slug: string
  category: string
  content?: string
}

export interface ContactFormData {
  name: string
  email: string
  shootType: string
  message: string
  preferredDate?: Date
}

export interface RetouchOrderFormData {
  name: string
  email: string
  company: string
  phone: string
  instructions: string
  rushDelivery: boolean
  fileFormat: 'jpg' | 'tiff' | 'psd'
}
