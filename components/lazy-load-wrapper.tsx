'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazyLoadWrapperProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyLoadWrapper({ 
  children, 
  threshold = 0.1, 
  rootMargin = '50px',
  className 
}: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div className="w-full h-64 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
    </div>
  )
}
