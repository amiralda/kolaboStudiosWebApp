import Image from 'next/image'

interface GalleryHeroProps {
  title: string
  description: string
  heroImage: string
}

export function GalleryHero({ title, description, heroImage }: GalleryHeroProps) {
  return (
    <section className="relative h-[60vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage || "/placeholder.svg"}
          alt={`${title} photography`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-sora">
          {title}
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  )
}
