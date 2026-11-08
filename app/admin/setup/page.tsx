import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetupForm } from "@/components/admin/setup-form";
import {
  findAdminUserByEmail,
  isSetupTokenValid,
} from "@/lib/auth/admin-users";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Set Up Your Admin Account - Kolabo Studios",
  description: "Choose a password for your Kolabo Studios admin account.",
};

export default async function AdminSetupPage({
  searchParams,
}: {
  searchParams: { token?: string; email?: string };
}) {
  const token = (searchParams.token ?? "").trim();
  const email = (searchParams.email ?? "").trim();

  let error: string | null = null;
  if (!token || !email) {
    error = "This setup link is incomplete. Ask another admin to send you a new invite.";
  } else {
    try {
      const user = await findAdminUserByEmail(email);
      if (!user || !isSetupTokenValid(user, token)) {
        error =
          "This setup link is invalid or has expired. Ask another admin to send you a new invite from the admin area.";
      }
    } catch {
      error =
        "Admin accounts are not set up on this server yet. The site database still needs to be connected.";
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Set up your admin account</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : (
              <SetupForm email={email} token={token} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
