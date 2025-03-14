
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

// Health status
export interface GadgetHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
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
