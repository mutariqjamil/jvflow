// Enhanced logging system for JV-Flow
// Supports different log levels, categories, and output formats

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'auth' | 'api' | 'database' | 'ui' | 'system' | 'crud' | 'test' | 'general';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  userId?: string;
  organizationId?: string;
  sessionId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000; // Keep only last 1000 logs in memory
  private sessionId: string;
  private isDemoMode: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isDemoMode = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('demo') ||
                     !this.isProductionEnvironment();
    
    // Initialize session
    this.log('info', 'system', 'Logger initialized', { sessionId: this.sessionId, isDemoMode: this.isDemoMode });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isProductionEnvironment(): boolean {
    return process.env.NODE_ENV === 'production' && 
           !window.location.hostname.includes('localhost') && 
           !window.location.hostname.includes('demo');
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDemoMode) return true; // Always log in demo mode
    
    const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
    const minLevel = this.isProductionEnvironment() ? 'warn' : 'debug';
    return levelPriority[level] >= levelPriority[minLevel];
  }

  private addToMemory(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private sendToConsole(entry: LogEntry): void {
    const prefix = `[${entry.level.toUpperCase()}] [${entry.category.toUpperCase()}]`;
    const message = `${prefix} ${entry.message}`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(message, entry.data || '');
        break;
      case 'info':
        console.info(message, entry.data || '');
        break;
      case 'warn':
        console.warn(message, entry.data || '');
        break;
      case 'error':
        console.error(message, entry.data || '');
        break;
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (this.isDemoMode) return; // Don't send to remote in demo mode
    
    try {
      // In production, you would send logs to your logging service
      // For now, we'll store in localStorage as a backup
      const logsKey = 'jvflow_logs';
      const existingLogs = JSON.parse(localStorage.getItem(logsKey) || '[]');
      existingLogs.push(entry);
      
      // Keep only last 100 logs in localStorage
      const recentLogs = existingLogs.slice(-100);
      localStorage.setItem(logsKey, JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to store log entry:', error);
    }
  }

  public log(level: LogLevel, category: LogCategory, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      category,
      message,
      data,
      sessionId: this.sessionId,
      userId: this.getCurrentUserId(),
      organizationId: this.getCurrentOrganizationId()
    };

    this.addToMemory(entry);
    this.sendToConsole(entry);
    this.sendToRemote(entry);
  }

  private getCurrentUserId(): string | undefined {
    // Try to get current user ID from various sources
    try {
      const authState = JSON.parse(localStorage.getItem('auth_state') || '{}');
      return authState.user?.id;
    } catch {
      return undefined;
    }
  }

  private getCurrentOrganizationId(): string | undefined {
    try {
      return localStorage.getItem('currentOrganizationId') || undefined;
    } catch {
      return undefined;
    }
  }

  // Convenience methods for different log levels
  public debug(category: LogCategory, message: string, data?: any): void {
    this.log('debug', category, message, data);
  }

  public info(category: LogCategory, message: string, data?: any): void {
    this.log('info', category, message, data);
  }

  public warn(category: LogCategory, message: string, data?: any): void {
    this.log('warn', category, message, data);
  }

  public error(category: LogCategory, message: string, data?: any): void {
    this.log('error', category, message, data);
  }

  // Specialized logging methods
  public authLog(level: LogLevel, message: string, data?: any): void {
    this.log(level, 'auth', message, data);
  }

  public apiLog(level: LogLevel, message: string, data?: any): void {
    this.log(level, 'api', message, data);
  }

  public dbLog(level: LogLevel, message: string, data?: any): void {
    this.log(level, 'database', message, data);
  }

  public crudLog(level: LogLevel, operation: string, entity: string, data?: any): void {
    this.log(level, 'crud', `${operation.toUpperCase()} ${entity}`, data);
  }

  public testLog(level: LogLevel, test: string, data?: any): void {
    this.log(level, 'test', test, data);
  }

  // Performance logging
  public startTimer(timerName: string): void {
    const startTime = performance.now();
    (window as any).__jvflow_timers = (window as any).__jvflow_timers || {};
    (window as any).__jvflow_timers[timerName] = startTime;
    this.debug('system', `Timer started: ${timerName}`);
  }

  public endTimer(timerName: string): number {
    const timers = (window as any).__jvflow_timers || {};
    const startTime = timers[timerName];
    if (!startTime) {
      this.warn('system', `Timer not found: ${timerName}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    delete timers[timerName];
    this.info('system', `Timer completed: ${timerName}`, { duration: `${duration.toFixed(2)}ms` });
    return duration;
  }

  // Get logs for debugging
  public getLogs(category?: LogCategory, level?: LogLevel): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    return filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Export logs for debugging
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear logs
  public clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('jvflow_logs');
    this.info('system', 'Logs cleared');
  }

  // Get session info
  public getSessionInfo(): { sessionId: string; isDemoMode: boolean; logCount: number } {
    return {
      sessionId: this.sessionId,
      isDemoMode: this.isDemoMode,
      logCount: this.logs.length
    };
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const authLog = (level: LogLevel, message: string, data?: any) => logger.authLog(level, message, data);
export const apiLog = (level: LogLevel, message: string, data?: any) => logger.apiLog(level, message, data);
export const dbLog = (level: LogLevel, message: string, data?: any) => logger.dbLog(level, message, data);
export const crudLog = (level: LogLevel, operation: string, entity: string, data?: any) => logger.crudLog(level, operation, entity, data);
export const testLog = (level: LogLevel, test: string, data?: any) => logger.testLog(level, test, data);

// Export the logger as default
export default logger;