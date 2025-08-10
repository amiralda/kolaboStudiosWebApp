import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User } from 'lucide-react'

const blogPosts = [
  {
    title: "10 Tips for Your Perfect Engagement Session",
    date: "December 15, 2024",
    author: "Sarah Johnson",
    excerpt: "Make the most of your engagement photos with these professional tips that will help you feel comfortable and look amazing in front of the camera.",
    image: "/placeholder.svg?height=300&width=500",
    slug: "engagement-session-tips",
    category: "Tips & Advice"
  },
  {
    title: "Wedding Photography Trends for 2025",
    date: "December 10, 2024",
    author: "Michael Chen",
    excerpt: "Discover the latest trends shaping wedding photography this year, from candid documentary styles to creative lighting techniques.",
    image: "/placeholder.svg?height=300&width=500",
    slug: "wedding-trends-2025",
    category: "Trends"
  },
  {
    title: "Preparing for Your Maternity Session",
    date: "December 5, 2024",
    author: "Emma Rodriguez",
    excerpt: "Everything you need to know to prepare for beautiful maternity photos, including outfit suggestions and timing recommendations.",
    image: "/placeholder.svg?height=300&width=500",
    slug: "maternity-session-prep",
    category: "Maternity"
  },
  {
    title: "The Art of Wedding Day Timeline Planning",
    date: "November 28, 2024",
    author: "Sarah Johnson",
    excerpt: "Learn how to create the perfect wedding day timeline that allows for stunning photos while keeping your celebration on track.",
    image: "/placeholder.svg?height=300&width=500",
    slug: "wedding-timeline-planning",
    category: "Wedding Planning"
  },
  {
    title: "Choosing the Perfect Location for Your Photos",
    date: "November 20, 2024",
    author: "Michael Chen",
    excerpt: "Discover how to select locations that complement your style and create the perfect backdrop for your photography session.",
    image: "/placeholder.svg?height=300&width=500",
    slug: "choosing-photo-locations",
    category: "Tips & Advice"
  },
  {
    title: "What to Expect During Your First Consultation",
    date: "November 15, 2024",
    author: "Emma Rodriguez",
    excerpt: "Get ready for your photography consultation with this guide to what we'll discuss and how to prepare for your session.",
    image: "/placeholder.svg?height=300&width=500",
    slug: "first-consultation-guide",
    category: "Getting Started"
  }
]

export default function BlogPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-sora">Our Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Photography tips, inspiration, and behind-the-scenes stories from Kolabo Studios
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-[3/2] mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors font-sora">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground">
                    {post.excerpt}
                  </p>
                  
                  <span className="text-primary font-medium group-hover:underline">
                    Read More →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
