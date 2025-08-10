import { GalleryHero } from '@/components/gallery-hero'
import { InfinitePhotoGrid } from '@/components/infinite-photo-grid'
import { galleryData } from '@/lib/gallery-data'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Maternity Photography - Kolabo Studios',
  description: 'Documenting the beautiful journey of motherhood with grace and artistry. Professional maternity photography in South Jersey.',
}

export default function MaternityPage() {
  const category = galleryData.maternity

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
              Pregnancy is a beautiful, transformative time that deserves to be celebrated and remembered. 
              Our maternity sessions capture the glow, anticipation, and love that surrounds this special 
              chapter in your family's story.
            </p>
            {category.photos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {category.photos.length} photos in this gallery
              </p>
            )}
          </div>
          
          <InfinitePhotoGrid photos={category.photos} category="maternity" />
        </div>
      </section>
    </div>
  )
}
