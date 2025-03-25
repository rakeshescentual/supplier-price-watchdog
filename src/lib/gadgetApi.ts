
/**
 * Main entry point for Gadget.dev API integration
 * Re-exports all Gadget functions from the modular structure
 * This file maintains backward compatibility with existing imports
 */

// Re-export specific functions for initialization and client management first
// to avoid circular dependencies
export { 
  initGadgetClient, 
  isGadgetInitialized, 
  checkGadgetHealth, 
  resetGadgetClient,
  displayGadgetStatus
} from './gadget/client';

// Now that the core client functions are exported, export other modules
export * from './gadget';

// Import and re-export connection functions
export { testGadgetConnection, getGadgetStatus } from './gadget/client/connection';

// Export logging functionality (moving this up to avoid circular dependencies)
export {
  logger,
  logDebug,
  logInfo,
  logWarning,
  logError
} from './gadget/logging';

// Export sync functionality
export {
  authenticateShopify,
  syncToShopifyViaGadget,
  validateSyncItems,
  prepareItemsForSync
} from './gadget/sync';

export {
  performBatchOperations,
  processPaginatedData
} from './gadget/batch';

// Export PDF processing functionality
export {
  processPdfWithGadget
} from './gadget/pdf';

// Export enhanced export functionality
export {
  exportData,
  streamExportData,
  exportPriceItemsToShopify,
  scheduleExportJob
} from './gadget/export';

// Export enhanced connection utilities
export {
  createGadgetConnection,
  listGadgetConnections,
  deleteGadgetConnection,
  getGadgetConnectionStatus,
  refreshGadgetConnection,
  testGadgetConnectionAccess
} from './gadget/connections';

// Export new Live Query functionality
export {
  createLiveQuery,
  cleanupAllLiveQueries
} from './gadget/liveQuery';

// Export storage optimization utilities
export {
  setCacheValue,
  getCacheValue,
  clearCacheValue,
  withCache,
  clearCacheByPrefix,
  getCacheStats,
  bulkSetCacheValues,
  refreshCacheValue
} from './gadget/storage';

// Export enhanced authentication methods
export {
  initiateOAuthFlow,
  handleOAuthCallback,
  authenticateWithApiKey,
  revokeAuthentication,
  getAuthenticationMethods,
  initiateGadgetOAuth,
  handleGadgetOAuthCallback,
  createGadgetAuthHeaders
} from './gadget/connections/auth';

// Export new custom action methods
export {
  runGadgetAction,
  analyzePriceChanges,
  scheduleCompetitorCheck,
  syncPricesToPlatforms,
  generatePriceRecommendations
} from './gadget/actions';

// Export Shopify Plus specific functionality directly from shopify-integration.ts
export {
  deployShopifyScript,
  createShopifyFlow,
  syncB2BPrices,
  scheduleShopifyPriceChanges,
  createShopifyMultipassToken,
  createB2BCompany,
  createShopifyGiftCard
} from './gadget/shopify-integration';

// Export new background job utilities
export {
  executeBatchOperationWithBackgroundJob,
  executeGadgetOperation,
  processGadgetError
} from './gadget/operations';

// Export new types for better TypeScript support
export type {
  ConnectionType,
  ConnectionConfig,
  ConnectionResponse
} from './gadget/connections';

export type {
  AuthMethod,
  OAuthConfig,
  ApiKeyConfig
} from './gadget/connections/auth';

export type {
  ExportFormat,
  ExportOptions,
  ExportResult,
  CompressionType
} from './gadget/export';

// Export enhanced types from gadget/types.ts
export type {
  GadgetConfig,
  GadgetConnectionOptions,
  GadgetClientStatus,
  GadgetStorageLimits,
  GadgetRateLimits,
  GadgetActionResponse,
  GadgetLiveQueryOptions,
  GadgetHealthStatus,
  GadgetSyncResponse,
  GadgetClientResponse,
  GadgetBatchOptions,
  GadgetErrorReporter,
  GadgetTelemetryTracker
} from './gadget/types';

// Export health check result type
export type { HealthCheckResult } from './gadget/client/health';

// Export new Live Query types
export type {
  LiveQueryOptions,
  LiveQuerySubscription
} from './gadget/liveQuery';
