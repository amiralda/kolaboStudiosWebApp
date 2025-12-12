import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Singleton pattern for client-side Supabase client
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function createSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'kolabo-studios-web',
        },
      },
    })
  }

  return supabaseClient
}

// Server-side Supabase client with service role key
export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  })
}

// Database helper functions
export class DatabaseService {
  private supabase: ReturnType<typeof createSupabaseClient>

  constructor(useServerClient = false) {
    this.supabase = useServerClient ? createSupabaseServerClient() : createSupabaseClient()
  }

  // User management
  async createUser(userData: {
    email: string
    firstName: string
    lastName: string
    role?: 'client' | 'admin' | 'editor' | 'super_admin'
  }) {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role || 'client',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Client management
  async createClient(clientData: {
    userId: string
    companyName?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    notes?: string
  }) {
    const { data, error } = await this.supabase
      .from('clients')
      .insert({
        user_id: clientData.userId,
        company_name: clientData.companyName,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zipCode,
        notes: clientData.notes,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Order management
  async createOrder(orderData: {
    clientId: string
    serviceType: 'basic' | 'standard' | 'premium' | 'custom'
    totalAmount: number
    description?: string
    requirements?: string
    rushOrder?: boolean
  }) {
    const { data, error } = await this.supabase
      .from('orders')
      .insert({
        client_id: orderData.clientId,
        service_type: orderData.serviceType,
        total_amount: orderData.totalAmount,
        description: orderData.description,
        requirements: orderData.requirements,
        rush_order: orderData.rushOrder || false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getOrderById(orderId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        client:clients(
          *,
          user:users(*)
        ),
        payments(*),
        files(*)
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  }

  async getOrdersByClient(clientId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        payments(*),
        files(count)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Payment management
  async createPayment(paymentData: {
    orderId: string
    stripePaymentIntentId: string
    amount: number
    status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
    paymentMethod?: string
  }) {
    const { data, error } = await this.supabase
      .from('payments')
      .insert({
        order_id: paymentData.orderId,
        stripe_payment_intent_id: paymentData.stripePaymentIntentId,
        amount: paymentData.amount,
        status: paymentData.status,
        payment_method: paymentData.paymentMethod,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updatePaymentStatus(paymentIntentId: string, status: string, failureReason?: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .update({
        status: status as any,
        failure_reason: failureReason,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // File management
  async createFile(fileData: {
    orderId: string
    filename: string
    originalFilename: string
    fileType: 'image' | 'video' | 'document' | 'archive'
    fileSize: number
    mimeType: string
    storagePath: string
    uploadedBy: string
  }) {
    const { data, error } = await this.supabase
      .from('files')
      .insert({
        order_id: fileData.orderId,
        filename: fileData.filename,
        original_filename: fileData.originalFilename,
        file_type: fileData.fileType,
        file_size: fileData.fileSize,
        mime_type: fileData.mimeType,
        storage_path: fileData.storagePath,
        uploaded_by: fileData.uploadedBy,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Gallery management
  async getGalleryPhotos(category?: string, limit = 50) {
    let query = this.supabase
      .from('gallery_photos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  async getFeaturedPhotos(limit = 6) {
    const { data, error } = await this.supabase
      .from('gallery_photos')
      .select('*')
      .eq('is_featured', true)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Blog management
  async getBlogPosts(limit = 10) {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        author:users(first_name, last_name)
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        author:users(first_name, last_name)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) throw error
    return data
  }

  // Analytics
  async trackEvent(eventData: {
    eventName: string
    userId?: string
    sessionId?: string
    pageUrl?: string
    referrer?: string
    userAgent?: string
    ipAddress?: string
    properties?: Record<string, any>
  }) {
    const { data, error } = await this.supabase
      .from('analytics_events')
      .insert({
        event_name: eventData.eventName,
        user_id: eventData.userId,
        session_id: eventData.sessionId,
        page_url: eventData.pageUrl,
        referrer: eventData.referrer,
        user_agent: eventData.userAgent,
        ip_address: eventData.ipAddress,
        properties: eventData.properties || {},
      })

    if (error) throw error
    return data
  }

  // System settings
  async getSetting(key: string) {
    const { data, error } = await this.supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.value
  }

  async updateSetting(key: string, value: string) {
    const { data, error } = await this.supabase
      .from('system_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Email notifications
  async logEmailNotification(notificationData: {
    recipientEmail: string
    subject: string
    templateName: string
    notificationType: 'order_created' | 'payment_received' | 'order_completed' | 'system_alert'
    orderId?: string
    status?: string
  }) {
    const { data, error } = await this.supabase
      .from('email_notifications')
      .insert({
        recipient_email: notificationData.recipientEmail,
        subject: notificationData.subject,
        template_name: notificationData.templateName,
        notification_type: notificationData.notificationType,
        order_id: notificationData.orderId,
        status: notificationData.status || 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Health check
  async healthCheck() {
    try {
      const { data, error } = await this.supabase
        .from('system_settings')
        .select('key')
        .limit(1)

      if (error) throw error
      return { status: 'healthy', timestamp: new Date().toISOString() }
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unknown error'
      return { status: 'unhealthy', error: detail, timestamp: new Date().toISOString() }
    }
  }
}

// Export default instance
export const db = new DatabaseService()
export const serverDb: DatabaseService | null = (() => {
  try {
    return new DatabaseService(true)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase server client not initialized:', error)
    }
    return null
  }
})()
