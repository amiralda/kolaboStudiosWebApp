// ✅ Comprehensive input validation with Zod
import { z } from 'zod'

// Order validation schemas
export const CustomerInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100, 'Company name too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
})

export const OrderDetailsSchema = z.object({
  instructions: z.string().max(1000, 'Instructions too long'),
  fileFormat: z.enum(['jpg', 'tiff', 'psd']),
  files: z.array(z.any()).max(20, 'Too many files'),
})

export const OrderDataSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(50, 'Too many images'),
  rushDelivery: z.boolean(),
  customerInfo: CustomerInfoSchema,
  orderDetails: OrderDetailsSchema,
  createdAt: z.string().optional(),
  id: z.string().optional(),
})

// Contact form validation
export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  shootType: z.string().min(1, 'Please select a session type'),
  message: z.string().min(10, 'Message too short').max(1000, 'Message too long'),
})

// Payment intent validation
export const CreatePaymentIntentSchema = z.object({
  serviceId: z.string().min(1),
  quantity: z.number().min(1).max(50),
  rushDelivery: z.boolean(),
  customerInfo: CustomerInfoSchema,
})

// Blog post validation
export const BlogPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500),
  category: z.string().min(1),
  author: z.string().min(1),
  slug: z.string().min(1),
})

// Validation helper functions
export const validateOrderData = (data: unknown): OrderData | null => {
  try {
    return OrderDataSchema.parse(data)
  } catch (error) {
    console.error('Order data validation failed:', error)
    return null
  }
}

export const validateContactForm = (data: unknown) => {
  return ContactFormSchema.safeParse(data)
}

export const validatePaymentIntent = (data: unknown) => {
  return CreatePaymentIntentSchema.safeParse(data)
}

// HTML sanitization
export const sanitizeHtml = (html: string): string => {
  // Remove script tags and other dangerous elements
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

// File validation
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024 // 50MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/x-photoshop',
    'application/photoshop'
  ]

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large (max 50MB)' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }

  return { valid: true }
}
