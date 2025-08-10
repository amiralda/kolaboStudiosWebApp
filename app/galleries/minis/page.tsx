import { GalleryHero } from '@/components/gallery-hero'
import { InfinitePhotoGrid } from '@/components/infinite-photo-grid'
import { galleryData } from '@/lib/gallery-data'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Mini Sessions - Kolabo Studios',
  description: 'Quick and beautiful photography sessions perfect for families and couples. Professional mini sessions in South Jersey.',
}

export default function MinisPage() {
  const category = galleryData.minis

  if (!category) {
    notFound()
  }

  return (
    <div className="pt-16 min-h-screen">
      <GalleryHero 
        title={category.title}
        description={category.description}
        heroImage={category.heroImage}
      />
      
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Perfect for busy families or couples who want beautiful professional photos without 
              the time commitment of a full session. Our mini sessions capture genuine moments 
              and create lasting memories in a fun, relaxed setting.
            </p>
            {category.photos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {category.photos.length} photos in this gallery
              </p>
            )}
          </div>
          
          <InfinitePhotoGrid photos={category.photos} category="minis" />
        </div>
      </section>
    </div>
  )
}
