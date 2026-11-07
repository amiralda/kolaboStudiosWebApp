import { redirect } from 'next/navigation'

// Engagement now lives in the single unified gallery wall.
export default function EngagementPage() {
  redirect('/galleries')
}
