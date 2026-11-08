import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/database/supabase"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Admin-only booking status change (Dany, /admin/bookings).
 *
 * Auth: this route lives under /api/admin/*, which middleware.ts already
 * protects with HTTP Basic Auth (ADMIN_SECRET). No new auth system here.
 *
 * Used for the no-double-booking rule: Dany marks a booking "booked"
 * (confirmed) and its date becomes unavailable on /booking. "closed"
 * cancels/closes a request without blocking its date.
 */
const BookingStatusSchema = z.object({
  bookingRef: z.string().min(1, "Booking ref is required").max(50),
  status: z.enum(["booked", "closed"]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = BookingStatusSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid request"
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { bookingRef, status } = parsed.data

    let supabase
    try {
      supabase = createSupabaseServerClient()
    } catch {
      return NextResponse.json(
        { error: "Booking storage is not configured on this server." },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from("booking_requests")
      .update({ status })
      .eq("booking_ref", bookingRef)
      .select("booking_ref")
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: `Booking ${bookingRef} was not found.` },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, bookingRef, status })
  } catch (error) {
    console.error("❌ Booking status error:", error)
    return NextResponse.json(
      { error: "Failed to update the booking. Please try again." },
      { status: 500 }
    )
  }
}
