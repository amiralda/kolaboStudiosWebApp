import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InviteUserForm } from "@/components/admin/invite-user-form";
import { LogoutButton } from "@/components/admin/logout-button";
import { listAdminUsers } from "@/lib/auth/admin-users";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Accounts - Kolabo Studios",
  description: "Manage who can sign in to the Kolabo Studios admin area.",
};

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof listAdminUsers>> | null = null;
  let storageError: string | null = null;

  try {
    users = await listAdminUsers();
  } catch {
    storageError =
      "Admin accounts are not set up on this server yet. The site database still needs to be connected.";
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold font-sora">Admin Accounts</h1>
            <p className="text-muted-foreground">
              Who can sign in to the admin area. Invite more Kolabo staff
              here — each person sets their own password.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/bookings" className="text-sm underline">
              ← Booking requests
            </Link>
            <LogoutButton />
          </div>
        </div>

        {storageError ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-sm">
                {storageError}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Invite someone</CardTitle>
                <p className="text-sm text-muted-foreground">
                  They will get an email with a setup link (valid 48 hours) to
                  choose their own password.
                </p>
              </CardHeader>
              <CardContent>
                <InviteUserForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accounts ({users?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {!users || users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No admin accounts yet. Once the first account is created,
                    it will appear here.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {users.map((u) => (
                      <li key={u.id} className="py-3 flex flex-wrap items-center gap-2">
                        <span className="font-medium">{u.email}</span>
                        <Badge variant="outline">{u.role}</Badge>
                        {u.password_hash ? (
                          <Badge>Active</Badge>
                        ) : (
                          <Badge variant="secondary">Invite sent — awaiting setup</Badge>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {u.last_login_at
                            ? `Last sign-in: ${new Date(u.last_login_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                            : "Never signed in"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
