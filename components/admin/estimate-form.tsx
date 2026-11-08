// components/admin/estimate-form.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface EstimateFormBooking {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  serviceLabel: string;
  formattedDate: string;
  location: string;
  fullPriceUsd: number;
  depositUsd: number;
}

/**
 * Step 3 of the booking-request flow (admin only, /admin/bookings).
 * Dany reviews the numbers, edits the message if needed, and sends the
 * estimate — the customer gets it from hello@ with a Stripe pay link
 * for the deposit. No payment is taken until the customer pays the link.
 */
export function EstimateForm({ booking }: { booking: EstimateFormBooking }) {
  const [fullPrice, setFullPrice] = React.useState(String(booking.fullPriceUsd));
  const [deposit, setDeposit] = React.useState(String(booking.depositUsd));
  const [message, setMessage] = React.useState(
    `Hi ${booking.customerName},\n\nThank you for your booking request! Here is your estimate for the ${booking.serviceLabel} session on ${booking.formattedDate} at ${booking.location}.\n\nFull price: $${booking.fullPriceUsd} — deposit to confirm your date: $${booking.depositUsd} (60%, non-refundable).\n\nYou can pay the deposit securely with the link below. Once paid, your date is reserved!\n\n— Dany, Kolabo Studios`
  );
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: "success" | "error"; message: string; paymentLinkUrl?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/send-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRef: booking.bookingRef,
          fullPriceUsd: Number(fullPrice),
          depositUsd: Number(deposit),
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // The pay link may already exist even when the email failed —
        // surface it so Dany can send it manually.
        setStatus({
          type: "error",
          message: data?.error || "Could not send the estimate.",
          paymentLinkUrl: data?.paymentLinkUrl as string | undefined,
        });
        return;
      }
      setStatus({
        type: "success",
        message: `Estimate sent to ${booking.customerEmail}.`,
        paymentLinkUrl: data.paymentLinkUrl as string | undefined,
      });
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (status?.type === "success") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        <p className="font-medium">✅ {status.message}</p>
        {status.paymentLinkUrl && (
          <p className="mt-2 break-all">
            Pay link:{" "}
            <a href={status.paymentLinkUrl} target="_blank" rel="noreferrer" className="underline">
              {status.paymentLinkUrl}
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`price-${booking.bookingRef}`}>Full price (USD)</Label>
          <Input
            id={`price-${booking.bookingRef}`}
            type="number"
            min={100}
            max={10000}
            value={fullPrice}
            onChange={(e) => setFullPrice(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`deposit-${booking.bookingRef}`}>Deposit (USD)</Label>
          <Input
            id={`deposit-${booking.bookingRef}`}
            type="number"
            min={50}
            max={10000}
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`message-${booking.bookingRef}`}>Message to the customer</Label>
        <Textarea
          id={`message-${booking.bookingRef}`}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {status && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {status.message}
          {status.paymentLinkUrl && (
            <p className="mt-2 break-all">
              Pay link (created — send it manually):{" "}
              <a href={status.paymentLinkUrl} target="_blank" rel="noreferrer" className="underline">
                {status.paymentLinkUrl}
              </a>
            </p>
          )}
        </div>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Sending…" : "Send estimate + pay link"}
      </Button>
    </form>
  );
}
