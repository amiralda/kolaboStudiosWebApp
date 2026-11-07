import { redirect } from 'next/navigation'

// Portraits now live in the single unified gallery wall.
export default function PortraitPage() {
  redirect('/galleries')
}
