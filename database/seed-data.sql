-- =====================================================
-- KOLABO STUDIOS SEED DATA
-- Sample data for development and testing
-- =====================================================

-- Insert sample users
INSERT INTO users (id, email, first_name, last_name, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@kolabostudios.com', 'Admin', 'User', 'super_admin', '(555) 123-4567'),
('550e8400-e29b-41d4-a716-446655440002', 'photographer@kolabostudios.com', 'Jane', 'Smith', 'admin', '(555) 123-4568'),
('550e8400-e29b-41d4-a716-446655440003', 'editor@kolabostudios.com', 'Mike', 'Johnson', 'editor', '(555) 123-4569'),
('550e8400-e29b-41d4-a716-446655440004', 'client1@example.com', 'Sarah', 'Wilson', 'client', '(555) 987-6543'),
('550e8400-e29b-41d4-a716-446655440005', 'client2@example.com', 'David', 'Brown', 'client', '(555) 987-6544');

-- Insert sample clients
INSERT INTO clients (id, user_id, company_name, address, city, state, zip_code) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Wilson Events', '123 Main St', 'Los Angeles', 'CA', '90210'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Brown Photography', '456 Oak Ave', 'Beverly Hills', 'CA', '90211');

-- Insert sample gallery photos
INSERT INTO gallery_photos (title, description, category, image_url, thumbnail_url, alt_text, is_featured, sort_order) VALUES
('Sunset Wedding Dance', 'Beautiful couple dancing at sunset', 'weddings', '/wedding-dance-sunset.png', '/wedding-dance-sunset.png', 'Couple dancing at sunset wedding', true, 1),
('Elegant Bride Portrait', 'Stunning bridal portrait in natural light', 'weddings', '/elegant-bride-portrait.png', '/elegant-bride-portrait.png', 'Elegant bride portrait', true, 2),
('Romantic Engagement', 'Couple sharing intimate moment', 'engagement', '/romantic-engagement-couple.png', '/romantic-engagement-couple.png', 'Romantic engagement photo', true, 3),
('Maternity Glow', 'Beautiful expecting mother', 'maternity', '/beautiful-maternity-photo.png', '/beautiful-maternity-photo.png', 'Beautiful maternity photo', true, 4),
('Family Mini Session', 'Fun family portrait session', 'minis', '/family-mini-session.png', '/family-mini-session.png', 'Family mini session', false, 5),
('Holiday Family', 'Festive family gathering', 'holiday_minis', '/holiday-family-session.png', '/holiday-family-session.png', 'Holiday family session', false, 6);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image_url, author_id, is_published, published_at, reading_time, seo_title, seo_description) VALUES
('Planning Your Perfect Wedding Photography', 'planning-perfect-wedding-photography', 'Essential tips for couples planning their wedding photography', 
'# Planning Your Perfect Wedding Photography

Your wedding day is one of the most important days of your life, and capturing those precious moments is crucial. Here are our top tips for planning your perfect wedding photography...

## 1. Start Early
Begin your search for a photographer at least 6-8 months before your wedding date. The best photographers book up quickly, especially during peak wedding season.

## 2. Define Your Style
Look through different photography styles and determine what resonates with you. Do you prefer:
- Traditional and posed shots
- Candid and photojournalistic style
- Fine art and creative compositions
- A mix of all styles

## 3. Set Your Budget
Photography typically accounts for 10-15% of your total wedding budget. Remember, these photos will last a lifetime, so invest wisely.

## 4. Meet Your Photographer
Schedule an engagement session or consultation to ensure you connect with your photographer personally. You''ll be spending your entire wedding day with them!

## 5. Plan Your Timeline
Work with your photographer to create a detailed timeline that allows for all the shots you want while keeping stress levels low.

Remember, your wedding photos will be treasured for generations. Choose a photographer who understands your vision and can capture the essence of your love story.',
'/wedding-dance-sunset.png', '550e8400-e29b-41d4-a716-446655440002', true, NOW() - INTERVAL '7 days', 5,
'Planning Your Perfect Wedding Photography | Kolabo Studios', 'Essential tips and advice for couples planning their wedding photography. Learn how to choose the right photographer and create stunning wedding memories.'),

('The Art of Maternity Photography', 'art-of-maternity-photography', 'Capturing the beauty and emotion of pregnancy', 
'# The Art of Maternity Photography

Pregnancy is a magical time filled with anticipation, love, and incredible changes. Maternity photography captures this special chapter in your life, creating lasting memories of your journey to parenthood...

## When to Schedule Your Session
The ideal time for maternity photos is between 28-36 weeks of pregnancy. At this stage:
- Your bump is beautifully rounded
- You''re still comfortable moving around
- You have that pregnancy glow
- You''re not too close to your due date

## What to Wear
Choose outfits that:
- Accentuate your bump
- Make you feel confident and beautiful
- Coordinate with your partner''s clothing
- Work well with your chosen location

## Location Ideas
- Natural outdoor settings like parks or beaches
- Your nursery or home
- Urban environments with interesting architecture
- Studio settings with professional lighting

## Including Your Partner
Maternity sessions are perfect for capturing the connection between you and your partner as you prepare to welcome your little one.

Let us help you create beautiful memories of this incredible time in your life.',
'/beautiful-maternity-photo.png', '550e8400-e29b-41d4-a716-446655440002', true, NOW() - INTERVAL '14 days', 4,
'The Art of Maternity Photography | Kolabo Studios', 'Discover the beauty of maternity photography and learn how to capture stunning photos during pregnancy. Professional maternity photography tips and ideas.');

