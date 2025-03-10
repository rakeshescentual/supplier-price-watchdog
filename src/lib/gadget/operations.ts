
/**
 * Common Gadget operations for the application
 */
import { logInfo, logError } from './logging';
import { reportError } from './telemetry';
import { 
  initGadgetClient, 
  isGadgetInitialized, 
  testGadgetConnection,
  checkGadgetHealth,
  resetGadgetClient
  // Removed the duplicate import of getGadgetStatus
} from './client';

// Re-export common functions for convenience
export {
  initGadgetClient,
  isGadgetInitialized,
  testGadgetConnection,
  checkGadgetHealth,
  resetGadgetClient
  // Removed the duplicate export of getGadgetStatus
};

// Add any additional operation-specific functions here
