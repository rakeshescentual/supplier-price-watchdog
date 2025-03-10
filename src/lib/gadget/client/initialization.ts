
/**
 * Gadget client initialization utilities
 */
import { getGadgetConfig } from '@/utils/gadget-helpers';
import { logInfo } from '../logging';

// Cache for client instance to avoid recreating on every call
let cachedClient: any = null;
let lastConfigHash: string = '';

/**
 * Create a hash from config to detect changes
 */
const createConfigHash = (config: any): string => {
  return `${config.appId}:${config.apiKey}:${config.environment}`;
};

/**
 * Initialize Gadget client
 * @returns Initialized Gadget client or null if configuration is missing
 */
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) {
    logInfo('Gadget client initialization skipped: No configuration found', {}, 'client');
    return null;
  }

  // Create a hash of the current config
  const configHash = createConfigHash(config);
  
  // Return cached client if configuration hasn't changed
  if (cachedClient && configHash === lastConfigHash) {
    return cachedClient;
  }
  
  logInfo(`Initializing Gadget client for ${config.appId} (${config.environment})`, {
    featureFlags: config.featureFlags || {}
  }, 'client');
  
  // For Gadget.dev migration:
  // Import the Gadget client SDK for your app
  // import { createClient } from '@gadget-client/your-app-id';
  // cachedClient = createClient({ 
  //   apiKey: config.apiKey,
  //   environment: config.environment,
  //   enableNetworkLogs: config.environment === 'development'
  // });
  
  // For development: Create a mock client with API methods
  cachedClient = { 
    config, 
    ready: true,
    query: {},
    mutate: {}
  };
  
  // Update last config hash
  lastConfigHash = configHash;
  
  return cachedClient;
};

/**
 * Check if Gadget client is initialized
 * @returns Boolean indicating if Gadget is initialized
 */
export const isGadgetInitialized = (): boolean => {
  const client = initGadgetClient();
  return !!client?.ready;
};

/**
 * Reset client cache to force reinitialization
 */
export const resetGadgetClient = (): void => {
  cachedClient = null;
  lastConfigHash = '';
  logInfo('Gadget client cache reset', {}, 'client');
};