-- Insert sample contact inquiries
INSERT INTO contact_inquiries (name, email, phone, shoot_type, preferred_date, message, source, status) VALUES
('Emily Johnson', 'emily.johnson@email.com', '(555) 234-5678', 'Wedding', '2024-06-15', 'Hi! We''re getting married next summer and would love to discuss photography packages. Our wedding will be at Malibu Beach Club.', 'website', 'new'),
('Michael Chen', 'michael.chen@email.com', '(555) 345-6789', 'Engagement', '2024-03-20', 'Looking for an engagement photographer for a session in Griffith Observatory. We love your style!', 'instagram', 'contacted'),
('Lisa Rodriguez', 'lisa.rodriguez@email.com', '(555) 456-7890', 'Maternity', '2024-02-10', 'I''m 32 weeks pregnant and would like to schedule a maternity session. Preferably outdoors with natural lighting.', 'referral', 'quoted');

-- Insert sample orders
INSERT INTO orders (id, client_id, service_type, total_amount, description, requirements, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'premium_retouch', 299.99, 'Wedding photo retouching package', 'Color correction, skin smoothing, background cleanup for 50 photos', 'completed'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'standard_retouch', 149.99, 'Portrait retouching', 'Basic retouching for 20 portrait photos', 'in_progress');

-- Insert sample payments
INSERT INTO payments (order_id, stripe_payment_intent_id, amount, status, payment_method, processed_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'pi_test_1234567890', 299.99, 'succeeded', 'card', NOW() - INTERVAL '5 days'),
('770e8400-e29b-41d4-a716-446655440002', 'pi_test_0987654321', 149.99, 'succeeded', 'card', NOW() - INTERVAL '2 days');

-- Insert sample files
INSERT INTO files (order_id, filename, original_filename, file_type, file_size, mime_type, storage_path, uploaded_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'wedding_001_processed.jpg', 'IMG_001.jpg', 'image', 2048576, 'image/jpeg', '/uploads/wedding_001_processed.jpg', '550e8400-e29b-41d4-a716-446655440004'),
('770e8400-e29b-41d4-a716-446655440001', 'wedding_002_processed.jpg', 'IMG_002.jpg', 'image', 1843200, 'image/jpeg', '/uploads/wedding_002_processed.jpg', '550e8400-e29b-41d4-a716-446655440004');

-- Insert sample email notifications
INSERT INTO email_notifications (recipient_email, subject, template_name, notification_type, order_id, status, sent_at) VALUES
('client1@example.com', 'Order Confirmation - KS20240115001', 'order_confirmation', 'order_created', '770e8400-e29b-41d4-a716-446655440001', 'sent', NOW() - INTERVAL '5 days'),
('client1@example.com', 'Payment Received - KS20240115001', 'payment_confirmation', 'payment_received', '770e8400-e29b-41d4-a716-446655440001', 'sent', NOW() - INTERVAL '5 days'),
('client2@example.com', 'Order Confirmation - KS20240116001', 'order_confirmation', 'order_created', '770e8400-e29b-41d4-a716-446655440002', 'sent', NOW() - INTERVAL '2 days');

-- Insert sample analytics events
INSERT INTO analytics_events (event_name, page_url, user_agent, properties) VALUES
('page_view', '/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"referrer": "google.com", "session_duration": 120}'),
('page_view', '/galleries', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', '{"referrer": "instagram.com", "session_duration": 45}'),
('contact_form_submit', '/contact', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '{"form_type": "contact", "shoot_type": "wedding"}'),
('gallery_photo_view', '/galleries/weddings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"photo_id": "sunset-wedding-dance", "category": "weddings"}');

-- Update view counts for blog posts and gallery photos
UPDATE blog_posts SET view_count = 156 WHERE slug = 'planning-perfect-wedding-photography';
UPDATE blog_posts SET view_count = 89 WHERE slug = 'art-of-maternity-photography';

UPDATE gallery_photos SET view_count = 234 WHERE title = 'Sunset Wedding Dance';
UPDATE gallery_photos SET view_count = 189 WHERE title = 'Elegant Bride Portrait';
UPDATE gallery_photos SET view_count = 167 WHERE title = 'Romantic Engagement';
UPDATE gallery_photos SET view_count = 145 WHERE title = 'Maternity Glow';
