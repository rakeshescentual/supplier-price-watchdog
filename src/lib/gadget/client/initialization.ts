
/**
 * Client initialization functionality for Gadget
 */
import { logInfo, logError } from '../logging';
import { GadgetConfig } from '@/types/price';

// Client storage
let cachedClient: any = null;
let lastConfigHash: string | null = null;

/**
 * Helper function to create a hash of the configuration
 */
const createConfigHash = (config: GadgetConfig): string => {
  return `${config.appId}-${config.environment}-${config.apiKey.substring(0, 8)}`;
};

/**
 * Initialize the Gadget client with modern patterns
 * @returns Initialized Gadget client
 */
export const initGadgetClient = (): any => {
  // In a production environment, this would use the Gadget SDK
  // For now, mock the client for testing
  if (cachedClient) {
    return cachedClient;
  }
  
  // In a production implementation:
  // import { createClient } from '@gadgetinc/api-client-core';
  // or import the generated TypeScript SDK:
  // import { Client } from '@gadgetinc/{appId}-js';
  //
  // const client = new Client({
  //   authenticationMode: { 
  //     apiKey: config.apiKey
  //   },
  //   environment: config.environment,
  //   requestLogging: config.environment === 'development'
  // });
  
  // Mock client for testing
  cachedClient = {
    ready: true,
    query: {},
    mutate: {}
  };
  
  logInfo('Initialized mock Gadget client', {}, 'client');
  
  return cachedClient;
};

/**
 * Reset the Gadget client
 */
export const resetGadgetClient = (): void => {
  cachedClient = null;
  lastConfigHash = null;
  logInfo('Reset Gadget client', {}, 'client');
};

/**
 * Check if the Gadget client is initialized
 * @returns True if the client is initialized, false otherwise
 */
export const isGadgetInitialized = (): boolean => {
  return cachedClient !== null && cachedClient.ready === true;
};
