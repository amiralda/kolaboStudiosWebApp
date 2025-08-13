// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'
import ContactFAB from '@/components/contact-fab'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora  = Sora({  subsets: ['latin'], variable: '--font-sora',  display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kolabostudios.com'),
  title: { default: 'Kolabo Studios', template: '%s | Kolabo Studios' },
  description:
    'Wedding, engagement, and maternity photography that captures every moment perfectly. Professional photography services in South Jersey.',
  openGraph: {
    type: 'website',
    url: 'https://kolabostudios.com',
    siteName: 'Kolabo Studios',
    images: [{ url: '/wedding-dance-sunset.png', width: 1200, height: 630, alt: 'Kolabo Studios' }],
  },
  twitter: { card: 'summary_large_image', images: ['/wedding-dance-sunset.png'] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-inter">
        <ErrorBoundary>
          <Navigation />
          <main>{children}</main>

          {/* Mount ONE global Contact FAB here */}
          <ContactFAB />

          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
