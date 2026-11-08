// app/booking/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ServiceKey = "wedding4" | "wedding8" | "engagement4" | "engagement5" | "maternity2" | "portrait2" | "family3";

const SERVICES: Record<ServiceKey, { label: string; hours: number; priceUsd: number }> = {
  wedding4:     { label: "Wedding (4h)",      hours: 4, priceUsd: 1500 },
  wedding8:     { label: "Wedding (8h)",      hours: 8, priceUsd: 2800 },
  engagement4:  { label: "Engagement (4h)",   hours: 4, priceUsd: 900  },
  engagement5:  { label: "Engagement (5h)",   hours: 5, priceUsd: 1100 },
  maternity2:   { label: "Maternity (2h)",    hours: 2, priceUsd: 550  },
  portrait2:    { label: "Portrait (2h)",     hours: 2, priceUsd: 250  },
  family3:      { label: "Family (3h)",       hours: 3, priceUsd: 300  },
};

export default function BookingPage() {
  const router = useRouter();
  const [service, setService] = React.useState<ServiceKey>("wedding4");
  const [name, setName] = React.useState<string>("");
  const [clientEmail, setClientEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [time, setTime] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [details, setDetails] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [agree, setAgree] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: "error"; message: string } | null>(null);

  const selected = SERVICES[service];
  const deposit = Math.round(selected.priceUsd * 0.6);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!agree) {
      setStatus({ type: "error", message: "Please accept the terms to continue." });
      return;
    }
    if (!name || !clientEmail || !phone || !date || !time || !location || !details) {
      setStatus({ type: "error", message: "Please fill in all fields so we can prepare your estimate." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceKey: service,
          name,
          email: clientEmail,
          phone,
          date,
          time,
          location,
          details,
          company,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not send your booking request.");
      router.push("/booking/success");
    } catch (err: unknown) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
      <p className="text-zinc-600 mb-6">
        Tell us about your shoot — we&rsquo;ll send your estimate and a link to pay the deposit.
        <strong> No payment is due today.</strong>
      </p>

      {status && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            <input type="date" required className="w-full border rounded-md px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            <span className="block text-sm mb-1">Start time</span>
            <input type="time" required className="w-full border rounded-md px-3 py-2" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <label className="block mb-3">
          <span className="block text-sm mb-1">Location</span>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="City, venue, or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="block text-sm mb-1">Your name</span>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label>
            <span className="block text-sm mb-1">Your email</span>
            <input
              type="email"
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="you@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </label>
          <label>
            <span className="block text-sm mb-1">Your phone</span>
            <input
              type="tel"
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>

        <label className="block mb-6">
          <span className="block text-sm mb-1">Tell us about your shoot</span>
          <textarea
            required
            rows={4}
            className="w-full border rounded-md px-3 py-2"
            placeholder="What do you need? Occasion, number of people, style, must-have shots…"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>

        {/* Honeypot: hidden from humans, catches spam bots. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
          <label>
            Company
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </div>

        <div className="text-sm text-zinc-600 mb-4">
          <p>Duration: {selected.hours}h + 30m buffer • Session price: <strong>${selected.priceUsd}</strong></p>
          <p>Deposit: <strong>${deposit}</strong> (60% of total) — due after we send your estimate • Currency: USD</p>
          <p className="font-medium text-zinc-800">No payment due today.</p>
        </div>

        <label className="flex items-center gap-2 mb-6">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span className="text-sm">I agree to the terms and understand a 60% non-refundable deposit is required to confirm my date.</span>
        </label>

        <Button type="submit" disabled={loading || !agree} className="w-full">
          {loading ? "Sending…" : "Send Booking Request"}
        </Button>
      </form>
    </main>
  );
}
