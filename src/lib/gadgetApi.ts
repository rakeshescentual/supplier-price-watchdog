
/**
 * Main entry point for Gadget.dev API integration
 * Re-exports all Gadget functions from the modular structure
 * This file maintains backward compatibility with existing imports
 */

// Export all Gadget functionality
export * from './gadget';

// Re-export specific functions for backward compatibility
export { 
  initGadgetClient, 
  isGadgetInitialized, 
  checkGadgetHealth, 
  resetGadgetClient,
  testGadgetConnection,
  displayGadgetStatus
} from './gadget/client';

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

// Export new storage optimization utilities
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
  getAuthenticationMethods
} from './gadget/connections/auth';

// Export new custom action methods
export {
  runGadgetAction,
  analyzePriceChanges,
  scheduleCompetitorCheck,
  syncPricesToPlatforms,
  generatePriceRecommendations
} from './gadget/actions';

// Export Shopify Plus specific functionality from the new modular structure
export {
  deployShopifyScript,
  createShopifyFlow,
  syncB2BPrices,
  scheduleShopifyPriceChanges
} from './gadget/shopify-integration';

// Export new types for better TypeScript support
export type {
  ConnectionType,
  ConnectionConfig,
  ConnectionResponse,
  AuthMethod
} from './gadget/connections';

export type {
  OAuthConfig,
  ApiKeyConfig
} from './gadget/connections/auth';

export type {
  ExportFormat,
  ExportOptions,
  ExportResult,
  CompressionType
} from './gadget/export';

export type {
  GadgetConnectionOptions,
  GadgetClientStatus,
  GadgetStorageLimits,
  GadgetRateLimits,
  GadgetActionResponse,
  GadgetLiveQueryOptions
} from './gadget';

export type {
  CacheOptions
} from './gadget/storage';
