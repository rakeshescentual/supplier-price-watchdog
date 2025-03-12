
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
export * from './connections'; // Add new connections module

// Explicitly re-export client functions to avoid ambiguity
export {
  initGadgetClient,
  isGadgetInitialized,
  checkGadgetHealth,
  resetGadgetClient,
  testGadgetConnection,
  displayGadgetStatus,
  getGadgetStatus
} from './client';

// Core constants for Gadget integration
export const GADGET_API_VERSION = '2023-11'; // Updated to latest API version
export const GADGET_SDK_VERSION = '0.18.0'; // Updated to latest SDK version

// Define client connection and status types directly here to avoid import errors
export interface GadgetConnectionOptions {
  enableNetworkLogs?: boolean;
  maxRetries?: number;
  timeout?: number;
  enhancedTelemetry?: boolean;
  enableStreamingAPI?: boolean; // Added support for streaming API
  disableBatching?: boolean;    // Option to disable automatic batching
  defaultPageSize?: number;     // Default page size for queries
}

export interface GadgetClientStatus {
  isConnected: boolean;
  environment: string;
  latency?: number;
  lastChecked?: Date;
  apiVersion?: string;
  features?: string[];
  activeConnections?: number; // Added metrics about active connections
  storageUsage?: {            // Added storage usage information
    used: number;
    limit: number;
    percentage: number;
  };
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
}

export interface GadgetRateLimits {
  tier: string;
  requests: {
    limit: number;
    remaining: number;
    resetAt: Date;
  };
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
