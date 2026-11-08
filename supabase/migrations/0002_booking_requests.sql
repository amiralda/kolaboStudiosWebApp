-- ============================================================================
-- Kolabo Studios — booking_requests table (2026-11-08 booking-flow change)
-- ============================================================================
-- The booking flow no longer charges at booking time: a visitor sends a
-- booking REQUEST (service, date/time, location, name, email, phone, shoot
-- details) and Dany follows up with the estimate + a deposit pay link.
-- This table stores those requests. Apply it the same way as 0001 (run it
-- in the Supabase SQL editor BEFORE relying on it).
--
-- Design (same as 0001):
--   * RLS is ENABLED and NO permissive policies are created, so by
--     default NOBODY can read or write through the API. The service_role
--     key bypasses RLS by design, so server-side writes go through
--     createSupabaseServerClient() with SUPABASE_SERVICE_ROLE_KEY only.
--   * Amounts are integer cents (matches 0001 convention).
--   * The /api/booking-request route treats the insert as best-effort:
--     if Supabase is not configured, the request is still delivered by
--     email and the insert error is only logged.
-- ============================================================================

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,
  name text not null,
  email text not null,
  phone text not null,
  service_key text not null,
  service_label text not null,
  date_iso text not null,
  location text not null,
  details text not null,
  full_price_cents integer not null,
  deposit_cents integer not null,
  status text not null default 'new'
    check (status in ('new', 'quoted', 'deposit_paid', 'booked', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.booking_requests enable row level security;
