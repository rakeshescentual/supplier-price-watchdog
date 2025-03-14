
/**
 * Types for Gadget.dev integration
 */

// Configuration
export interface GadgetConfig {
  apiKey: string;
  appId: string;
  environment: 'development' | 'production';
  featureFlags: {
    enableAdvancedAnalytics: boolean;
    enablePdfProcessing: boolean;
    enableBackgroundJobs?: boolean;
    enableShopifySync?: boolean;
    enableMarketData?: boolean;
  };
}

// Connection options
export interface GadgetConnectionOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  cacheResults?: boolean;
}

// Client status
export interface GadgetClientStatus {
  initialized: boolean;
  authenticated: boolean;
  healthy: boolean;
  environment: 'development' | 'production';
  lastChecked?: Date;
}

// Rate limits
export interface GadgetRateLimits {
  requestsPerMinute: number;
  remaining: number;
  resetAt: Date;
}

// Storage limits
export interface GadgetStorageLimits {
  totalBytes: number;
  usedBytes: number;
  remainingBytes: number;
  percentUsed: number;
}

// Live query options
export interface GadgetLiveQueryOptions {
  pollInterval?: number;
  skipInitialQuery?: boolean;
  onError?: (error: Error) => void;
}

// Health status
export interface GadgetHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  details?: {
    services: {
      api: boolean;
      database: boolean;
      storage: boolean;
      scheduler: boolean;
    };
    latency?: number;
    version?: string;
  };
}

// Client response types
export interface GadgetClientResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
  status: number;
}

// Action response
export interface GadgetActionResponse<T = any> {
  success: boolean;
  data: T;
  errors?: Array<{
    message: string;
    code: string;
    path?: string[];
  }>;
  performanceMetrics?: {
    durationMs: number;
    queryCount: number;
    cacheHitRate: number;
  };
}

// Sync response types
export interface GadgetSyncResponse {
  success: boolean;
  message?: string;
  itemCount?: number;
  errors?: Array<{
    item: string;
    message: string;
  }>;
}

// Function types
export type GadgetErrorReporter = (
  error: Error | string, 
  context?: Record<string, any>
) => Promise<void>;

export type GadgetTelemetryTracker = (
  event: string, 
  properties?: Record<string, any>
) => void;

// Batch operation types
export interface GadgetBatchOptions {
  batchSize?: number;
  retryCount?: number;
  retryDelay?: number;
  concurrency?: number;
  onProgress?: (processed: number, total: number) => void;
}
