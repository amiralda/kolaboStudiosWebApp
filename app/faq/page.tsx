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
    question: "How much do your photography packages cost?",
    answer:
      "We tailor every package to your needs and budget—whether you want something simple or full-day coverage. We have options for every wallet. Contact us for a custom quote and we’ll recommend the best fit for you."
  },
  {
    question: "How fast do we receive our photos?",
    answer:
      "Our team works hard to deliver final galleries within 24–48 hours for most sessions, provided all client requirements (selections, approvals, payments, and any needed info) are complete. Larger events may take longer due to detailed editing, and we’ll keep you updated at every step."
  },
  {
    question: "How many photos will we receive?",
    answer:
      "Image count depends on the package and coverage we agree on together. From short sessions to full-day events, we focus on delivering a polished set that tells your story beautifully."
  },
  {
    question: "Can we request specific shots or poses?",
    answer:
      "Absolutely. Share your must-have shots and inspiration during planning, and we’ll build a shot list. On the day, we guide natural posing and capture candid moments—so your vision comes to life."
  },
  {
    question: "Do you offer videography?",
    answer:
      "We specialize in photography, and we partner with trusted videographers. If you’d like video, we’ll recommend a great fit and coordinate so photo + video work seamlessly together."
  },
  {
    question: "What happens if you’re unavailable on my date?",
    answer:
      "Your event matters. In the rare case we cannot attend, we’ll arrange a trusted professional with a similar style to step in—so your day is fully covered without compromise."
  },
  {
    question: "Do you travel for events or destination weddings?",
    answer:
      "Yes—we travel throughout the U.S. and internationally. Travel fees vary by location, and we’ll provide a clear, all-inclusive quote before you book."
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
