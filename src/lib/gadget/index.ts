
/**
 * Gadget Integration - Main Entry Point
 * 
 * This module exports all the necessary functionality for Gadget integration
 * without referencing non-existent modules.
 */

// Re-export core client functionality
export * from './client';

// Re-export action functionality
export * from './actions';

// Re-export logging functionality 
export * from './logging';

// Re-export telemetry
export * from './telemetry';

// Define and export types used across the application
export interface GadgetConnectionOptions {
  apiKey: string;
  appId: string;
  environment: 'development' | 'production';
  enableNetworkLogs?: boolean;
}

export interface GadgetClientStatus {
  initialized: boolean;
  connected: boolean;
  lastChecked: string;
  errorCount: number;
}

export interface GadgetStorageLimits {
  maxRecords: number;
  currentUsage: number;
  percentUsed: number;
}

export interface GadgetRateLimits {
  requestsPerMinute: number;
  requestsRemaining: number;
  resetAt: string;
}

export interface GadgetActionResponse<T = any> {
  success: boolean;
  data: T;
  errors?: Array<{
    message: string;
    code: string;
  }>;
  performanceMetrics?: {
    durationMs: number;
    queryCount: number;
    cacheHitRate: number;
  };
}

export interface GadgetLiveQueryOptions {
  interval?: number;
  batchSize?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
}
