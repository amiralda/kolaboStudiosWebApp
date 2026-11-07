import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export const metadata = {
  title: 'Pricing - Kolabo Studios',
  description: 'Photography pricing for portrait, family, wedding, engagement, and maternity sessions, plus retouching rates.',
}

const packages = [
  {
    name: 'Portrait',
    price: 'From $250',
    per: 'per session',
    features: [
      '2-hour session',
      '6–10 edited photos',
      '3 outfit changes',
      'At your home or our Glassboro, NJ studio',
    ],
    cta: 'Book a Portrait Session',
  },
  {
    name: 'Family',
    price: '$300',
    per: 'per session',
    features: [
      '3-hour session',
      '20+ edited photos',
      'Online gallery + print release',
      '2-week delivery',
      '$180 (60%) non-refundable deposit to hold your date',
    ],
    cta: 'Book a Family Session',
  },
  {
    name: 'Wedding',
    price: 'From $1,500',
    per: 'by coverage',
    features: [
      '4-hour coverage — $1,500',
      '8-hour coverage — $2,800',
      'Full-day coverage — custom quote',
      '60% non-refundable deposit to hold your date',
    ],
    cta: 'Book a Wedding',
  },
  {
    name: 'Engagement',
    price: 'From $900',
    per: 'by coverage',
    features: [
      '4-hour session — $900',
      '5-hour session — $1,100',
      '60% non-refundable deposit to hold your date',
    ],
    cta: 'Book an Engagement Session',
  },
  {
    name: 'Maternity',
    price: '$550',
    per: 'per session',
    features: [
      '2-hour session',
      '60% non-refundable deposit to hold your date',
    ],
    cta: 'Book a Maternity Session',
  },
  {
    name: 'Retouching',
    price: 'From $15',
    per: 'per image',
    features: [
      'Basic retouching — $15 per image',
      'Standard retouching — $25 per image',
      'Premium retouching — $45 per image',
      'Custom projects — custom quote',
    ],
    cta: 'See Retouching Services',
  },
]

export default function PricingPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-sora">Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, honest pricing for every session. All prices in USD.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-sora text-2xl">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold mt-2">{pkg.price}</div>
                <p className="text-muted-foreground">{pkg.per}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full mt-8 bg-primary hover:bg-primary/90">
                  <Link href={pkg.name === 'Retouching' ? '/retouch-services' : '/booking'}>
                    {pkg.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need something different? Every package can be tailored to your day.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us for a Custom Quote</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
