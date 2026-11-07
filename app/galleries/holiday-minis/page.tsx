import { redirect } from 'next/navigation'

// Holiday minis now live in the single unified gallery wall.
export default function HolidayMinisPage() {
  redirect('/galleries')
}
