'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import type { PhotoMetadata } from '@/lib/gallery-data'

interface InfinitePhotoGridProps {
  photos: PhotoMetadata[]
  category: string
}

export function InfinitePhotoGrid({ photos, category }: InfinitePhotoGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const { displayedPhotos, hasMore, isLoading } = useInfiniteScroll({ 
    photos, 
    itemsPerPage: 12 
  })

  const nextImage = () => {
    if (selectedImage !== null) {
      const nextIndex = (selectedImage + 1) % photos.length
      setSelectedImage(nextIndex)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      const prevIndex = selectedImage === 0 ? photos.length - 1 : selectedImage - 1
      setSelectedImage(prevIndex)
    }
  }

  const openLightbox = (photo: PhotoMetadata) => {
    const index = photos.findIndex(p => p.id === photo.id)
    setSelectedImage(index)
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {displayedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-[3/4] cursor-pointer group overflow-hidden rounded-2xl"
            onClick={() => openLightbox(photo)}
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Photo overlay info */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                {photo.categoryLabel && (
                  <span className="inline-block text-[11px] uppercase tracking-[0.2em] bg-white/20 backdrop-blur px-2.5 py-1 rounded-full mb-2">
                    {photo.categoryLabel}
                  </span>
                )}
                {photo.title && (
                  <h3 className="font-semibold font-sora text-sm md:text-base leading-snug drop-shadow">
                    {photo.title}
                  </h3>
                )}
                {photo.location && (
                  <p className="text-xs text-white/80 mt-0.5">
                    {photo.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading more photos...</span>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && <div id="scroll-sentinel" className="h-4" />}

      {/* End of gallery — elegant closer */}
      {!hasMore && displayedPhotos.length > 0 && (
        <div className="text-center py-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-primary/40" />
            <Camera className="h-5 w-5 text-primary" />
            <span className="h-px w-12 bg-primary/40" />
          </div>
          <p className="font-sora text-xl md:text-2xl font-semibold">
            Every Moment. Perfectly Captured.
          </p>
          <p className="text-muted-foreground mt-2">
            See more on Instagram{' '}
            <a
              href="https://www.instagram.com/kolabostudios"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-medium"
            >
              @kolabostudios
            </a>
          </p>
        </div>
      )}

      {/* Photo-only lightbox: just the photo, full screen — no captions or details */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent
          hideCloseButton
          className="max-w-none w-screen h-screen max-h-none p-0 border-0 rounded-none bg-black"
        >
          {selectedImage !== null && (
            <div className="relative w-full h-full bg-black">
              <Image
                src={photos[selectedImage].src || "/placeholder.svg"}
                alt={photos[selectedImage].alt}
                fill
                className="object-contain"
              />

              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 hover:text-white"
                onClick={() => setSelectedImage(null)}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation arrows */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 hover:text-white"
                    onClick={prevImage}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 hover:text-white"
                    onClick={nextImage}
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
