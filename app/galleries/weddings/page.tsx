import { redirect } from 'next/navigation'

// Weddings now live in the single unified gallery wall.
export default function WeddingsPage() {
  redirect('/galleries')
}
