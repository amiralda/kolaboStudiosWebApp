/**
 * Admin-user database helpers (per-user accounts).
 *
 * Node.js runtime only — used by API routes and server components.
 * All queries go through the service-role client (RLS has no permissive
 * policies on admin_users, so only server-side code can touch it).
 */
import { createSupabaseServerClient } from "@/lib/database/supabase"
import { hashSetupToken, makeSetupToken } from "@/lib/auth/passwords"

export interface AdminUserRow {
  id: string
  email: string
  password_hash: string | null
  role: string
  setup_token_hash: string | null
  setup_token_expires_at: string | null
  created_at: string
  updated_at: string
  last_login_at: string | null
}

export const SETUP_TOKEN_TTL_HOURS = 48

export function getAdminUsersClient() {
  return createSupabaseServerClient()
}

export async function findAdminUserByEmail(
  email: string
): Promise<AdminUserRow | null> {
  const supabase = getAdminUsersClient()
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .single()
  if (error || !data) return null
  return data as unknown as AdminUserRow
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = getAdminUsersClient()
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as AdminUserRow[]
}

/** Create (or re-invite) an admin user and return the raw setup token. */
export async function inviteAdminUser(email: string): Promise<{
  user: AdminUserRow
  setupToken: string
}> {
  const normalized = email.toLowerCase().trim()
  const setupToken = makeSetupToken()
  const expiresAt = new Date(
    Date.now() + SETUP_TOKEN_TTL_HOURS * 60 * 60 * 1000
  ).toISOString()
  const supabase = getAdminUsersClient()

  const existing = await findAdminUserByEmail(normalized)
  if (existing) {
    if (existing.password_hash) {
      throw new Error("This email already has an admin account.")
    }
    const { data, error } = await supabase
      .from("admin_users")
      .update({
        setup_token_hash: hashSetupToken(setupToken),
        setup_token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("*")
      .single()
    if (error || !data) throw new Error(error?.message ?? "Could not re-send the invite.")
    return { user: data as unknown as AdminUserRow, setupToken }
  }

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      email: normalized,
      role: "admin",
      setup_token_hash: hashSetupToken(setupToken),
      setup_token_expires_at: expiresAt,
    })
    .select("*")
    .single()
  if (error || !data) throw new Error(error?.message ?? "Could not create the admin account.")
  return { user: data as unknown as AdminUserRow, setupToken }
}

/** True when the emailed setup link is still usable for this account. */
export function isSetupTokenValid(
  user: AdminUserRow,
  token: string
): boolean {
  if (!user.setup_token_hash || !user.setup_token_expires_at) return false
  if (new Date(user.setup_token_expires_at).getTime() <= Date.now()) return false
  return hashSetupToken(token) === user.setup_token_hash
}

/** Set the user's password from a valid setup token; clears the token. */
export async function completeAdminSetup(
  user: AdminUserRow,
  passwordHash: string
): Promise<void> {
  const supabase = getAdminUsersClient()
  const { error } = await supabase
    .from("admin_users")
    .update({
      password_hash: passwordHash,
      setup_token_hash: null,
      setup_token_expires_at: null,
      last_login_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
  if (error) throw new Error(error.message)
}

export async function touchAdminLogin(userId: string): Promise<void> {
  try {
    const supabase = getAdminUsersClient()
    await supabase
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", userId)
  } catch {
    // Best-effort only — a failed timestamp update must never block login.
  }
}

export function buildSetupUrl(email: string, token: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://kolabostudios.com"
  return `${base.replace(/\/$/, "")}/admin/setup?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(email)}`
}
