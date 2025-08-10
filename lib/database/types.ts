export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: "client" | "admin" | "editor" | "super_admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role?: "client" | "admin" | "editor" | "super_admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: "client" | "admin" | "editor" | "super_admin"
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          service_type: string
          status: "pending" | "processing" | "completed" | "cancelled"
          amount: number
          stripe_payment_intent_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          service_type: string
          status?: "pending" | "processing" | "completed" | "cancelled"
          amount: number
          stripe_payment_intent_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          service_type?: string
          status?: "pending" | "processing" | "completed" | "cancelled"
          amount?: number
          stripe_payment_intent_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          stripe_payment_intent_id: string
          amount: number
          status: "pending" | "succeeded" | "failed" | "cancelled" | "refunded"
          payment_method: string | null
          failure_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          stripe_payment_intent_id: string
          amount: number
          status: "pending" | "succeeded" | "failed" | "cancelled" | "refunded"
          payment_method?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          stripe_payment_intent_id?: string
          amount?: number
          status?: "pending" | "succeeded" | "failed" | "cancelled" | "refunded"
          payment_method?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          order_id: string
          filename: string
          original_filename: string
          file_type: "image" | "video" | "document" | "archive"
          file_size: number
          mime_type: string
          storage_path: string
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          filename: string
          original_filename: string
          file_type: "image" | "video" | "document" | "archive"
          file_size: number
          mime_type: string
          storage_path: string
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          filename?: string
          original_filename?: string
          file_type?: "image" | "video" | "document" | "archive"
          file_size?: number
          mime_type?: string
          storage_path?: string
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      gallery_photos: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          category: string
          is_featured: boolean
          is_published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          category: string
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          category?: string
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          author_id: string
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          author_id: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          author_id?: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_name: string
          user_id: string | null
          session_id: string | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          properties: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          event_name: string
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          properties?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          event_name?: string
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          properties?: Record<string, any> | null
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      email_notifications: {
        Row: {
          id: string
          recipient_email: string
          subject: string
          template_name: string
          notification_type: "order_created" | "payment_received" | "order_completed" | "system_alert"
          order_id: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipient_email: string
          subject: string
          template_name: string
          notification_type: "order_created" | "payment_received" | "order_completed" | "system_alert"
          order_id?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipient_email?: string
          subject?: string
          template_name?: string
          notification_type?: "order_created" | "payment_received" | "order_completed" | "system_alert"
          order_id?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          title: string
          description?: string
          imageUrl: string
          category: "wedding" | "engagement" | "maternity" | "minis" | "holiday-minis"
          tags: string[]
          featured: boolean
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          title: string
          description?: string
          imageUrl: string
          category: "wedding" | "engagement" | "maternity" | "minis" | "holiday-minis"
          tags?: string[]
          featured?: boolean
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          title?: string
          description?: string
          imageUrl?: string
          category?: "wedding" | "engagement" | "maternity" | "minis" | "holiday-minis"
          tags?: string[]
          featured?: boolean
          createdAt?: Date
          updatedAt?: Date
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          message: string
          type: "general" | "booking" | "retouch"
          createdAt: Date
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          message: string
          type?: "general" | "booking" | "retouch"
          createdAt?: Date
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          type?: "general" | "booking" | "retouch"
          createdAt?: Date
        }
      }
      retouch_orders: {
        Row: {
          id: string
          customerName: string
          customerEmail: string
          service: string
          quantity: number
          totalAmount: number
          status: "pending" | "processing" | "completed" | "cancelled"
          paymentIntentId?: string
          uploadUrl?: string
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          customerName: string
          customerEmail: string
          service: string
          quantity: number
          totalAmount: number
          status: "pending" | "processing" | "completed" | "cancelled"
          paymentIntentId?: string
          uploadUrl?: string
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          customerName?: string
          customerEmail?: string
          service?: string
          quantity?: number
          totalAmount?: number
          status?: "pending" | "processing" | "completed" | "cancelled"
          paymentIntentId?: string
          uploadUrl?: string
          createdAt?: Date
          updatedAt?: Date
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          message: string
          service_type?: string
          created_at: string
          status: "new" | "contacted" | "completed"
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          message: string
          service_type?: string
          created_at?: string
          status?: "new" | "contacted" | "completed"
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          service_type?: string
          created_at?: string
          status?: "new" | "contacted" | "completed"
        }
      }
      order_files: {
        Row: {
          id: string
          order_id: string
          file_name: string
          file_url: string
          file_size: number
          file_type: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          file_name: string
          file_url: string
          file_size: number
          file_type: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          file_name?: string
          file_url?: string
          file_size?: number
          file_type?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
