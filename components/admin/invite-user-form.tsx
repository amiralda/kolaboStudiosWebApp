// components/admin/invite-user-form.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Invite a new admin by email (/admin/users). They get a setup link. */
export function InviteUserForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not send the invite.");
      setMessage({
        type: "success",
        text: `Setup link sent to ${email}. It works for 48 hours.`,
      });
      setEmail("");
      router.refresh();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        className="flex-1 border rounded-md px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="teammate@example.com"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending…" : "Send setup link"}
      </Button>
      {message && (
        <p
          className={`text-sm sm:w-full ${
            message.type === "success" ? "text-green-700" : "text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
