import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'

/**
 * Component to monitor free tier usage and warn users before limits
 */

interface UsageStats {
  supabaseRequests: number
  storageUsed: number
  bandwidthUsed: number
  lastUpdated: Date
}

export const FreeTierMonitor = () => {
  const [usage, setUsage] = useState<UsageStats>({
    supabaseRequests: 0,
    storageUsed: 0,
    bandwidthUsed: 0,
    lastUpdated: new Date()
  })
  
  const [showWarning, setShowWarning] = useState(false)

  // Free tier limits
  const limits = {
    supabaseRequests: 500000, // 500k per month
    storageUsed: 1000, // 1GB in MB
    bandwidthUsed: 10000 // 10GB in MB
  }

  useEffect(() => {
    // Track usage from localStorage
    const trackUsage = () => {
      const requests = parseInt(localStorage.getItem('jv_supabase_requests') || '0')
      const storage = parseInt(localStorage.getItem('jv_storage_used') || '0')
      const bandwidth = parseInt(localStorage.getItem('jv_bandwidth_used') || '0')

      setUsage({
        supabaseRequests: requests,
        storageUsed: storage,
        bandwidthUsed: bandwidth,
        lastUpdated: new Date()
      })

      // Show warning if approaching limits (80%)
      const requestsWarning = requests > limits.supabaseRequests * 0.8
      const storageWarning = storage > limits.storageUsed * 0.8
      const bandwidthWarning = bandwidth > limits.bandwidthUsed * 0.8

      setShowWarning(requestsWarning || storageWarning || bandwidthWarning)
    }

    trackUsage()
    const interval = setInterval(trackUsage, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB'
    const mb = bytes
    return `${mb.toFixed(1)} MB`
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (process.env.NODE_ENV !== 'development' && !showWarning) {
    return null // Only show in development or when warning needed
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-2 z-50">
      {showWarning && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertDescription>
            ⚠️ Approaching free tier limits. Consider upgrading soon.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white border rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Free Tier Usage</h3>
          <Badge variant="outline" className="text-xs">
            {process.env.NODE_ENV === 'development' ? 'DEV' : 'LIVE'}
          </Badge>
        </div>

        <div className="space-y-3">
          {/* Supabase Requests */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>API Requests</span>
              <span>{usage.supabaseRequests.toLocaleString()} / {limits.supabaseRequests.toLocaleString()}</span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.supabaseRequests, limits.supabaseRequests)}
              className="h-2"
            />
          </div>

          {/* Storage */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Storage</span>
              <span>{formatBytes(usage.storageUsed)} / {formatBytes(limits.storageUsed)}</span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.storageUsed, limits.storageUsed)}
              className="h-2"
            />
          </div>

          {/* Bandwidth */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Bandwidth</span>
              <span>{formatBytes(usage.bandwidthUsed)} / {formatBytes(limits.bandwidthUsed)}</span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.bandwidthUsed, limits.bandwidthUsed)}
              className="h-2"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
          Last updated: {usage.lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

// Utility functions to track usage
export const usageTracker = {
  incrementRequests: () => {
    const current = parseInt(localStorage.getItem('jv_supabase_requests') || '0')
    localStorage.setItem('jv_supabase_requests', (current + 1).toString())
  },

  addStorage: (bytes: number) => {
    const current = parseInt(localStorage.getItem('jv_storage_used') || '0')
    localStorage.setItem('jv_storage_used', (current + Math.round(bytes / 1048576)).toString())
  },

  addBandwidth: (bytes: number) => {
    const current = parseInt(localStorage.getItem('jv_bandwidth_used') || '0')
    localStorage.setItem('jv_bandwidth_used', (current + Math.round(bytes / 1048576)).toString())
  },

  resetMonthly: () => {
    const lastReset = localStorage.getItem('jv_last_reset')
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`
    
    if (lastReset !== currentMonth) {
      localStorage.setItem('jv_supabase_requests', '0')
      localStorage.setItem('jv_storage_used', '0')
      localStorage.setItem('jv_bandwidth_used', '0')
      localStorage.setItem('jv_last_reset', currentMonth)
    }
  }
}