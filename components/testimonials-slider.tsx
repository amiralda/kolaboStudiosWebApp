'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    quote: "Kolabo Studios captured our wedding day perfectly. Every emotion, every detail - it was all there in the most beautiful way.",
    author: "Sarah & Michael",
    event: "Wedding"
  },
  {
    quote: "The engagement photos exceeded our expectations. They made us feel so comfortable and the results were absolutely stunning.",
    author: "Jessica & David",
    event: "Engagement"
  },
  {
    quote: "Our maternity session was magical. They captured this special time in our lives with such artistry and care.",
    author: "Amanda & Chris",
    event: "Maternity"
  },
  {
    quote: "Professional, creative, and so easy to work with. Our wedding photos are treasures we'll cherish forever.",
    author: "Emily & James",
    event: "Wedding"
  }
]

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 font-sora">What Our Clients Say</h2>
        
        <div className="relative">
          <div className="mb-8">
            <blockquote className="text-xl md:text-2xl italic mb-6 text-gray-700">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            <cite className="text-lg font-semibold text-primary">
              {testimonials[currentIndex].author}
            </cite>
            <p className="text-muted-foreground">{testimonials[currentIndex].event}</p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
