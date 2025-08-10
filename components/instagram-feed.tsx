import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'

const instagramPosts = [
  { src: "/wedding-bouquet-detail.png", alt: "Wedding bouquet detail" },
  { src: "/couple-beach-walk.png", alt: "Couple walking on beach" },
  { src: "/maternity-silhouette-sunset.png", alt: "Maternity silhouette at sunset" },
  { src: "/placeholder-ltlu2.png", alt: "Wedding rings macro shot" },
  { src: "/engagement-ring-closeup.png", alt: "Engagement ring close up" },
  { src: "/baby-shoes-on-belly.png", alt: "Baby shoes on pregnant belly" }
]

export function InstagramFeed() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold font-sora">@kolabostudios</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Follow us for daily inspiration and behind-the-scenes moments
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <Link
              key={index}
              href="https://instagram.com/kolabostudios"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden rounded-lg"
            >
              <Image
                src={post.src || "/placeholder.svg"}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
