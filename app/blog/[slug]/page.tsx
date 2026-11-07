import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sanitizeHtml } from '@/lib/validation'

// This would typically come from a CMS or database
const getBlogPost = (slug: string) => {
  const posts = {
    'engagement-session-tips': {
      title: "10 Tips for Your Perfect Engagement Session",
      date: "December 15, 2024",
      author: "Dany Augustin",
      image: "/home/romantic-engagement-couple.jpg",
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
    },
    'wedding-trends-2025': {
      title: "Wedding Photography Trends for 2025",
      date: "December 10, 2024",
      author: "Dany Augustin",
      image: "/home/elegant-bride-portrait.png",
      category: "Trends",
      content: `
        <p>Wedding photography keeps evolving, and 2025 brought a clear direction: photos that feel real. Couples asked for less posing and more honesty — images that look like their day actually felt. Here are the trends that defined 2025.</p>

        <h2>1. Candid, Documentary-Style Coverage</h2>
        <p>The biggest shift of 2025 was toward documentary coverage. Instead of directing every moment, photographers stayed observant — catching the laugh between vows, the nervous hand-squeeze, the tear nobody planned. The result is a gallery that reads like a story, not a checklist.</p>

        <h2>2. True-to-Color Editing</h2>
        <p>Heavy presets faded out. Couples wanted skin tones that looked like skin and colors that looked like the day. Warm, natural editing that will still look right in twenty years beat out anything trendy.</p>

        <h2>3. Creative, Intentional Lighting</h2>
        <p>From golden-hour portraits to dramatic reception lighting, photographers used light as a storytelling tool — not just a technical requirement. Direct flash made a comeback at parties, giving dance-floor photos a fun, editorial energy.</p>

        <h2>4. Film and Analog Texture</h2>
        <p>Film photography — or digital work graded to feel like film — grew steadily in 2025. The grain, the warmth, the softness: it all makes images feel like memories rather than files.</p>

        <h2>5. Smaller, More Intimate Weddings</h2>
        <p>Micro weddings kept growing. With fewer guests, photographers could spend real time with each person, and couples got galleries full of genuine moments instead of rushed group shots.</p>

        <p>The thread through all of it: authenticity. The trends that lasted in 2025 were the ones that put the couple's real story first — and that is exactly how we shoot at Kolabo Studios.</p>
      `
    },
    'maternity-session-prep': {
      title: "Preparing for Your Maternity Session",
      date: "December 5, 2024",
      author: "Emma Rodriguez",
      image: "/home/beautiful-maternity-photo.png",
      category: "Maternity",
      content: `
        <p>A maternity session celebrates one of the most beautiful chapters of your life. A little preparation goes a long way toward photos you'll treasure forever. Here's everything you need to know before your session.</p>

        <h2>When to Schedule</h2>
        <p>The sweet spot is between 28 and 36 weeks — your bump is beautifully round, and you're usually still comfortable moving around. Book early, though: the best dates go fast, especially in spring and fall.</p>

        <h2>What to Wear</h2>
        <p>Flowing dresses photograph beautifully and show off your bump gracefully. Solid, soft colors work best — think cream, sage, dusty blue, or blush. Avoid busy patterns and logos. Bring a second outfit if you want variety: one elegant, one casual.</p>

        <h2>Timing and Light</h2>
        <p>Golden hour — the hour before sunset — gives the warm, flattering light that makes maternity photos glow. Morning sessions work too, especially for studio shoots with soft window light.</p>

        <h2>Bring Your Partner (and Kids)</h2>
        <p>Some of the sweetest maternity photos include your partner's hand on your belly or your older child kissing it. These images tell the whole family story, not just one chapter of it.</p>

        <h2>Rest Beforehand</h2>
        <p>Get a good night's sleep, drink plenty of water, and eat something light before the session. Comfortable shoes for walking between locations help too — we'll handle the rest.</p>

        <p>Most of all, relax. The best maternity photos happen when you feel comfortable and confident. Come as you are, and let us capture this incredible moment in your life.</p>
      `
    },
    'wedding-timeline-planning': {
      title: "The Art of Wedding Day Timeline Planning",
      date: "November 28, 2024",
      author: "Dany Augustin",
      image: "/home/gallery-4.png",
      category: "Wedding Planning",
      content: `
        <p>A great wedding day timeline does two things: it keeps your celebration running smoothly, and it gives your photographer the time to make stunning photos. Here's how to build one that works.</p>

        <h2>Start with the Light</h2>
        <p>Work backward from sunset. Golden hour is the best light of the day, so plan your couple portraits for the hour before sunset when possible. If your ceremony is at 4 PM in October, that golden window is right after — perfect timing.</p>

        <h2>Build in Breathing Room</h2>
        <p>Every part of the day takes longer than you think. Add 10–15 minutes of buffer between major events. A timeline with no breathing room is a timeline that falls apart by noon.</p>

        <h2>Getting Ready: 60–90 Minutes</h2>
        <p>Allow plenty of time for hair, makeup, and getting dressed — and for the photographer to capture the details: the dress, the shoes, the rings, the quiet moments before everything begins.</p>

        <h2>First Look and Portraits: 30–45 Minutes</h2>
        <p>A first look before the ceremony means your couple portraits are done early, so you can actually enjoy cocktail hour. Family portraits work best right after the ceremony, when everyone is already gathered.</p>

        <h2>Reception: Let It Flow</h2>
        <p>Once the party starts, the best photos are candid. Build your timeline around the big moments — first dance, toasts, cake cutting — and let the rest happen naturally.</p>

        <p>Share your timeline with your photographer early. We can spot the tight spots, suggest a better order, and make sure the light is on your side all day long.</p>
      `
    },
    'choosing-photo-locations': {
      title: "Choosing the Perfect Location for Your Photos",
      date: "November 20, 2024",
      author: "Dany Augustin",
      image: "/home/couple-laughing.png",
      category: "Tips & Advice",
      content: `
        <p>The location of your photo session shapes everything — the light, the mood, the story your photos tell. Here's how to choose a spot that fits you.</p>

        <h2>Start with Meaning</h2>
        <p>The best locations mean something to you. The park where you had your first date, the beach you visit every summer, the street where you got engaged — photos in meaningful places carry an emotion no pretty backdrop can fake.</p>

        <h2>Think About Light</h2>
        <p>Open shade, tree-lined paths, and golden-hour fields give photographers gorgeous light to work with. Harsh midday sun in an open plaza is much harder. If you love a location, ask your photographer what time of day it looks best.</p>

        <h2>Match the Location to Your Style</h2>
        <p>Love editorial, fashion-forward photos? A city street or modern architecture fits. Want soft and romantic? Gardens, beaches, and golden fields. Rustic and warm? A farm, a barn, or a quiet country road.</p>

        <h2>Consider the Practical Side</h2>
        <p>Some locations need permits, have entry fees, or get crowded on weekends. Check the rules in advance, and have a backup plan for bad weather. Your photographer can suggest alternatives nearby.</p>

        <h2>Keep It Close to Home</h2>
        <p>You don't need to travel far for beautiful photos. South Jersey and the Philadelphia area are full of gorgeous spots — from the gardens of Longwood to the beaches of Cape May. Sometimes the best location is fifteen minutes away.</p>

        <p>Not sure where to go? Tell us what you love, and we'll suggest locations that match your style. That's part of the job — and one of our favorite parts.</p>
      `
    },
    'first-consultation-guide': {
      title: "What to Expect During Your First Consultation",
      date: "November 15, 2024",
      author: "Emma Rodriguez",
      image: "/gallery/featured/hero (1).jpg",
      category: "Getting Started",
      content: `
        <p>Booking a photographer starts with a conversation — your first consultation. Here's what happens, what we'll ask, and how to get the most out of it.</p>

        <h2>It's a Conversation, Not an Interview</h2>
        <p>We'll talk about your day: the venue, the schedule, the people, the moments that matter most to you. We want to understand your story, not just your date and budget.</p>

        <h2>What We'll Ask You</h2>
        <p>Expect questions about your style (do you love candid photos or classic portraits?), your must-have shots, your timeline, and your venue. Bring any inspiration photos you have — Pinterest boards, Instagram saves, anything that shows what you love.</p>

        <h2>What You Should Ask Us</h2>
        <p>Ask about our experience with your venue, our backup equipment, how long delivery takes, and what happens if it rains. A good photographer welcomes these questions — they show you care about the result.</p>

        <h2>We'll Show You Real Work</h2>
        <p>We'll walk you through full galleries, not just highlight reels. Seeing a complete wedding from start to finish tells you far more about a photographer than ten perfect photos.</p>

        <h2>Packages and Pricing</h2>
        <p>We'll explain every package clearly — what's included, how many hours, how many photos, and what the deposit holds. No hidden fees, no surprises. You'll leave knowing exactly what you're getting.</p>

        <p>By the end of the consultation, you should feel confident and excited — not pressured. If we're the right fit, we'll say so. If not, we'll tell you that too. The consultation is free, and there's never any obligation.</p>
      `
    },
    'wedding-trends-2026': {
      title: "Wedding Photography Trends for 2026",
      date: "November 7, 2026",
      author: "Dany Augustin",
      image: "/gallery/featured/hero (10).jpg",
      category: "Trends",
      content: `
        <p>2026 is the year wedding photography stopped chasing perfection. Across the industry, photographers and couples agree: the photos that matter are the real ones — unposed, emotional, a little imperfect, and completely yours. Here is what is actually trending in 2026.</p>

        <h2>1. Documentary Storytelling Leads the Way</h2>
        <p>Photojournalistic, candid coverage is the dominant style of 2026. Industry reporting found that 67% of couples now explicitly prioritize natural, unposed coverage over formal posing. The goal is a gallery that reads like the day felt — not a series of performances for the camera.</p>

        <h2>2. True-to-Color Editing Wins</h2>
        <p>Copy-paste presets are out. Couples want their skin tones, their dress, and their venue to look like themselves. True-to-color editing — warm, natural, honest — is the most requested editing style of the year, because it ages well.</p>

        <h2>3. Film and 35mm Are Back</h2>
        <p>Real 35mm film texture — grain, warmth, imperfect magic — is everywhere in 2026. Whether shot on film or graded to feel like it, the analog look makes photos feel like memories rather than files.</p>

        <h2>4. Direct Flash and Motion Blur</h2>
        <p>Direct flash is the party king again: grainy, high-contrast, paparazzi-style dance-floor shots. And intentional motion blur is back — used honestly, it captures the energy of a moment in a way a frozen frame never can.</p>

        <h2>5. The Documentary-Editorial Hybrid</h2>
        <p>The consensus style of 2026 blends documentary candor with editorial composition — magazine-worthy framing of moments that were never posed. Couples get both: beautiful portraits and emotionally true candids.</p>

        <h2>6. Smaller Weddings, Bigger Albums</h2>
        <p>Micro weddings (20–40 guests) have moved from pandemic necessity to genuine preference. And with digital fatigue setting in, physical albums and coffee-table books are making a real comeback — something you can hold and pass on.</p>

        <p>At Kolabo Studios, this is how we have always shot: real emotion first, beautiful light second, and never a moment forced. If 2026's trends sound like your wedding, let's talk.</p>

        <p><em>Further reading: <a href="https://greenweddingshoes.com/wedding-photography-trends/">Green Wedding Shoes — 2026 Wedding Photography Trends</a> · <a href="https://martamayphotography.co.uk/2026-wedding-photography-trends/">Marta May Photography — 2026 Wedding Photography Trends</a> · <a href="https://rosevow.com/photography/wedding-photography-trends-2026">RoseVow — Wedding Photography Trends 2026</a></em></p>
      `
    },
    'fashion-photography-2026': {
      title: "Fashion Photography in 2026: Real Skin, Bold Light, Editorial Energy",
      date: "November 7, 2026",
      author: "Dany Augustin",
      image: "/retouch/fashion-after.jpg",
      category: "Trends",
      content: `
        <p>Fashion photography in 2026 is having an honest moment. The over-retouched, over-perfect look that dominated the last decade is fading — and what is replacing it is more interesting: real texture, dramatic light, and portraits that show personality, not just clothes.</p>

        <h2>1. The Backlash Against Over-Retouching</h2>
        <p>Images that read as over-retouched are starting to read as forgettable. The strongest fashion work of 2026 keeps real skin texture — freckles, pores, character — and lets the subject look like a person, not a rendering. This is exactly the philosophy behind our retouching: enhance, never erase.</p>

        <h2>2. Chiaroscuro: Light with Drama</h2>
        <p>The visual language of the year is directional, contrasty, character-defining light — chiaroscuro, borrowed from Renaissance painting. Strong contrast between light and shadow creates depth and mood that soft, flat lighting never will.</p>

        <h2>3. Cinematic Editorial Storytelling</h2>
        <p>Fashion photography is moving from showcasing clothes to telling stories. Moody lighting, dramatic compositions, environmental settings, and emotional expression turn a shoot into a short film told in stills.</p>

        <h2>4. Editorial Portraits: Personality First</h2>
        <p>Portrait photography is now central to fashion campaigns. Photographers emphasize confidence, emotion, and individuality — because audiences connect with a person, not a garment. The "power stare," direct camera gaze with relaxed body language, is one of the most recreated poses of the year.</p>

        <h2>5. Vintage Sensibility, Analog Texture</h2>
        <p>Grainy textures, light leaks, warm tones, and nostalgic film vibes run through 2026 fashion work. Analog aesthetics signal craft and intention — the opposite of mass-produced perfection.</p>

        <h2>What This Means for Your Portrait Session</h2>
        <p>You don't need a fashion-week budget to get an editorial look. A portrait session with dramatic light, honest retouching, and a photographer who directs for confidence — not for perfection — gives you images with the same energy. That is what we bring to every portrait, engagement, and fashion session at Kolabo Studios.</p>

        <p><em>Further reading: <a href="https://premierportraits.com.au/editorial-fashion-photography-trends-2026-melbourne-models-agents/">Premier Portraits — Fashion Photography Trends 2026</a> · <a href="https://www.thepictureframes.com/blog-single.php?slug=fashion-photography-trends-in-2026-the-styles-lighting-creative-ideas-defining-modern-fashion">The Picture Frames — Fashion Photography Trends in 2026</a> · <a href="https://blog.evoto.ai/editorial-fashion-photography-tips-for-fasion-week/">Evoto — Editorial Fashion Photography 2026</a></em></p>
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

  const safeContent = sanitizeHtml(post.content)

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
          dangerouslySetInnerHTML={{ __html: safeContent }}
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
