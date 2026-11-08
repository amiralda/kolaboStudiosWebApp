// components/admin/logout-button.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Signs the admin out (clears the session cookie). */
export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Even if the call fails, leave the admin area.
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      {loading ? "Signing out…" : "Log out"}
    </Button>
  );
}
