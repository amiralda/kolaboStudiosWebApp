import { GalleryHero } from '@/components/gallery-hero'
import { InfinitePhotoGrid } from '@/components/infinite-photo-grid'
import { galleryData } from '@/lib/gallery-data'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Holiday Mini Sessions - Kolabo Studios',
  description: 'Festive and magical holiday photography sessions for the whole family. Professional holiday photography in South Jersey.',
}

export default function HolidayMinisPage() {
  const category = galleryData['holiday-minis']

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
              Celebrate the magic of the holiday season with beautiful family portraits. 
              Our holiday mini sessions capture the joy, warmth, and festive spirit that 
              make this time of year so special for families.
            </p>
            {category.photos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {category.photos.length} photos in this gallery
              </p>
            )}
          </div>
          
          <InfinitePhotoGrid photos={category.photos} category="holiday-minis" />
        </div>
      </section>
    </div>
  )
}
