// components/admin/booking-status-button.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Admin-only action on /admin/bookings: Dany marks a booking confirmed
 * ("booked") and its date becomes unavailable on /booking
 * (no-double-booking rule). "Closed" closes a request without blocking
 * its date.
 */
export function BookingStatusButton({
  bookingRef,
  status,
  label,
  variant = "outline",
}: {
  bookingRef: string;
  status: "booked" | "closed";
  label: string;
  variant?: "default" | "outline";
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingRef, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not update the booking.");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button type="button" variant={variant} size="sm" onClick={handleClick} disabled={loading}>
        {loading ? "Saving…" : label}
      </Button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </span>
  );
}
