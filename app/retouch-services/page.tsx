import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BeforeAfterSlider } from '@/components/before-after-slider'
import { retouchServices, retouchPortfolio } from '@/lib/retouch-data'
import { Check, Clock, Star, Camera, Palette, Zap } from 'lucide-react'

export const metadata = {
  title: 'Professional Photo Retouching Services - Kolabo Studios',
  description: 'High-quality photo retouching services for photographers. Wedding, portrait, and commercial retouching with fast turnaround times.',
}

export default function RetouchServicesPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-sora">
            Professional Photo Retouching
            <span className="block text-primary">For Photographers</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Elevate your photography with our professional retouching services. 
            Fast turnaround, consistent quality, and competitive pricing for 
            wedding, portrait, and commercial photographers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="#services">View Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#portfolio">See Our Work</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sora">Why Photographers Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We understand the demands of professional photography and deliver results that exceed expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-sora">Fast Turnaround</h3>
              <p className="text-muted-foreground">
                Most projects completed within 24-48 hours. Rush delivery available for urgent projects.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-sora">Consistent Quality</h3>
              <p className="text-muted-foreground">
                Professional retouchers with years of experience ensuring consistent, high-quality results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-sora">Photographer-Focused</h3>
              <p className="text-muted-foreground">
                Built by photographers, for photographers. We understand your workflow and client needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sora">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Choose the perfect retouching package for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {retouchServices.map((service) => (
              <Card key={service.id} className={`relative ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader>
                  <CardTitle className="font-sora">{service.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {service.price > 0 ? (
                      <span className="text-3xl font-bold">${service.price}</span>
                    ) : (
                      <span className="text-3xl font-bold">Custom</span>
                    )}
                    <span className="text-muted-foreground">per image</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.turnaroundTime}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.shortDescription}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 5 && (
                      <li className="text-sm text-muted-foreground">
                        +{service.features.length - 5} more features
                      </li>
                    )}
                  </ul>

                  <Button asChild className="w-full">
                    <Link href={`/retouch-services/${service.id}`}>
                      {service.price > 0 ? 'Get Started' : 'Get Quote'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sora">Before & After Gallery</h2>
            <p className="text-lg text-muted-foreground">
              See the transformation our professional retouching brings to your images
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {retouchPortfolio.map((item) => (
              <div key={item.id} className="space-y-4">
                <BeforeAfterSlider
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  alt={item.title}
                />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold font-sora">{item.title}</h3>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.techniques.map((technique, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/retouch-services/portfolio">View Full Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sora">Our Process</h2>
            <p className="text-lg text-muted-foreground">
              Simple, streamlined workflow designed for busy photographers
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2 font-sora">Upload Images</h3>
              <p className="text-sm text-muted-foreground">
                Securely upload your images through our client portal
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2 font-sora">Specify Requirements</h3>
              <p className="text-sm text-muted-foreground">
                Tell us your retouching preferences and any special requests
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2 font-sora">Professional Retouch</h3>
              <p className="text-sm text-muted-foreground">
                Our expert retouchers work their magic on your images
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2 font-sora">Download Results</h3>
              <p className="text-sm text-muted-foreground">
                Receive your professionally retouched images ready for delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sora">
            Ready to Elevate Your Photography?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of photographers who trust us with their retouching needs. 
            Get started today with our professional services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/retouch-services/order">Start Your Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
