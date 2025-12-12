import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OptimizedImage } from '@/components/image-optimized'

export function HeroOptimized() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src="/wedding-dance-sunset.png"
          alt="Romantic wedding photography"
          width={1920}
          height={1080}
          priority
          quality={90}
          className="object-cover w-full h-full"
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-sora">
          Every Moment.
          <br />
          Perfectly Captured.
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Professional photography that blends artistry with storytelling, 
          creating timeless memories for your most precious moments.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
          <Link href="/contact">Book Now</Link>
        </Button>
      </div>
    </section>
  )
}
