-- ============================================================================
-- Kolabo Studios — Supabase RLS baseline (2026-11-07 security audit, Fix 7)
-- ============================================================================
-- Apply these migrations BEFORE enabling Supabase on the project.
-- DO NOT enable Supabase without them: the repo previously had no
-- migrations and no RLS policies, so the tables would have whatever RLS
-- the dashboard has — unverifiable from code.
--
-- Design:
--   * RLS is ENABLED on every table.
--   * NO permissive policies are created for the anon or authenticated
--     roles, so by default NOBODY can read or write through the API.
--     That is the safe default (deny-all).
--   * The service_role key bypasses RLS by design in Supabase, so all
--     server-side writes go through createSupabaseServerClient() with
--     SUPABASE_SERVICE_ROLE_KEY, which is server-side only and never in
--     the browser. Nothing in this migration grants the anon key any
--     access.
--   * When a public read is genuinely needed later (e.g. published
--     gallery photos, published blog posts), add ONE narrow policy per
--     case (e.g. SELECT on gallery_photos WHERE is_published = true)
--     and re-audit. Never add a blanket "allow all" policy.
--
-- Tables mirror lib/database/supabase.ts (DatabaseService) and the
-- contact route (contact_inquiries). Amounts are integer cents.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  last_name text,
  role text not null default 'client'
    check (role in ('client', 'admin', 'editor', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  company_name text,
  address text,
  city text,
  state text,
  zip_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  service_type text not null
    check (service_type in ('basic', 'standard', 'premium', 'custom')),
  total_amount integer not null default 0,
  description text,
  requirements text,
  rush_order boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  stripe_payment_intent_id text,
  amount integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  payment_method text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  filename text not null,
  original_filename text,
  file_type text not null
    check (file_type in ('image', 'video', 'document', 'archive')),
  file_size bigint not null default 0,
  mime_type text,
  storage_path text not null,
  uploaded_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  category text,
  storage_path text,
  url text,
  alt_text text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text,
  content text,
  author_id uuid references public.users (id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  shoot_type text,
  message text not null,
  source text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid,
  session_id text,
  page_url text,
  referrer text,
  user_agent text,
  ip_address text,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.email_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  subject text,
  template_name text,
  notification_type text not null
    check (notification_type in ('order_created', 'payment_received', 'order_completed', 'system_alert')),
  order_id uuid references public.orders (id) on delete set null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.system_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: deny-all by default on every table.
-- No policies are created for anon/authenticated, so API access is
-- denied unless a future migration adds a narrow, named policy.
-- service_role bypasses RLS (Supabase default) for server-side writes.
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.files enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.analytics_events enable row level security;
alter table public.email_notifications enable row level security;
alter table public.system_settings enable row level security;
