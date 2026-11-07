import { GalleryHero } from '@/components/gallery-hero'
import { InfinitePhotoGrid } from '@/components/infinite-photo-grid'
import { galleryData } from '@/lib/gallery-data'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Portrait Photography - Kolabo Studios',
  description: 'Bold, expressive portraits — studio sessions, beauty, fashion, and concept work. Professional portrait photography by Kolabo Studios.',
}

export default function PortraitPage() {
  const category = galleryData.portrait

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
              Every portrait tells a story. Our approach captures personality, confidence, and style —
              from studio beauty and fashion to bold concept work — so each image feels unmistakably you.
            </p>
            {category.photos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {category.photos.length} photos in this gallery
              </p>
            )}
          </div>
          
          <InfinitePhotoGrid photos={category.photos} category="portrait" />
        </div>
      </section>
    </div>
  )
}
