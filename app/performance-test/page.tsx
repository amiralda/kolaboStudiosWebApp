'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WebVitals {
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
}

export default function PerformanceTestPage() {
  const [vitals, setVitals] = useState<WebVitals>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Measure TTFB
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        setVitals(prev => ({
          ...prev,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart
        }))
      }
    }

    // Measure Core Web Vitals
    const measureWebVitals = async () => {
      try {
        // Import web-vitals dynamically
        const { onCLS, onINP, onLCP } = await import('web-vitals')

        onCLS((metric) => {
          setVitals(prev => ({ ...prev, cls: metric.value }))
        })

        onINP((metric) => {
          setVitals(prev => ({ ...prev, fid: metric.value }))
        })

        onLCP((metric) => {
          setVitals(prev => ({ ...prev, lcp: metric.value }))
        })

        measureTTFB()
        setIsLoading(false)
      } catch (error) {
        console.error('Error measuring web vitals:', error)
        setIsLoading(false)
      }
    }

    measureWebVitals()
  }, [])

  const getScoreColor = (value: number | null, thresholds: [number, number]) => {
    if (value === null) return 'secondary'
    if (value <= thresholds[0]) return 'default' // Good (green)
    if (value <= thresholds[1]) return 'secondary' // Needs improvement (yellow)
    return 'destructive' // Poor (red)
  }

  const getScoreText = (value: number | null, thresholds: [number, number]) => {
    if (value === null) return 'Measuring...'
    if (value <= thresholds[0]) return 'Good'
    if (value <= thresholds[1]) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Performance Test Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Real-time Core Web Vitals monitoring for Kolabo Studios
          </p>
        </div>

        {isLoading && (
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Measuring performance metrics...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* LCP */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">LCP</CardTitle>
              <CardDescription>Largest Contentful Paint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {vitals.lcp ? `${(vitals.lcp / 1000).toFixed(2)}s` : '—'}
              </div>
              <Badge variant={getScoreColor(vitals.lcp, [2500, 4000])}>
                {getScoreText(vitals.lcp, [2500, 4000])}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                Good: ≤2.5s | Poor: &gt;4.0s
              </p>
            </CardContent>
          </Card>

          {/* FID */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">FID</CardTitle>
              <CardDescription>First Input Delay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {vitals.fid ? `${vitals.fid.toFixed(0)}ms` : '—'}
              </div>
              <Badge variant={getScoreColor(vitals.fid, [100, 300])}>
                {getScoreText(vitals.fid, [100, 300])}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                Good: ≤100ms | Poor: &gt;300ms
              </p>
            </CardContent>
          </Card>

          {/* CLS */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CLS</CardTitle>
              <CardDescription>Cumulative Layout Shift</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {vitals.cls ? vitals.cls.toFixed(3) : '—'}
              </div>
              <Badge variant={getScoreColor(vitals.cls, [0.1, 0.25])}>
                {getScoreText(vitals.cls, [0.1, 0.25])}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                Good: ≤0.1 | Poor: &gt;0.25
              </p>
            </CardContent>
          </Card>

          {/* TTFB */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">TTFB</CardTitle>
              <CardDescription>Time to First Byte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {vitals.ttfb ? `${vitals.ttfb.toFixed(0)}ms` : '—'}
              </div>
              <Badge variant={getScoreColor(vitals.ttfb, [800, 1800])}>
                {getScoreText(vitals.ttfb, [800, 1800])}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                Good: ≤800ms | Poor: &gt;1.8s
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Run Full Lighthouse Audit</CardTitle>
            <CardDescription>
              Get comprehensive performance, accessibility, and SEO scores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Option 1: Automated Script</h4>
              <code className="text-sm bg-white p-2 rounded block">
                chmod +x scripts/run-lighthouse.sh<br/>
                npm run build && npm run start<br/>
                ./scripts/run-lighthouse.sh
              </code>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Option 2: Chrome DevTools</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Open Chrome DevTools (F12)</li>
                <li>Go to "Lighthouse" tab</li>
                <li>Click "Generate report"</li>
              </ol>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Option 3: Manual CLI</h4>
              <code className="text-sm bg-white p-2 rounded block">
                npm install -g lighthouse<br/>
                lighthouse http://localhost:3000 --output=html
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
