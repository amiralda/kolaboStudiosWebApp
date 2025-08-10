'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { PerformanceMonitor, PerformanceMetrics, PerformanceScore } from '@/lib/performance-monitor'

interface PerformanceContextType {
  metrics: PerformanceMetrics
  score: PerformanceScore
  isLoading: boolean
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    domContentLoaded: null,
    loadComplete: null
  })
  
  const [score, setScore] = useState<PerformanceScore>({ score: 0, grade: 'F' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    PerformanceMonitor.init()
    
    const interval = setInterval(() => {
      const currentMetrics = PerformanceMonitor.getMetrics()
      const currentScore = PerformanceMonitor.getScore()
      
      setMetrics(currentMetrics)
      setScore(currentScore)
      
      // Stop loading once we have some metrics
      if (currentMetrics.lcp !== null || currentMetrics.ttfb !== null) {
        setIsLoading(false)
      }
    }, 1000)

    // Stop loading after 5 seconds regardless
    const timeout = setTimeout(() => setIsLoading(false), 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      PerformanceMonitor.cleanup()
    }
  }, [])

  return (
    <PerformanceContext.Provider value={{ metrics, score, isLoading }}>
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformance() {
  const context = useContext(PerformanceContext)
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}
