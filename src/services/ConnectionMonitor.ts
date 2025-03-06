
import { formatRelativeTime } from '@/utils/connection-helpers';

export type ConnectionStatus = 'connected' | 'degraded' | 'disconnected' | 'unknown';

export interface ConnectionInfo {
  service: string;
  status: ConnectionStatus;
  lastChecked: Date | null;
  message?: string;
  metadata?: Record<string, any>;
}

export interface ConnectionMonitorOptions {
  checkInterval?: number;
  onStatusChange?: (info: ConnectionInfo) => void;
  initialCheckDelay?: number;
}

/**
 * Service for monitoring the health of external service connections
 */
export class ConnectionMonitor {
  private info: ConnectionInfo;
  private checkFn: () => Promise<boolean>;
  private intervalId: number | null = null;
  private options: ConnectionMonitorOptions;
  
  constructor(
    service: string,
    checkFn: () => Promise<boolean>,
    options: ConnectionMonitorOptions = {}
  ) {
    this.info = {
      service,
      status: 'unknown',
      lastChecked: null
    };
    
    this.checkFn = checkFn;
    this.options = {
      checkInterval: options.checkInterval || 5 * 60 * 1000, // 5 minutes default
      onStatusChange: options.onStatusChange,
      initialCheckDelay: options.initialCheckDelay || 0
    };
  }
  
  /**
   * Start monitoring the connection
   */
  start(): void {
    // Perform initial check after specified delay
    setTimeout(() => {
      this.check();
      
      // Set up regular interval checks
      if (typeof window !== 'undefined' && !this.intervalId) {
        this.intervalId = window.setInterval(() => {
          this.check();
        }, this.options.checkInterval);
      }
    }, this.options.initialCheckDelay);
  }
  
  /**
   * Stop monitoring the connection
   */
  stop(): void {
    if (this.intervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Get the current connection info
   */
  getInfo(): ConnectionInfo {
    return { ...this.info };
  }
  
  /**
   * Get a formatted string of when the connection was last checked
   */
  getLastCheckedFormatted(): string {
    return formatRelativeTime(this.info.lastChecked);
  }
  
  /**
   * Manually check the connection
   */
  async check(): Promise<ConnectionInfo> {
    try {
      const isHealthy = await this.checkFn();
      const now = new Date();
      const previousStatus = this.info.status;
      
      // Update the connection info
      const newStatus: ConnectionStatus = isHealthy ? 'connected' : 'degraded';
      
      if (previousStatus !== newStatus) {
        this.info = {
          ...this.info,
          status: newStatus,
          lastChecked: now,
          message: isHealthy 
            ? `Connection to ${this.info.service} is healthy` 
            : `Connection to ${this.info.service} is degraded`
        };
        
        // Notify of status change
        this.options.onStatusChange?.(this.info);
      } else {
        // Just update the timestamp if status hasn't changed
        this.info.lastChecked = now;
      }
    } catch (error) {
      this.info = {
        ...this.info,
        status: 'disconnected',
        lastChecked: new Date(),
        message: `Failed to connect to ${this.info.service}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      
      this.options.onStatusChange?.(this.info);
    }
    
    return this.info;
  }
}

// Singleton instance for managing multiple connection monitors
class ConnectionMonitorManager {
  private monitors: Map<string, ConnectionMonitor> = new Map();
  
  addMonitor(service: string, monitor: ConnectionMonitor): void {
    this.monitors.set(service, monitor);
  }
  
  getMonitor(service: string): ConnectionMonitor | undefined {
    return this.monitors.get(service);
  }
  
  getAllMonitors(): Map<string, ConnectionMonitor> {
    return new Map(this.monitors);
  }
  
  startAll(): void {
    this.monitors.forEach(monitor => monitor.start());
  }
  
  stopAll(): void {
    this.monitors.forEach(monitor => monitor.stop());
  }
}

export const connectionMonitorManager = new ConnectionMonitorManager();
