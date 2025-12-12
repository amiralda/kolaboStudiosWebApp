'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

//const galleryImages = [
  // ⬇️ Replace these filenames with yours from /public/gallery/featured
  //{ src: "/gallery/featured/hero(26).jpg",      alt: "Bride portrait on the porch",    category: "Wedding" },
  //{ src: "/gallery/featured/hero(22).jpg",     alt: "Couple laughing together",       category: "Engagement" },
  //{ src: "/gallery/featured/hero(24).jpg", alt: "Maternity at sunset",            category: "Maternity" },
  //{ src: "/gallery/featured/hero(18).jpg",      alt: "Wedding ring detail",            category: "Wedding" },
  //{ src: "/gallery/featured/hero(20).jpg",             alt: "Reading vows",                   category: "Wedding" },
  //{ src: "/gallery/featured/hero(2).jpg",            alt: "First dance",                    category: "Wedding" },
//]

const galleryImages = [
  { src: "/home/elegant-bride-portrait.png", alt: "Elegant bride portrait", category: "Wedding" },
  { src: "/home/romantic-engagement-couple.jpg", alt: "Romantic engagement session", category: "Engagement" },
  { src: "/home/beautiful-maternity-photo.png", alt: "Beautiful maternity session", category: "Maternity" },
  { src: "/home/couple-laughing.png", alt: "Couple laughing together", category: "Engagement" },
  { src: "/home/gallery-4.png", alt: "Candid reception moment", category: "Wedding" },
  { src: "/home/expecting-mother-silhouette.png", alt: "Maternity silhouette", category: "Maternity" },
]



export function FeaturedGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
    }
  }

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sora">Featured Work</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A glimpse into our portfolio of wedding, engagement, and maternity photography
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-[3/4] cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium">{image.category}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0">
          {selectedImage !== null && (
            <div className="relative w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Image
                src={galleryImages[selectedImage].src || "/placeholder.svg"}
                alt={galleryImages[selectedImage].alt}
                fill
                className="object-contain"
              />
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
