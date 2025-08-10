import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AboutSnippet() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=480"
              alt="Kolabo Studios photographer"
              fill
              className="object-cover"
            />
          </div>
          
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-sora">About Kolabo Studios</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We believe every moment tells a story worth preserving. Our approach blends 
              professional-grade imagery with authentic storytelling, creating photographs 
              that resonate emotionally and stand the test of time. From intimate elopements 
              to grand celebrations, we capture the essence of your unique love story.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
