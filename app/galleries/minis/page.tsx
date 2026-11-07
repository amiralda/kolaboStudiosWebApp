import { redirect } from 'next/navigation'

// Mini sessions now live in the single unified gallery wall.
export default function MinisPage() {
  redirect('/galleries')
}
