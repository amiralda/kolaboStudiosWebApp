// components/admin/setup-form.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Set-your-password form (/admin/setup?token=...&email=...). */
export function SetupForm({ email, token }: { email: string; token: string }) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not set your password.");
      router.push("/admin/bookings");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Setting a password for <strong>{email}</strong>. Use at least 12
        characters.
      </p>
      <label className="block">
        <span className="block text-sm mb-1">New password</span>
        <input
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="w-full border rounded-md px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="block text-sm mb-1">Confirm password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          className="w-full border rounded-md px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      {error && (
        <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving…" : "Set password & sign in"}
      </Button>
    </form>
  );
}
