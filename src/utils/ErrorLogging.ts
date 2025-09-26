// Comprehensive Error Logging and Monitoring System for JV-Flow
// Supports frontend error tracking, API monitoring, and user experience analytics

export interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info' | 'debug'
  category: 'auth' | 'api' | 'ui' | 'network' | 'database' | 'system'
  message: string
  details?: any
  userAgent?: string
  url?: string
  userId?: string
  organizationId?: string
  sessionId: string
  stack?: string
  resolved?: boolean
}

interface MonitoringMetrics {
  responseTime: number
  errorRate: number
  userSessions: number
  apiCalls: number
  timestamp: string
}

class ErrorLoggingSystem {
  private logs: ErrorLog[] = []
  private sessionId: string
  private userId?: string
  private organizationId?: string
  private maxLogs: number = 1000

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeErrorHandlers()
    this.startPerformanceMonitoring()
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private initializeErrorHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('system', 'Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('system', 'Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      })
    })

    // Network errors
    this.monitorNetworkErrors()
  }

  private monitorNetworkErrors(): void {
    // Override fetch to monitor API calls
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0]?.toString() || 'unknown'
      
      try {
        console.log('[API] Request started:', url)
        const response = await originalFetch(...args)
        const endTime = performance.now()
        
        if (!response.ok) {
          this.logError('api', `API Error: ${response.status}`, {
            url,
            status: response.status,
            statusText: response.statusText,
            responseTime: endTime - startTime
          })
        } else {
          this.logInfo('api', `API Success: ${response.status}`, {
            url,
            status: response.status,
            responseTime: endTime - startTime
          })
        }
        
        return response
      } catch (error) {
        const endTime = performance.now()
        this.logError('network', 'Network Error', {
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: endTime - startTime
        })
        throw error
      }
    }
  }

  private startPerformanceMonitoring(): void {
    // Monitor page load times
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      this.logInfo('system', 'Page Load Performance', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.navigationStart
      })
    })
  }

  setUserContext(userId: string, organizationId?: string): void {
    this.userId = userId
    this.organizationId = organizationId
    console.log('[LOGGING] User context set:', { userId, organizationId })
  }

  clearUserContext(): void {
    this.userId = undefined
    this.organizationId = undefined
    console.log('[LOGGING] User context cleared')
  }

  logError(category: ErrorLog['category'], message: string, details?: any): void {
    this.addLog('error', category, message, details)
  }

  logWarning(category: ErrorLog['category'], message: string, details?: any): void {
    this.addLog('warn', category, message, details)
  }

  logInfo(category: ErrorLog['category'], message: string, details?: any): void {
    this.addLog('info', category, message, details)
  }

  logDebug(category: ErrorLog['category'], message: string, details?: any): void {
    this.addLog('debug', category, message, details)
  }

  private addLog(level: ErrorLog['level'], category: ErrorLog['category'], message: string, details?: any): void {
    const log: ErrorLog = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.userId,
      organizationId: this.organizationId,
      sessionId: this.sessionId,
      stack: new Error().stack,
      resolved: false
    }

    this.logs.push(log)
    
    // Console output with formatting
    const style = this.getLogStyle(level)
    console.log(`%c[${level.toUpperCase()}] ${category}: ${message}`, style, details)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Send critical errors to monitoring service (placeholder)
    if (level === 'error') {
      this.sendToMonitoringService(log)
    }
  }

  private generateLogId(): string {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
  }

  private getLogStyle(level: ErrorLog['level']): string {
    switch (level) {
      case 'error': return 'color: #ff4444; font-weight: bold;'
      case 'warn': return 'color: #ff8800; font-weight: bold;'
      case 'info': return 'color: #0088ff; font-weight: bold;'
      case 'debug': return 'color: #888888;'
      default: return ''
    }
  }

  private async sendToMonitoringService(log: ErrorLog): Promise<void> {
    // In a real implementation, this would send to services like:
    // - Sentry, LogRocket, DataDog, New Relic
    // For now, we'll store locally and provide export functionality
    
    try {
      // Store in localStorage as backup
      const existingLogs = JSON.parse(localStorage.getItem('jvflow_error_logs') || '[]')
      existingLogs.push(log)
      localStorage.setItem('jvflow_error_logs', JSON.stringify(existingLogs.slice(-100)))
    } catch (error) {
      console.warn('Failed to store error log:', error)
    }
  }

  getLogs(category?: ErrorLog['category'], level?: ErrorLog['level']): ErrorLog[] {
    return this.logs.filter(log => {
      const categoryMatch = !category || log.category === category
      const levelMatch = !level || log.level === level
      return categoryMatch && levelMatch
    })
  }

  getMetrics(): MonitoringMetrics {
    const recentLogs = this.logs.filter(log => 
      Date.now() - new Date(log.timestamp).getTime() < 60000 // Last minute
    )
    
    return {
      responseTime: this.calculateAverageResponseTime(),
      errorRate: recentLogs.filter(log => log.level === 'error').length / Math.max(recentLogs.length, 1),
      userSessions: 1, // Current session
      apiCalls: recentLogs.filter(log => log.category === 'api').length,
      timestamp: new Date().toISOString()
    }
  }

  private calculateAverageResponseTime(): number {
    const apiLogs = this.logs.filter(log => 
      log.category === 'api' && log.details?.responseTime
    ).slice(-10)
    
    if (apiLogs.length === 0) return 0
    
    const totalTime = apiLogs.reduce((sum, log) => sum + (log.details?.responseTime || 0), 0)
    return Math.round(totalTime / apiLogs.length)
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  clearLogs(): void {
    this.logs = []
    localStorage.removeItem('jvflow_error_logs')
    console.log('[LOGGING] All logs cleared')
  }

  // Pakistan-specific error tracking
  trackPakistanSpecificError(errorType: string, details: any): void {
    this.logError('system', `Pakistan Locale Error: ${errorType}`, {
      ...details,
      locale: 'pk-PK',
      currency: 'PKR',
      timezone: 'Asia/Karachi'
    })
  }
}

// Create singleton instance
export const errorLogger = new ErrorLoggingSystem()

// Export convenience functions
export const logError = (category: ErrorLog['category'], message: string, details?: any) => 
  errorLogger.logError(category, message, details)

export const logWarning = (category: ErrorLog['category'], message: string, details?: any) => 
  errorLogger.logWarning(category, message, details)

export const logInfo = (category: ErrorLog['category'], message: string, details?: any) => 
  errorLogger.logInfo(category, message, details)

export const logDebug = (category: ErrorLog['category'], message: string, details?: any) => 
  errorLogger.logDebug(category, message, details)

// Pakistan-specific logging
export const logPakistanError = (errorType: string, details: any) =>
  errorLogger.trackPakistanSpecificError(errorType, details)

export default errorLogger