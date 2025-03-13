
/**
 * Gadget.dev Integration Module
 * 
 * This module provides a comprehensive integration with Gadget.dev
 * for the Supplier Price Watch application. All Gadget-related
 * functionality is exported through this single entry point.
 * 
 * The modular architecture allows for easy migration to Gadget.dev
 * while maintaining backward compatibility for development.
 */

// Re-export all submodules for easy access
export * from './batch';
export * from './logging';
export * from './telemetry';
export * from './sync';
export * from './export';
export * from './processing';
export * from './pagination';
export * from './diagnostics';
export * from './shopify-integration';
export * from './mocks';
export * from './connections'; 
export * from './storage'; 
export * from './actions';
export * from './client'; // Now points to the folder instead of a file

// Core constants for Gadget integration
export const GADGET_API_VERSION = '2024-07'; // Updated to latest API version
export const GADGET_SDK_VERSION = '0.24.0'; // Updated to latest SDK version

// Define client connection and status types directly here to avoid import errors
export interface GadgetConnectionOptions {
  enableNetworkLogs?: boolean;
  maxRetries?: number;
  timeout?: number;
  enhancedTelemetry?: boolean;
  enableStreamingAPI?: boolean;
  disableBatching?: boolean;
  defaultPageSize?: number;
  fastRefresh?: boolean;
  useIncrementalSync?: boolean;
  enableRetry?: boolean; // New option for automatic retry handling
  retryConfig?: {
    maxRetries: number;
    initialDelay: number;
    backoffFactor: number;
  };
  customHeaders?: Record<string, string>; // Support for custom headers
}

export interface GadgetClientStatus {
  isConnected: boolean;
  environment: string;
  latency?: number;
  lastChecked?: Date;
  apiVersion?: string;
  features?: string[];
  activeConnections?: number;
  storageUsage?: {
    used: number;
    limit: number;
    percentage: number;
  };
  gatewayStatus?: 'healthy' | 'degraded' | 'down';
  dataRegion?: string;
  currentPlan?: string; // Added to track plan information
  featureFlags?: Record<string, boolean>; // For feature flags
}

// Add new exports for enhanced Gadget functionality
export interface GadgetStorageLimits {
  files: {
    count: number;
    size: number;
  };
  database: {
    records: number;
    size: number;
  };
  cache: {
    size: number;
    entries: number;
  };
  cdn?: { // Added CDN storage information
    size: number;
    requests: number;
  };
}

export interface GadgetRateLimits {
  tier: string;
  requests: {
    limit: number;
    remaining: number;
    resetAt: Date;
  };
  concurrentJobs?: number;
  perRoute?: Record<string, { // Enhanced per-route rate limiting
    limit: number;
    remaining: number;
    resetAt: Date;
  }>;
}

// Updated action response format with enhanced metrics
export interface GadgetActionResponse<T> {
  data: T;
  success: boolean;
  errors?: Array<{
    message: string;
    code: string;
    path?: string[];
  }>;
  warnings?: Array<{
    message: string;
    code: string;
  }>;
  performanceMetrics?: {
    durationMs: number;
    queryCount: number;
    cacheHitRate: number;
    memoryUsage?: number; // Track memory usage
    cpuTime?: number; // Track CPU time
  };
  traceId?: string; // For improved error tracking
  pagination?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

// New interface for Gadget live query subscriptions
export interface GadgetLiveQueryOptions {
  key: string[];
  onData: (data: any) => void;
  onError?: (error: Error) => void;
  variables?: Record<string, any>;
  debounceTime?: number;
}

/**
 * This module is designed to be compatible with Gadget.dev's architecture.
 * When migrating to Gadget.dev:
 * 
 * 1. Install the Gadget.dev client SDK: npm install @gadget-client/your-app-id
 * 2. Replace mock implementations with actual Gadget SDK calls
 * 3. Update configuration to point to your Gadget app
 * 
 * For more details on migration, see:
 * - src/assets/docs/GadgetMigrationGuide.md
 * - docs/GadgetMigration.md
 * 
 * The modular structure matches Gadget.dev's architecture, making
 * the migration process seamless.
 */

