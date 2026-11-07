import Link from 'next/link'
import { GalleryHero } from '@/components/gallery-hero'
import { InfinitePhotoGrid } from '@/components/infinite-photo-grid'
import { Button } from '@/components/ui/button'
import { galleryData, type PhotoMetadata } from '@/lib/gallery-data'

export const metadata = {
  title: 'Gallery - Kolabo Studios',
  description:
    'Every moment, perfectly captured — weddings, portraits, maternity and more, in one collection. Photography by Kolabo Studios, New Jersey & Haiti.',
}

// Mix the categories round-robin so the wall reads as one curated collection,
// not blocks of a single session type. Each photo keeps its category as a label.
function buildGalleryWall(): PhotoMetadata[] {
  const groups = Object.values(galleryData).map((category) =>
    category.photos.map((photo) => ({ ...photo, categoryLabel: category.title }))
  )
  const wall: PhotoMetadata[] = []
  let added = true
  while (added) {
    added = false
    for (const group of groups) {
      const photo = group.shift()
      if (photo) {
        wall.push(photo)
        added = true
      }
    }
  }
  return wall
}

const allPhotos = buildGalleryWall()

export default function GalleriesPage() {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <GalleryHero
        title="The Gallery"
        description="Every moment, perfectly captured — weddings, portraits, maternity and more, in one collection."
        heroImage="/gallery/featured/hero (1).jpg"
      />

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">
              New Jersey &middot; Haiti
            </p>
            <h2 className="text-3xl md:text-5xl font-bold font-sora mb-4">
              One wall, every story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tap any photo to see it full screen. {allPhotos.length} photos,
              from weddings and portraits to maternity and mini sessions.
            </p>
          </div>

          <InfinitePhotoGrid photos={allPhotos} category="gallery" />
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-sora mb-4">
            Love what you see?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your story deserves the same care. Book a session and let&apos;s
            create something beautiful together.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Book a session</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
