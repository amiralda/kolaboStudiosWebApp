-- =====================================================
-- KOLABO STUDIOS DATABASE SCHEMA
-- Complete PostgreSQL schema for production
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('super_admin', 'admin', 'editor', 'client')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table (extends users for client-specific data)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(200),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  website VARCHAR(255),
  notes TEXT,
  preferred_contact_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ORDERS & PAYMENTS
-- =====================================================

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('basic_retouch', 'standard_retouch', 'premium_retouch', 'custom_service')),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'awaiting_payment', 'paid', 'in_progress', 'review', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  requirements TEXT,
  rush_order BOOLEAN DEFAULT false,
  rush_fee DECIMAL(10,2) DEFAULT 0,
  estimated_completion_date DATE,
  actual_completion_date DATE,
  client_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
  payment_method VARCHAR(50),
  failure_reason TEXT,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  refund_reason TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FILE MANAGEMENT
-- =====================================================

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(20) CHECK (file_type IN ('image', 'video', 'document', 'archive')),
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  storage_path TEXT NOT NULL,
  storage_provider VARCHAR(20) DEFAULT 'vercel_blob' CHECK (storage_provider IN ('vercel_blob', 'aws_s3', 'local')),
  is_processed BOOLEAN DEFAULT false,
  processing_status VARCHAR(30) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GALLERY & CONTENT
-- =====================================================

-- Gallery photos table
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('weddings', 'engagement', 'maternity', 'minis', 'holiday_minis', 'portraits')),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(300) NOT NULL,
  slug VARCHAR(300) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  seo_title VARCHAR(300),
  seo_description VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMMUNICATIONS
-- =====================================================

-- Contact inquiries table
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(200),
  shoot_type VARCHAR(100),
  preferred_date DATE,
  message TEXT NOT NULL,
  source VARCHAR(50), -- website, referral, social, etc.
  status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'closed')),
  assigned_to UUID REFERENCES users(id),
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email notifications table
CREATE TABLE email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('order_created', 'payment_received', 'order_completed', 'system_alert', 'marketing')),
  order_id UUID REFERENCES orders(id),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & MONITORING
-- =====================================================

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System settings table
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Orders indexes
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Payments indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_stripe_id ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Files indexes
CREATE INDEX idx_files_order_id ON files(order_id);
CREATE INDEX idx_files_type ON files(file_type);
CREATE INDEX idx_files_processing_status ON files(processing_status);

-- Gallery indexes
CREATE INDEX idx_gallery_category ON gallery_photos(category);
CREATE INDEX idx_gallery_featured ON gallery_photos(is_featured);
CREATE INDEX idx_gallery_published ON gallery_photos(is_published);
CREATE INDEX idx_gallery_sort_order ON gallery_photos(sort_order);

-- Blog indexes
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_published ON blog_posts(is_published);
CREATE INDEX idx_blog_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_author ON blog_posts(author_id);

-- Contact inquiries indexes
CREATE INDEX idx_contact_status ON contact_inquiries(status);
CREATE INDEX idx_contact_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX idx_contact_email ON contact_inquiries(email);

-- Analytics indexes
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_blog_search ON blog_posts USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_gallery_search ON gallery_photos USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_photos_updated_at BEFORE UPDATE ON gallery_photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ORDER NUMBER GENERATION
-- =====================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'KS' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_sequence')::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_sequence START 1;
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- RLS Policies for clients
CREATE POLICY "Clients can view their own data" ON clients FOR SELECT USING (
  user_id::text = auth.uid()::text
);
CREATE POLICY "Admins can view all clients" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- RLS Policies for orders
CREATE POLICY "Clients can view their own orders" ON orders FOR SELECT USING (
  client_id IN (SELECT id FROM clients WHERE user_id::text = auth.uid()::text)
);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- Public access for gallery and blog
CREATE POLICY "Gallery photos are publicly viewable" ON gallery_photos FOR SELECT USING (is_published = true);
CREATE POLICY "Blog posts are publicly viewable" ON blog_posts FOR SELECT USING (is_published = true);

-- System settings public access
CREATE POLICY "Public settings are viewable" ON system_settings FOR SELECT USING (is_public = true);

-- =====================================================
-- INITIAL SYSTEM SETTINGS
-- =====================================================

INSERT INTO system_settings (key, value, description, is_public) VALUES
('site_name', 'Kolabo Studios', 'Website name', true),
('site_description', 'Professional Photography Services', 'Website description', true),
('contact_email', 'hello@kolabostudios.com', 'Main contact email', true),
('contact_phone', '(555) 123-4567', 'Main contact phone', true),
('business_address', '123 Photography Lane, Studio City, CA 90210', 'Business address', true),
('social_instagram', 'https://instagram.com/kolabostudios', 'Instagram URL', true),
('social_facebook', 'https://facebook.com/kolabostudios', 'Facebook URL', true),
('booking_enabled', 'true', 'Enable online booking', false),
('maintenance_mode', 'false', 'Site maintenance mode', false),
('max_file_size', '50000000', 'Max file upload size in bytes (50MB)', false),
('allowed_file_types', 'jpg,jpeg,png,gif,tiff,raw,cr2,nef,arw', 'Allowed file extensions', false);
