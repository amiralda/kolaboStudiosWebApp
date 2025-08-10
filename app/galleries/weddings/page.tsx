import { GalleryHero } from '@/components/gallery-hero'
import { InfinitePhotoGrid } from '@/components/infinite-photo-grid'
import { galleryData } from '@/lib/gallery-data'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Wedding Photography - Kolabo Studios',
  description: 'Capturing the magic of your special day with timeless elegance and authentic emotion. Professional wedding photography in South Jersey.',
}

export default function WeddingsPage() {
  const category = galleryData.weddings

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
              Every wedding tells a unique story. Our approach captures not just the big moments, 
              but the quiet glances, joyful tears, and intimate details that make your day truly yours.
            </p>
            {category.photos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {category.photos.length} photos in this gallery
              </p>
            )}
          </div>
          
          <InfinitePhotoGrid photos={category.photos} category="weddings" />
        </div>
      </section>
    </div>
  )
}
