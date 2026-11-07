import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

const blogPosts = [
  {
    title: "Wedding Photography Trends for 2026",
    date: "November 7, 2026",
    excerpt: "2026 is the year wedding photography stopped chasing perfection — documentary storytelling, true-to-color editing, and real emotion lead the way.",
    image: "/gallery/featured/hero (10).jpg",
    slug: "wedding-trends-2026"
  },
  {
    title: "Fashion Photography in 2026: Real Skin, Bold Light, Editorial Energy",
    date: "November 7, 2026",
    excerpt: "Over-retouching is out. Real texture, dramatic light, and portraits with personality are defining fashion photography in 2026.",
    image: "/retouch/fashion-after.jpg",
    slug: "fashion-photography-2026"
  },
  {
    title: "10 Tips for Your Perfect Engagement Session",
    date: "December 15, 2024",
    excerpt: "Make the most of your engagement photos with these professional tips...",
    image: "/home/romantic-engagement-couple.jpg",
    slug: "engagement-session-tips"
  }
]

export function BlogTeaser() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sora">Latest from Our Blog</h2>
          <p className="text-lg text-muted-foreground">
            Photography tips, inspiration, and behind-the-scenes stories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {post.date}
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors font-sora">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                
                <span className="text-primary font-medium group-hover:underline">
                  Read More →
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
