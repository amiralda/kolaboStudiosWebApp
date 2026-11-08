import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { createSupabaseServerClient } from "@/lib/database/supabase";
import {
  SESSION_COOKIE,
  getSessionSecret,
  verifySessionToken,
} from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login - Kolabo Studios",
  description: "Sign in to the Kolabo Studios admin area.",
};

export default async function AdminLoginPage() {
  // Already signed in? Go straight to the bookings list.
  const secret = getSessionSecret();
  if (secret) {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (token && (await verifySessionToken(token, secret))) {
      redirect("/admin/bookings");
    }
  }

  // Is the account system usable? (database + session secret)
  let systemReady = Boolean(secret);
  if (systemReady) {
    try {
      createSupabaseServerClient();
    } catch {
      systemReady = false;
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in with your Kolabo Studios admin account to view bookings
              and send estimates.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm systemReady={systemReady} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
