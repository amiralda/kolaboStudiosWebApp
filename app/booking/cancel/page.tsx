import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Booking Cancelled - Kolabo Studios',
  description: 'Your checkout was cancelled. No payment was taken.',
}

export default function BookingCancelPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4 font-sora">Booking Cancelled</h1>
        <p className="text-lg text-muted-foreground mb-4">
          No worries — your checkout was cancelled and no payment was taken.
        </p>
        <p className="text-muted-foreground mb-8">
          Your date hasn&rsquo;t been reserved yet. If you&rsquo;d like to try again or have
          questions, we&rsquo;re happy to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/booking">Try Booking Again</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
