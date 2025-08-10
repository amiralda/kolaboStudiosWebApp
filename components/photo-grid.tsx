'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Photo } from '@/lib/gallery-data'

interface PhotoGridProps {
  photos: Photo[]
  category: string
}

export function PhotoGrid({ photos, category }: PhotoGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? photos.length - 1 : selectedImage - 1)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-[3/4] cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {photo.title && (
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-medium bg-black/50 px-2 py-1 rounded">
                  {photo.title}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-full h-full max-h-[95vh] p-0">
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
                src={photos[selectedImage].src || "/placeholder.svg"}
                alt={photos[selectedImage].alt}
                fill
                className="object-contain"
              />
              
              {photos.length > 1 && (
                <>
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
                </>
              )}

              {/* Photo info */}
              {photos[selectedImage].title && (
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold bg-black/50 px-3 py-2 rounded">
                    {photos[selectedImage].title}
                  </h3>
                </div>
              )}

              {/* Photo counter */}
              <div className="absolute bottom-4 right-4 text-white">
                <span className="bg-black/50 px-3 py-2 rounded text-sm">
                  {selectedImage + 1} of {photos.length}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
