-- 0003_admin_users.sql — per-user admin accounts for the Kolabo Studios
-- admin area (Dany, 2026-11-08). Multiple people will use the dashboard,
-- so each admin signs in with their own email + password instead of the
-- single shared ADMIN_SECRET.
--
-- password_hash is null until the user sets a password through the setup
-- link emailed to them (48-hour token, sha256 hash stored — the raw token
-- is never stored). setup_token_* are cleared once the password is set.
--
-- RLS is enabled with NO permissive policies (mirrors 0001/0002): only
-- the service-role key (server-side code) may read or write this table.
-- Never expose it through the anon key.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text,
  role text not null default 'admin',
  setup_token_hash text,
  setup_token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

alter table public.admin_users enable row level security;
