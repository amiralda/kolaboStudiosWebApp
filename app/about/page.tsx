import Image from 'next/image'

const teamMembers = [
  {
    name: "Dany AUGUSTIN",
    role: "Lead Photographer & Founder",
    image: "/placeholder.svg?height=400&width=400",
    bio: "With over 12 years of experience, Dany brings artistic vision and technical expertise to every shoot."
  },
  {
    name: "Edwin DOR",
    role: "Lead Retoucher",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Edwin specializes in candid moments and has a keen eye and finger for retouching authentic emotions."
  },
  {
    name: "Emma Rodriguez",
    role: "Creative Director",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Emma oversees the creative direction and ensures every project aligns with our artistic vision."
  }
]

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-sora">About Kolabo Studios</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We believe every moment tells a story worth preserving. Our approach blends 
            professional-grade imagery with authentic storytelling, creating photographs 
            that resonate emotionally and stand the test of time.
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=480"
                alt="Kolabo Studios team at work"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sora">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2016, Kolabo Studios emerged from a passion for capturing life's 
                  most precious moments. What started as a small photography business has grown 
                  into a full-service studio specializing in weddings, engagements, and maternity photography.
                </p>
                <p>
                  Our name "Kolabo" reflects our collaborative approach - we work closely with 
                  each client to understand their unique story and vision. We believe that the 
                  best photographs come from genuine connections and authentic moments.
                </p>
                <p>
                  Based in South Jersey, we serve couples and families throughout the region, 
                  bringing our artistic vision and technical expertise to every shoot. Our goal 
                  is to create timeless images that you'll treasure for generations to come.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-sora">Our Philosophy & Process</h2>
          
          <div className="space-y-8 text-lg leading-relaxed">
            <div>
              <h3 className="text-2xl font-semibold mb-4 font-sora">Authentic Storytelling</h3>
              <p className="text-muted-foreground">
                We believe that the most beautiful photographs are those that capture genuine emotions 
                and authentic moments. Our approach is documentary-style with an artistic flair, ensuring 
                that your personality and unique story shine through in every image. We don't just take 
                pictures; we preserve memories and emotions that will transport you back to those special moments.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4 font-sora">Collaborative Partnership</h3>
              <p className="text-muted-foreground">
                Every client relationship begins with understanding your vision, preferences, and dreams. 
                We take the time to get to know you as individuals and as a couple, which allows us to 
                capture images that truly reflect who you are. From the initial consultation through the 
                final delivery, we work as partners to ensure your photography experience exceeds expectations.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4 font-sora">Timeless Artistry</h3>
              <p className="text-muted-foreground">
                Our editing style emphasizes natural beauty and timeless elegance. We enhance the inherent 
                beauty of each moment without over-processing, ensuring that your photographs will look as 
                stunning decades from now as they do today. We combine technical excellence with artistic 
                vision to create images that are both beautiful and meaningful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-sora">Meet the Team</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative aspect-square mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-sora">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
