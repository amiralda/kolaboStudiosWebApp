import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'

const instagramPosts = [
  { src: "/home/elegant-bride-portrait.png", alt: "Bride portrait" },
  { src: "/home/romantic-engagement-couple.jpg", alt: "Engagement couple" },
  { src: "/home/beautiful-maternity-photo.png", alt: "Maternity session" },
  { src: "/home/couple-laughing.png", alt: "Couple laughing" },
  { src: "/home/gallery-4.png", alt: "Wedding reception moment" },
  { src: "/home/expecting-mother-silhouette.png", alt: "Expecting mother silhouette" },
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
