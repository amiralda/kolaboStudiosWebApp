'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, Tag } from 'lucide-react'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-[3/4] cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => openLightbox(photo)}
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            
            {/* Photo overlay info */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                {photo.title && (
                  <h3 className="font-semibold text-sm mb-1 bg-black/50 px-2 py-1 rounded">
                    {photo.title}
                  </h3>
                )}
                {photo.date && (
                  <p className="text-xs bg-black/50 px-2 py-1 rounded inline-block">
                    {new Date(photo.date).toLocaleDateString()}
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

      {/* End of photos message */}
      {!hasMore && displayedPhotos.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You've seen all {photos.length} photos in this gallery</p>
        </div>
      )}

      {/* Enhanced Lightbox with Metadata */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full h-full max-h-[95vh] p-0">
          {selectedImage !== null && (
            <div className="relative w-full h-full flex">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {/* Main image area */}
              <div className="flex-1 relative">
                <Image
                  src={photos[selectedImage].src || "/placeholder.svg"}
                  alt={photos[selectedImage].alt}
                  fill
                  className="object-contain"
                />
                
                {/* Navigation arrows */}
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
              </div>

              {/* Metadata sidebar */}
              <div className="w-80 bg-white p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Photo title */}
                  {photos[selectedImage].title && (
                    <div>
                      <h2 className="text-xl font-bold font-sora">
                        {photos[selectedImage].title}
                      </h2>
                    </div>
                  )}

                  {/* Photo description */}
                  {photos[selectedImage].description && (
                    <div>
                      <p className="text-muted-foreground">
                        {photos[selectedImage].description}
                      </p>
                    </div>
                  )}

                  {/* Photo metadata */}
                  <div className="space-y-3 pt-4 border-t">
                    {photos[selectedImage].date && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{new Date(photos[selectedImage].date!).toLocaleDateString()}</span>
                      </div>
                    )}

                    {photos[selectedImage].location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{photos[selectedImage].location}</span>
                      </div>
                    )}

                    {photos[selectedImage].tags && photos[selectedImage].tags!.length > 0 && (
                      <div className="flex items-start text-sm">
                        <Tag className="h-4 w-4 mr-2 text-primary mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {photos[selectedImage].tags!.map((tag, index) => (
                            <span 
                              key={index}
                              className="bg-gray-100 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {photos[selectedImage].dimensions && (
                      <div className="text-xs text-muted-foreground">
                        {photos[selectedImage].dimensions!.width} × {photos[selectedImage].dimensions!.height}
                      </div>
                    )}
                  </div>

                  {/* Photo counter */}
                  <div className="pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Photo {selectedImage + 1} of {photos.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
