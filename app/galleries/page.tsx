import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { galleryData } from '@/lib/gallery-data'

const categories = Object.values(galleryData)

export default function GalleriesPage() {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <section className="py-20 px-4 text-center bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Our work</p>
          <h1 className="text-4xl md:text-6xl font-bold font-sora mb-4">Story-driven galleries</h1>
          <p className="text-lg text-muted-foreground">
            Explore curated collections across weddings, engagements, maternity, and mini sessions.
            Each gallery highlights the color palette, posing style, and pacing you can expect during a Kolabo Studios shoot.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2">
          {categories.map((category) => (
            <article key={category.id} className="rounded-2xl border shadow-sm overflow-hidden bg-white flex flex-col">
              <div className="relative aspect-[4/3]">
                <Image
                  src={category.heroImage || '/placeholder.svg'}
                  alt={category.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="text-sm uppercase tracking-widest text-primary mb-2">
                  {category.title}
                </div>
                <h2 className="text-2xl font-semibold font-sora mb-3">{category.description}</h2>
                <p className="text-muted-foreground flex-1">
                  {category.photos.length > 0
                    ? `${category.photos.length} featured photos curated for this category.`
                    : 'New imagery is being added soon.'}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button asChild>
                    <Link href={`/galleries/${category.id}`}>View {category.title}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact">Book a session</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
