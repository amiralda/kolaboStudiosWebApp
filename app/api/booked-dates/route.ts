import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/database/supabase"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * No-double-booking support (Dany, 2026-11-08).
 *
 * GET /api/booked-dates → { dates: ["2026-11-20", ...] }
 *
 * A date is "booked" only once a booking for it is CONFIRMED — deposit
 * paid or Dany marked it confirmed. A mere unconfirmed request does NOT
 * block the date. Confirmed = status "deposit_paid" or "booked" in the
 * booking_requests table.
 *
 * If Supabase is not configured, there is no record of confirmed
 * bookings, so the list is empty and nothing is blocked (the booking
 * page still validates client-side against whatever this returns).
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!(await checkRateLimit(`booked-dates:${ip}`, 30, 60))) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
    )
  }

  const dates: string[] = []

  let supabase
  try {
    supabase = createSupabaseServerClient()
  } catch {
    return NextResponse.json({ dates })
  }

  try {
    const { data, error } = await supabase
      .from("booking_requests")
      .select("date_iso")
      .in("status", ["deposit_paid", "booked"])
    if (error) {
      console.error("❌ Booked-dates query error:", error.message)
      return NextResponse.json({ dates })
    }
    for (const row of data ?? []) {
      const iso = typeof row.date_iso === "string" ? row.date_iso : ""
      const day = iso.slice(0, 10)
      if (/^\d{4}-\d{2}-\d{2}$/.test(day) && !dates.includes(day)) {
        dates.push(day)
      }
    }
  } catch (error) {
    console.error("❌ Booked-dates error:", error)
  }

  return NextResponse.json({ dates: dates.sort() })
}
