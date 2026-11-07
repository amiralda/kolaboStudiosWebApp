import { redirect } from 'next/navigation'

// Maternity now lives in the single unified gallery wall.
export default function MaternityPage() {
  redirect('/galleries')
}
