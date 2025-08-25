// app/booking/page.tsx
"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(
  // Publishable key can be exposed via NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY if you prefer
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string) || ""
);

type ServiceKey = "wedding4" | "wedding8" | "engagement4" | "engagement5" | "maternity2";

const SERVICES: Record<ServiceKey, { label: string; hours: number; priceUsd: number }> = {
  wedding4:     { label: "Wedding (4h)",      hours: 4, priceUsd: 1500 },
  wedding8:     { label: "Wedding (8h)",      hours: 8, priceUsd: 2800 },
  engagement4:  { label: "Engagement (4h)",   hours: 4, priceUsd: 900  },
  engagement5:  { label: "Engagement (5h)",   hours: 5, priceUsd: 1100 },
  maternity2:   { label: "Maternity (2h)",    hours: 2, priceUsd: 550  },
};

export default function BookingPage() {
  const [service, setService] = React.useState<ServiceKey>("wedding4");
  const [date, setDate] = React.useState<string>("");
  const [time, setTime] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [clientEmail, setClientEmail] = React.useState<string>("");
  const [agree, setAgree] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);

  const selected = SERVICES[service];
  const deposit = Math.round(selected.priceUsd * 0.6);

  async function handleCheckout() {
    if (!agree) return alert("Please accept the terms to continue.");
    if (!date || !time || !location || !clientEmail) {
      return alert("Please fill date, time, location and email.");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceKey: service,
          date,
          time,
          location,
          clientEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed.");
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (e: any) {
      alert(e.message || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Book a Session</h1>

      <label className="block mb-3">
        <span className="block text-sm mb-1">Service</span>
        <select
          className="w-full border rounded-md px-3 py-2"
          value={service}
          onChange={(e) => setService(e.target.value as ServiceKey)}
        >
          {Object.entries(SERVICES).map(([key, s]) => (
            <option key={key} value={key}>
              {s.label} — ${s.priceUsd}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <label>
          <span className="block text-sm mb-1">Date</span>
          <input type="date" className="w-full border rounded-md px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          <span className="block text-sm mb-1">Start time</span>
          <input type="time" className="w-full border rounded-md px-3 py-2" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>

      <label className="block mb-3">
        <span className="block text-sm mb-1">Location</span>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2"
          placeholder="City, venue, or address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>

      <label className="block mb-6">
        <span className="block text-sm mb-1">Your email (for receipt & confirmation)</span>
        <input
          type="email"
          className="w-full border rounded-md px-3 py-2"
          placeholder="you@email.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
      </label>

      <div className="text-sm text-zinc-600 mb-4">
        <p>Duration: {selected.hours}h + 30m buffer • Deposit: <strong>${deposit}</strong> (60% of total) • Currency: USD</p>
      </div>

      <label className="flex items-center gap-2 mb-6">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span className="text-sm">I agree to the terms and understand the deposit is non-refundable.</span>
      </label>

      <Button onClick={handleCheckout} disabled={loading || !agree} className="w-full">
        {loading ? "Redirecting…" : "Pay Deposit & Reserve"}
      </Button>
    </main>
  );
}
