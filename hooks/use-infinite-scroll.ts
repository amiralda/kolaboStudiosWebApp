'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PhotoMetadata } from '@/lib/gallery-data'

interface UseInfiniteScrollProps {
  photos: PhotoMetadata[]
  itemsPerPage?: number
}

export function useInfiniteScroll({ photos, itemsPerPage = 12 }: UseInfiniteScrollProps) {
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoMetadata[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  // Initialize with first batch
  useEffect(() => {
    const initialPhotos = photos.slice(0, itemsPerPage)
    setDisplayedPhotos(initialPhotos)
    setHasMore(photos.length > itemsPerPage)
    setPage(1)
  }, [photos, itemsPerPage])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const startIndex = page * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const newPhotos = photos.slice(startIndex, endIndex)
    
    if (newPhotos.length === 0) {
      setHasMore(false)
    } else {
      setDisplayedPhotos(prev => [...prev, ...newPhotos])
      setPage(prev => prev + 1)
      setHasMore(endIndex < photos.length)
    }
    
    setIsLoading(false)
  }, [photos, page, itemsPerPage, isLoading, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const sentinel = document.getElementById('scroll-sentinel')
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [loadMore, hasMore, isLoading])

  return {
    displayedPhotos,
    hasMore,
    isLoading,
    loadMore
  }
}
