import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Booking Confirmed - Kolabo Studios',
  description: 'Your deposit was received and your session date is reserved.',
}

export default function BookingSuccessPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 font-sora">You&rsquo;re Booked!</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Thank you — your deposit was received and your session date is reserved.
        </p>
        <p className="text-muted-foreground mb-8">
          You&rsquo;ll receive an email receipt from Stripe shortly. We&rsquo;ll be in touch
          soon to confirm the details of your session.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/galleries">View Our Work</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
