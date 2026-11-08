// components/admin/login-form.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Per-user admin sign-in form (/admin/login). */
export function LoginForm({ systemReady }: { systemReady: boolean }) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Sign-in failed.");
      router.push("/admin/bookings");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!systemReady) {
    return (
      <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Admin sign-in is not set up on this server yet. The site database
        still needs to be connected — ask Sarah to finish the setup, then
        try again.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-sm mb-1">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          className="w-full border rounded-md px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@kolabostudios.com"
        />
      </label>
      <label className="block">
        <span className="block text-sm mb-1">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          className="w-full border rounded-md px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && (
        <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
