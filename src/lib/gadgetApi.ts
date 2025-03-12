
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

// Export new streaming functionality
export {
  streamExportData
} from './gadget/export';

// Export connection utilities
export {
  createGadgetConnection,
  listGadgetConnections,
  deleteGadgetConnection
} from './gadget/connections';
