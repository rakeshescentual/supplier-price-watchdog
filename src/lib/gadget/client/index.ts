
/**
 * Gadget client module - entry point
 */

// Export client initialization functions
export {
  initGadgetClient,
  isGadgetInitialized,
  resetGadgetClient
} from './initialization';

// Export client status functions
export {
  getGadgetStatus,
  checkGadgetHealth,
  testGadgetConnection,
  displayGadgetStatus
} from './status';

// Export client connection types
export interface GadgetConnectionOptions {
  enableNetworkLogs?: boolean;
  maxRetries?: number;
  timeout?: number;
}

export interface GadgetClientStatus {
  isConnected: boolean;
  environment: string;
  latency?: number;
  lastChecked?: Date;
}
