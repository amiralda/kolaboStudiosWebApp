import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sora } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'
import { PerformanceProvider } from '@/components/performance-provider'
import { Phone, MessageCircle, MessageSquare } from 'lucide-react'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Kolabo Studios - Professional Photography',
    template: '%s | Kolabo Studios'
  },
  description: 'Wedding, engagement, and maternity photography that captures every moment perfectly. Professional photography services in South Jersey.',
  keywords: ['photography', 'wedding', 'engagement', 'maternity', 'south jersey', 'professional'],
  authors: [{ name: 'Kolabo Studios' }],
  creator: 'Kolabo Studios',
  publisher: 'Kolabo Studios',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kolabostudios.com',
    siteName: 'Kolabo Studios',
    title: 'Kolabo Studios - Professional Photography',
    description: 'Wedding, engagement, and maternity photography that captures every moment perfectly.',
    images: [
      {
        url: '/wedding-dance-sunset.png',
        width: 1200,
        height: 630,
        alt: 'Kolabo Studios Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kolabo Studios - Professional Photography',
    description: 'Wedding, engagement, and maternity photography that captures every moment perfectly.',
    images: ['/wedding-dance-sunset.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

function ContactFAB() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Call Button */}
      <a
        href="tel:+18564624062"
        className="flex items-center justify-center bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-all"
        title="Call Us"
      >
        <Phone size={22} />
      </a>

      {/* Text Button */}
      <a
        href="sms:+18564624062"
        className="flex items-center justify-center bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all"
        title="Send a Text"
      >
        <MessageSquare size={22} />
      </a>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/18564624062"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:bg-[#1DA851] transition-all"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={22} />
      </a>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//js.stripe.com" />
        <link rel="dns-prefetch" href="//wetransfer.com" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/wedding-dance-sunset.png"
          as="image"
          type="image/png"
        />
      </head>
      <body className="font-inter">
        <ErrorBoundary>
          <PerformanceProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
            <ContactFAB />
          </PerformanceProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
