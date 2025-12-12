import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import crypto from 'crypto'
import { calculateOrderAmount } from '@/lib/payment-utils'
import { validatePaymentIntent } from '@/lib/validation'
import { ErrorHandler, ErrorType } from '@/lib/error-handler'

// ✅ Secure Stripe initialization with comprehensive error handling
const stripe = (() => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    ErrorHandler.log({
      type: ErrorType.PAYMENT,
      message: 'STRIPE_SECRET_KEY not found in environment variables',
      timestamp: new Date().toISOString(),
    })
    return null
  }
  return new Stripe(secretKey, { 
    typescript: true,
  })
})()

// ✅ Rate limiting map (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  // ✅ Early return if Stripe not configured
  if (!stripe) {
    ErrorHandler.log({
      type: ErrorType.PAYMENT,
      message: 'Stripe not configured',
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 500 }
    )
  }

  try {
    // ✅ Parse and validate request body
    const body = await request.json()
    const validationResult = validatePaymentIntent(body)
    
    if (!validationResult.success) {
      ErrorHandler.log({
        type: ErrorType.VALIDATION,
        message: 'Invalid payment intent request',
        details: validationResult.error.errors,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { serviceId, quantity, rushDelivery, customerInfo } = validationResult.data
    const hashedId = crypto.createHash('sha256').update(customerInfo.email.toLowerCase()).digest('hex')

    // ✅ Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `payment_${hashedId}_${clientIP}`
    
    if (!checkRateLimit(rateLimitKey, 5, 300000)) { // 5 requests per 5 minutes
      ErrorHandler.log({
        type: ErrorType.PAYMENT,
        message: 'Rate limit exceeded',
        details: { email: customerInfo.email, ip: clientIP },
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429 }
      )
    }

    // ✅ Amount calculation with validation
    const amount = calculateOrderAmount(serviceId, quantity, rushDelivery)
    if (amount === 0) {
      return NextResponse.json(
        { error: 'Custom pricing requires manual quote' },
        { status: 400 }
      )
    }

    // ✅ Additional security checks
    if (amount > 10000000) { // $100,000 limit
      ErrorHandler.log({
        type: ErrorType.PAYMENT,
        message: 'Amount exceeds maximum limit',
        details: { amount, customerEmail: customerInfo.email },
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        { error: 'Amount exceeds maximum limit' },
        { status: 400 }
      )
    }

    console.log('Creating payment intent:', {
      amount,
      serviceId,
      quantity,
      rushDelivery,
      customerHash: hashedId
    })

    // ✅ Create payment intent with comprehensive metadata
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${customerInfo.email}-${serviceId}-${quantity}-${rushDelivery}`)
      .digest('hex')

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          serviceId,
          quantity: quantity.toString(),
          rushDelivery: rushDelivery.toString(),
          customerHash: hashedId,
          customerName: customerInfo.name,
          company: customerInfo.company || '',
          phone: customerInfo.phone || '',
          createdAt: new Date().toISOString(),
          source: 'website',
          version: '1.0',
        },
        receipt_email: customerInfo.email,
        description: `Photo Retouching Service - ${serviceId.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`,
        statement_descriptor: 'KOLABO STUDIOS',
        // ✅ Additional security settings
        capture_method: 'automatic',
        confirmation_method: 'automatic',
      },
      { idempotencyKey },
    )

    console.log('Payment intent created successfully:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    // ✅ Comprehensive error handling with proper categorization
    if (error instanceof Stripe.errors.StripeError) {
      ErrorHandler.log({
        type: ErrorType.PAYMENT,
        message: 'Stripe API error',
        details: {
          type: error.type,
          code: error.code,
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        { error: `Payment error: ${error.message}` },
        { status: 400 }
      )
    }
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // ✅ Log unexpected errors
    ErrorHandler.log({
      type: ErrorType.UNKNOWN,
      message: 'Unexpected error in payment intent creation',
      details: error,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
