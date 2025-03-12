
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

// Export new types for better TypeScript support
export type {
  ConnectionType,
  ConnectionConfig,
  ConnectionResponse,
  AuthMethod
} from './gadget/connections';

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
  GadgetRateLimits
} from './gadget';
