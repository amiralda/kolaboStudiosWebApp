export interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
  domContentLoaded: number | null
  loadComplete: number | null
}

export interface PerformanceScore {
  score: number
  grade: string
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    domContentLoaded: null,
    loadComplete: null
  }

  private static observers: PerformanceObserver[] = []

  static init() {
    if (typeof window === 'undefined') return

    this.measureNavigationTiming()
    this.measureCoreWebVitals()
  }

  private static measureNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
      this.metrics.loadComplete = navigation.loadEventEnd - navigation.navigationStart
    }
  }

  private static measureCoreWebVitals() {
    // Measure LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.startTime
      })
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (e) {
        console.warn('LCP measurement not supported')
      }

      // Measure FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime
        })
      })

      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)
      } catch (e) {
        console.warn('FID measurement not supported')
      }

      // Measure CLS
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.cls = clsValue
          }
        })
      })

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (e) {
        console.warn('CLS measurement not supported')
      }

      // Measure FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime
          }
        })
      })

      try {
        fcpObserver.observe({ entryTypes: ['paint'] })
        this.observers.push(fcpObserver)
      } catch (e) {
        console.warn('FCP measurement not supported')
      }
    }
  }

  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  static getScore(): PerformanceScore {
    const { lcp, fid, cls } = this.metrics
    
    let score = 100
    
    // LCP scoring (0-40 points)
    if (lcp !== null) {
      if (lcp > 4000) score -= 40
      else if (lcp > 2500) score -= 20
    }
    
    // FID scoring (0-30 points)
    if (fid !== null) {
      if (fid > 300) score -= 30
      else if (fid > 100) score -= 15
    }
    
    // CLS scoring (0-30 points)
    if (cls !== null) {
      if (cls > 0.25) score -= 30
      else if (cls > 0.1) score -= 15
    }

    let grade = 'A'
    if (score < 90) grade = 'B'
    if (score < 80) grade = 'C'
    if (score < 70) grade = 'D'
    if (score < 60) grade = 'F'

    return { score: Math.max(0, score), grade }
  }

  static sendMetrics() {
    console.log('📊 Performance Metrics:', this.getMetrics())
    console.log('🎯 Performance Score:', this.getScore())
  }

  static cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}
