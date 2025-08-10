import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

// This would typically come from a CMS or database
const getBlogPost = (slug: string) => {
  const posts = {
    'engagement-session-tips': {
      title: "10 Tips for Your Perfect Engagement Session",
      date: "December 15, 2024",
      author: "Sarah Johnson",
      image: "/placeholder.svg?height=400&width=800",
      category: "Tips & Advice",
      content: `
        <p>Your engagement session is one of the most exciting photo shoots you'll ever have! It's a chance to celebrate your love story and create beautiful images that you'll treasure forever. Here are our top 10 tips to help you make the most of your engagement photography session.</p>

        <h2>1. Choose Meaningful Locations</h2>
        <p>Select locations that have significance to your relationship. Whether it's where you first met, had your first date, or got engaged, meaningful locations will make your photos more personal and emotionally resonant.</p>

        <h2>2. Coordinate Your Outfits</h2>
        <p>You don't need to match exactly, but your outfits should complement each other. Choose colors that work well together and avoid busy patterns that might be distracting in photos.</p>

        <h2>3. Plan for Multiple Looks</h2>
        <p>Bring a second outfit option to create variety in your photos. Consider one casual look and one more dressed up, or choose outfits that work well with different locations.</p>

        <h2>4. Time It Right</h2>
        <p>The best lighting for outdoor photos is during the "golden hour" - the hour before sunset. This creates warm, flattering light that makes everyone look amazing.</p>

        <h2>5. Be Yourselves</h2>
        <p>The most beautiful photos happen when you're relaxed and being authentic. Don't worry about posing perfectly - focus on connecting with each other and having fun.</p>

        <h2>6. Bring Props That Tell Your Story</h2>
        <p>Consider bringing meaningful props like a vintage car, your pet, or items related to your hobbies. These can add personality and tell your unique story.</p>

        <h2>7. Get Comfortable with Your Photographer</h2>
        <p>Take time to chat with your photographer before the session starts. The more comfortable you feel, the more natural your photos will look.</p>

        <h2>8. Plan for Weather</h2>
        <p>Have a backup plan for inclement weather, and don't be afraid of a little rain or snow - these can create magical, romantic photos!</p>

        <h2>9. Focus on Each Other</h2>
        <p>While it's natural to look at the camera sometimes, the most romantic photos often happen when you're looking at and interacting with each other.</p>

        <h2>10. Trust the Process</h2>
        <p>Your photographer is there to guide you and capture your best moments. Trust their expertise and enjoy the experience of celebrating your love together.</p>

        <p>Remember, your engagement session is about celebrating this special time in your lives. Relax, have fun, and let your love shine through - that's when the magic happens!</p>
      `
    }
  }
  
  return posts[slug as keyof typeof posts] || null
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          
          <div className="mb-6">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-sora">
            {post.title}
          </h1>
          
          <div className="flex items-center text-muted-foreground space-x-6 mb-8">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </div>
          </div>
        </div>

        <div className="relative aspect-[2/1] mb-12 rounded-lg overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <div 
          className="prose prose-lg max-w-none prose-headings:font-sora prose-headings:font-semibold prose-p:text-muted-foreground prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4 font-sora">Ready to Book Your Session?</h3>
            <p className="text-muted-foreground mb-6">
              Let's create beautiful memories together. Contact us to discuss your photography needs.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
