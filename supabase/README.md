# Supabase migrations — Kolabo Studios

## Rule

**Do NOT enable Supabase on this project without applying these migrations first.**

The repo previously had no SQL migrations and no RLS policies. If Supabase
were switched on as-is, the tables would have whatever RLS the dashboard
has — unverifiable from code.

## What is here

- `migrations/0001_enable_rls_deny_all.sql` — creates every table used by
  `lib/database/supabase.ts` and the contact route, enables Row Level
  Security on all of them, and creates **no** permissive policies for the
  `anon` or `authenticated` roles. Default is deny-all.
- The `service_role` key bypasses RLS by design in Supabase, so all
  server-side reads/writes keep working through
  `createSupabaseServerClient()` (`SUPABASE_SERVICE_ROLE_KEY`, server-side
  only, never in the browser).

## How to apply (when Supabase is enabled)

```bash
# From the Supabase dashboard: SQL Editor -> paste the migration file.
# Or with the Supabase CLI:
supabase db push
```

## How to verify deny-all works

After applying, run as the `anon` role (e.g. with the anon key):

```sql
select * from public.users;      -- expect: 0 rows (denied, not an error)
select * from public.orders;     -- expect: 0 rows
select * from public.files;      -- expect: 0 rows
select * from public.payments;   -- expect: 0 rows
select * from public.clients;    -- expect: 0 rows
```

If any of those return rows, a permissive policy exists somewhere — find
it and remove it before going live.

## Adding a public read later

If a public read is genuinely needed (e.g. published gallery photos),
add ONE narrow policy per case in a new migration, for example:

```sql
create policy "public can read published gallery photos"
  on public.gallery_photos for select
  using (is_published = true);
```

Then re-audit. Never add a blanket "allow all" policy.
