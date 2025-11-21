# Copilot Instructions — Kolabo Studios Web App

Brief, actionable guidance for AI coding agents working in this repo.

1) Big picture
- Framework: Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui.
- Entry points: `app/layout.tsx` (root layout + global mounts like `ContactFAB`), `app/page.tsx` (home).
- UI components live under `components/` and `components/ui/` (shadcn primitives).
- Central helpers & integrations live in `lib/` (e.g. `lib/api-client.ts`, `lib/stripe-config.ts`).

2) Key conventions & patterns
- App Router pages: use `app/<route>/page.tsx` for pages and `app/<route>/route.ts` or `app/api/*` for API endpoints.
- Only mount `ContactFAB` once at the root (`app/layout.tsx`) — duplicates cause duplicate dialogs.
- Single centralized API client: use `ApiClient` in `lib/api-client.ts`; it reads `NEXT_PUBLIC_API_URL` and returns `{ success, data }` shapes.
- Env vars: production/public values use `NEXT_PUBLIC_*` (see README for `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PHONE_E164`, etc.). Phone numbers should be E.164.

3) Integrations & important files
- Stripe: `lib/stripe-config.ts` (checks `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Server webhooks and payment intent logic live under `app/api/checkout`, `app/api/webhook`.
- Storage / file uploads: see `lib/storage.ts` and `app/api/files` / `app/api/upload` endpoints.
- Email/Resend and Google APIs: see `lib/*` and `api/` routes — prefer using existing helpers rather than adding duplicate clients.

4) Build / dev / testing workflows
- Local dev: `npm install` then `npm run dev` (Next dev server on `http://localhost:3000`). Repository uses `pnpm` on Vercel, but `npm` works locally.
- Build: `npm run build` (calls `next build`). Note: `next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` — CI may not fail on type/lint errors; run checks locally with `npm run lint` and `npx tsc --noEmit`.
- Bundle analysis: set `ANALYZE=true` to enable `@next/bundle-analyzer`.

5) Important Next config details to respect
- Images: `next.config.mjs` sets `unoptimized: true` and long cache TTL for `/images`. Don't assume automatic Next image optimization.
- CSP & headers: `contentSecurityPolicy` and custom headers are defined in `next.config.mjs` — follow them when adding script tags or external resources.

6) Coding patterns & examples
- API call from client: use `ApiClient.post('/payments', {...})` so errors use the `ApiError` wrapper and retry logic.
- Loading Stripe on client: import `stripePromise` from `lib/stripe-config.ts` and guard against `null` if publishable key missing.
- Add UI primitive: put shared building blocks in `components/ui/` and prefer shadcn primitives for consistent props.

7) Files worth reading first
- `app/layout.tsx` — where global providers and the `ContactFAB` are mounted.
- `app/globals.css` — global styles & animations (K dialog glass effect).
- `lib/api-client.ts`, `lib/stripe-config.ts`, `lib/storage.ts` — integration patterns.
- `next.config.mjs`, `package.json` — scripts, runtime flags, and optimizations.

8) When changing infra or env
- Update README env table and `next.config.mjs` comments when adding new `NEXT_PUBLIC_*` variables.
- For database schema changes, review `database/schema.sql` and `scripts/setup-database.sh`.

9) Non-goals / gotchas
- Do not assume type/lint build failures will block deploys — the config ignores them. Prefer fixing types and lint locally before merging.
- Images may be directly served from `/public/` and are cached aggressively; changing file names will require cache-busting.

If anything here looks incomplete or you want more examples (e.g., typical PR description, tests, or local debug steps), tell me which area to expand. 
