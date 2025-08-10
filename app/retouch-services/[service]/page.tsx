import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { retouchServices } from '@/lib/retouch-data'
import { Check, Clock, ArrowLeft, Star } from 'lucide-react'

export async function generateStaticParams() {
  return retouchServices.map((service) => ({
    service: service.id,
  }))
}

export default function ServiceDetailPage({ params }: { params: { service: string } }) {
  const service = retouchServices.find(s => s.id === params.service)

  if (!service) {
    notFound()
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/retouch-services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold font-sora">{service.name}</h1>
            {service.popular && (
              <Badge className="bg-primary">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pricing & Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora">Pricing & Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {service.price > 0 ? `$${service.price}` : 'Custom Pricing'}
                    </div>
                    <p className="text-muted-foreground">per image</p>
                  </div>
                  <div>
                    <div className="flex items-center text-lg font-semibold mb-2">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      {service.turnaroundTime}
                    </div>
                    <p className="text-muted-foreground">typical delivery time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sample Work */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora">Sample Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Before retouching sample"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      Before
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="After retouching sample"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      After
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Sample {service.name.toLowerCase()} showing typical results you can expect.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-sora">Ready to Order?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {service.price > 0 ? `$${service.price}` : 'Custom'}
                  </div>
                  <p className="text-muted-foreground">per image</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Turnaround:</span>
                    <span className="font-medium">{service.turnaroundTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revisions:</span>
                    <span className="font-medium">2 included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File formats:</span>
                    <span className="font-medium">JPG, TIFF, PSD</span>
                  </div>
                </div>

                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/retouch-services/order?service=${service.id}`}>
                    {service.price > 0 ? 'Order Now' : 'Get Custom Quote'}
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/retouch-services/portfolio">View Portfolio</Link>
                </Button>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Questions about this service?
                  </p>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="/contact">Contact us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
