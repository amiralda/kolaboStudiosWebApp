import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Booking Request Received - Kolabo Studios',
  description: 'We received your booking request. No payment was taken — Dany will reach out with your estimate and a link to pay the deposit.',
}

export default function BookingSuccessPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 font-sora">Request Received!</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Thank you — we received your booking request. No payment was taken today.
        </p>
        <p className="text-muted-foreground mb-8">
          Dany will personally review your request and reach out within 24 to 48 hours
          with your estimate and a secure link to pay the 60% deposit to confirm
          your date. Please check your email — a confirmation is on its way.
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
