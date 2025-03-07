
/**
 * TypeScript declarations for Gadget.dev integration
 * This helps with migrating to the official Gadget.dev SDK
 */

declare module '@/types/gadget' {
  import { PriceItem, ShopifyContext } from '@/types/price';

  /**
   * Configuration for Gadget client
   */
  interface GadgetClientConfig {
    apiKey: string;
    appId: string;
    environment: 'development' | 'production';
    enableNetworkLogs?: boolean;
    featureFlags?: Record<string, boolean>;
  }

  /**
   * Gadget client interface for migration to Gadget.dev
   */
  interface GadgetClient {
    config: GadgetClientConfig;
    ready: boolean;
    query: Record<string, any>;  // Will be replaced with actual query methods
    mutate: Record<string, any>; // Will be replaced with actual mutation methods
  }

  /**
   * Structured logging data
   */
  interface LogData {
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    component: string;
    data?: any;
    timestamp: string;
  }

  /**
   * Performance tracking data
   */
  interface PerformanceData {
    event: string;
    startTime?: number | string;
    endTime?: number | string;
    durationMs?: number;
    metadata?: Record<string, any>;
    [key: string]: any;
  }

  /**
   * Health check result
   */
  interface HealthCheckResult {
    healthy: boolean;
    statusCode?: number;
    message?: string;
    details?: Record<string, any>;
    timestamp?: string;
  }

  /**
   * Diagnostic test result
   */
  interface DiagnosticResult {
    status: 'healthy' | 'degraded' | 'down';
    results: Record<string, {
      status: 'pass' | 'fail' | 'warn';
      message: string;
      details?: any;
    }>;
    timestamp: string;
  }
}
