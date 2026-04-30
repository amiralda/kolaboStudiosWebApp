import { createRequire } from 'module';
const require = createRequire(import.meta.url);
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    unoptimized: false,
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  compress: true,

  async headers() {
    return [
      {
        // Apply security headers to every route
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // XSS auditor (legacy browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Don't send Referer to cross-origin destinations
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable unnecessary browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Force HTTPS for 1 year (enable once fully on HTTPS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // DNS prefetch
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Content Security Policy
          // 'unsafe-inline' is required by Next.js for style injection;
          // 'unsafe-eval' is required by Stripe.js.
          // Tighten these as the app matures (e.g., use nonces).
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.stripe.com https://*.vercel-storage.com https://*.supabase.co",
              "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.vercel-storage.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // Long-term cache for immutable static assets
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)

