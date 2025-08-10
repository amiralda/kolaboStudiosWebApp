import { Hero } from '@/components/hero'
import { FeaturedGallery } from '@/components/featured-gallery'
import { TestimonialsSlider } from '@/components/testimonials-slider'
import { InstagramFeed } from '@/components/instagram-feed'
import { AboutSnippet } from '@/components/about-snippet'
import { BlogTeaser } from '@/components/blog-teaser'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGallery />
      <TestimonialsSlider />
      <InstagramFeed />
      <AboutSnippet />
      <BlogTeaser />
    </>
  )
}
