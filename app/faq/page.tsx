import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is your pricing structure?",
    answer: "Our pricing varies based on the type of session and package you choose. Wedding packages start at $2,500 and include 6-8 hours of coverage, online gallery, and high-resolution images. Engagement sessions start at $450, and maternity sessions start at $350. We offer detailed pricing information during our consultation to ensure you find the perfect package for your needs and budget."
  },
  {
    question: "How long does it take to receive our photos?",
    answer: "We understand how excited you are to see your photos! For engagement and maternity sessions, you can expect to receive your gallery within 2-3 weeks. Wedding photos typically take 6-8 weeks due to the extensive editing process. We'll provide a sneak peek of 5-10 images within 48 hours of your wedding day to share with family and friends."
  },
  {
    question: "How many photos will we receive?",
    answer: "The number of photos depends on your session type. Engagement sessions typically include 50-75 edited images, maternity sessions include 40-60 images, and wedding packages include 400-600+ images depending on your coverage time. All images are professionally edited and delivered in high resolution through a private online gallery."
  },
  {
    question: "Do you have liability insurance?",
    answer: "Yes, we carry comprehensive liability insurance and are fully insured for all types of photography sessions and venues. We can provide certificates of insurance to your venue if required. This protects both you and the venue in the unlikely event of any accidents during your session."
  },
  {
    question: "Who owns the copyright to our photos?",
    answer: "As the photographer, we retain the copyright to all images. However, you receive full personal usage rights, which means you can print, share on social media, and use the images for personal purposes. We ask that you credit Kolabo Studios when sharing online. Commercial usage requires separate licensing, which we're happy to discuss if needed."
  },
  {
    question: "How far in advance should we book?",
    answer: "We recommend booking as early as possible, especially for weddings during peak season (May-October). Wedding bookings are typically made 6-12 months in advance, while engagement and maternity sessions can often be scheduled 2-4 weeks out. However, we sometimes have last-minute availability, so don't hesitate to reach out even if your date is approaching quickly."
  },
  {
    question: "Do you offer videography services?",
    answer: "While we specialize in photography, we work closely with several talented videographers in the area and can provide recommendations. We're experienced in coordinating with video teams to ensure both photo and video coverage work seamlessly together on your special day."
  },
  {
    question: "What happens if you're sick or unable to shoot our wedding?",
    answer: "Your wedding day is irreplaceable, and we take this responsibility seriously. We maintain a network of professional backup photographers who share our style and standards. In the extremely rare event that we cannot fulfill our commitment, we will provide a qualified replacement at no additional cost to you. We also carry professional liability insurance for additional peace of mind."
  },
  {
    question: "Can we request specific shots or poses?",
    answer: "We encourage you to share any specific shots, poses, or moments that are important to you. We'll create a shot list together during our consultation and planning process. While we'll guide you through natural poses and capture candid moments, we want to ensure we document everything that matters most to you."
  },
  {
    question: "Do you travel for destination weddings?",
    answer: "Yes, we love destination weddings! We're available for travel throughout the United States and internationally. Travel fees vary based on location and may include transportation, accommodation, and meal expenses. We're happy to provide a detailed quote for your destination wedding and help make your dream wedding photography a reality."
  }
]

export default function FAQPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-sora">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our photography services
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-4 font-sora">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6">
            We're here to help! Don't hesitate to reach out with any additional questions.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
