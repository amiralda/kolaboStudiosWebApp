import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/database/supabase";
import { EstimateForm, type EstimateFormBooking } from "@/components/admin/estimate-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Booking Requests - Kolabo Studios Admin",
  description: "Review booking requests and send estimates with a deposit pay link.",
};

function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function formatDate(iso?: string | null): string {
  if (!iso) return "Not specified";
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  quoted: "Estimate sent",
  deposit_paid: "Deposit paid",
  booked: "Booked",
  closed: "Closed",
};

export default async function AdminBookingsPage() {
  let bookings: Array<Record<string, unknown>> | null = null;
  let storageError: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      storageError = error.message;
    } else {
      bookings = (data ?? []) as Array<Record<string, unknown>>;
    }
  } catch {
    storageError = "Supabase is not configured on this server.";
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sora">Booking Requests</h1>
          <p className="text-muted-foreground">
            New requests arrive here and by email. Send the estimate — the customer gets it with a link to pay the 60% deposit.
          </p>
        </div>

        {storageError && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="font-medium">Booking storage is not set up yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                {storageError} New booking requests still arrive by email at hello@kolabostudios.com — reply there with the
                estimate and a Stripe Payment Link until storage is configured (set the Supabase variables in Vercel and apply
                supabase/migrations/0002_booking_requests.sql).
              </p>
            </CardContent>
          </Card>
        )}

        {bookings && bookings.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No booking requests yet. New requests from /booking will appear here.</p>
            </CardContent>
          </Card>
        )}

        {bookings?.map((b) => {
          const status = String(b.status ?? "new");
          const depositUsd = Math.round(Number(b.deposit_cents ?? 0) / 100);
          const fullUsd = Math.round(Number(b.full_price_cents ?? 0) / 100);
          const estimateBooking: EstimateFormBooking = {
            bookingRef: String(b.booking_ref ?? ""),
            customerName: String(b.name ?? ""),
            customerEmail: String(b.email ?? ""),
            serviceLabel: String(b.service_label ?? ""),
            formattedDate: formatDate(typeof b.date_iso === "string" ? b.date_iso : null),
            location: String(b.location ?? ""),
            fullPriceUsd: fullUsd,
            depositUsd,
          };
          return (
            <Card key={String(b.booking_ref ?? b.id)} className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">
                    {String(b.service_label ?? "")} — {String(b.name ?? "")}
                  </CardTitle>
                  <Badge variant={status === "new" ? "default" : "secondary"}>
                    {STATUS_LABELS[status] ?? status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ref: <code>{String(b.booking_ref ?? "")}</code> • Received{" "}
                  {typeof b.created_at === "string"
                    ? new Date(b.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
                    : ""}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a className="underline" href={`mailto:${String(b.email ?? "")}`}>
                      {String(b.email ?? "")}
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a className="underline" href={`tel:${String(b.phone ?? "")}`}>
                      {String(b.phone ?? "")}
                    </a>
                  </p>
                  <p>
                    <strong>Date &amp; time:</strong> {formatDate(typeof b.date_iso === "string" ? b.date_iso : null)}
                  </p>
                  <p>
                    <strong>Location:</strong> {String(b.location ?? "")}
                  </p>
                  <p>
                    <strong>Full price:</strong> {formatUSD(Number(b.full_price_cents ?? 0))}
                  </p>
                  <p>
                    <strong>Deposit (60%):</strong> {formatUSD(Number(b.deposit_cents ?? 0))}
                  </p>
                </div>
                <div className="text-sm">
                  <strong>What they need:</strong>
                  <p className="whitespace-pre-wrap text-muted-foreground mt-1">{String(b.details ?? "")}</p>
                </div>
                {status === "new" ? (
                  <EstimateForm booking={estimateBooking} />
                ) : (
                  <p className="text-sm text-muted-foreground border-t pt-4">
                    Estimate already sent for this request. If you need to resend it, reply to the customer directly at{" "}
                    <a className="underline" href={`mailto:${String(b.email ?? "")}`}>
                      {String(b.email ?? "")}
                    </a>
                    .
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
