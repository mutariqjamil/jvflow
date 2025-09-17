import { useEffect, useCallback } from 'react'

/**
 * Performance optimization utilities for free tier deployments
 * Helps reduce resource usage and improve loading times
 */

export const PerformanceOptimizer = {
  // Lazy load images with intersection observer
  useLazyImages: () => {
    useEffect(() => {
      const images = document.querySelectorAll('img[data-src]')
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        })
      }, {
        rootMargin: '50px'
      })

      images.forEach(img => imageObserver.observe(img))

      return () => imageObserver.disconnect()
    }, [])
  },

  // Preload critical resources
  preloadCriticalResources: useCallback(() => {
    const criticalResources = [
      '/favicon.ico',
      // Add other critical resources here
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.includes('.css') ? 'style' : 'script'
      document.head.appendChild(link)
    })
  }, []),

  // Monitor performance metrics
  trackPerformance: useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navigationEntry = entry as PerformanceNavigationTiming
            console.log('Page Load Time:', navigationEntry.loadEventEnd - navigationEntry.fetchStart, 'ms')
          }
          
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime, 'ms')
          }
          
          if (entry.entryType === 'first-input') {
            console.log('FID:', (entry as any).processingStart - entry.startTime, 'ms')
          }
        }
      })

      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] })

      return () => observer.disconnect()
    }
  }, []),

  // Cache management for Supabase requests
  cacheManager: {
    set: (key: string, data: any, ttl: number = 300000) => { // 5 minutes default
      const item = {
        data,
        expiry: Date.now() + ttl
      }
      localStorage.setItem(`jv_cache_${key}`, JSON.stringify(item))
    },

    get: (key: string) => {
      const item = localStorage.getItem(`jv_cache_${key}`)
      if (!item) return null

      const parsed = JSON.parse(item)
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(`jv_cache_${key}`)
        return null
      }

      return parsed.data
    },

    clear: () => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('jv_cache_')) {
          localStorage.removeItem(key)
        }
      })
    }
  },

  // Bundle size analyzer
  analyzeBundle: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle analysis available in production build')
    }
  },

  // Memory usage tracker
  trackMemoryUsage: useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      console.log('Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`
      })
    }
  }, [])
}

// Hook for initializing performance optimizations
export const usePerformanceOptimizations = () => {
  const { useLazyImages, preloadCriticalResources, trackPerformance } = PerformanceOptimizer

  useEffect(() => {
    // Initialize optimizations
    preloadCriticalResources()
    const cleanup = trackPerformance()
    
    return cleanup
  }, [preloadCriticalResources, trackPerformance])

  useLazyImages()
}

// Component for monitoring resource usage
export const ResourceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        PerformanceOptimizer.trackMemoryUsage()
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [])

  return null
}