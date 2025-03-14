
/**
 * Connection testing and status utilities for Gadget client
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from './initialization';
import { checkGadgetHealth } from './health';
import { getDisplayInfo } from './display';

/**
 * Test connection to Gadget
 * @returns Promise resolving to boolean indicating if connection was successful
 */
export const testGadgetConnection = async (): Promise<boolean> => {
  const client = initGadgetClient();
  
  if (!client) {
    logInfo('Gadget client is not initialized', {}, 'connection');
    return false;
  }
  
  try {
    // Updated for latest Gadget API
    // In production with actual Gadget SDK:
    // const healthCheck = await client.connection.healthCheck();
    // return healthCheck.status === 'healthy';
    
    // For mock implementation, simply return true
    return true;
  } catch (error) {
    logError('Error testing Gadget connection', { error }, 'connection');
    return false;
  }
};

/**
 * Get detailed Gadget status
 * @returns Promise resolving to status information
 */
export const getGadgetStatus = async (): Promise<{
  isConnected: boolean;
  environment: string;
  latency?: number;
  version?: string;
  services: {
    api: boolean;
    database: boolean;
    storage: boolean;
    scheduler: boolean;
  };
}> => {
  const client = initGadgetClient();
  
  if (!client) {
    return {
      isConnected: false,
      environment: 'unknown',
      services: {
        api: false,
        database: false,
        storage: false,
        scheduler: false
      }
    };
  }
  
  const displayInfo = getDisplayInfo();
  const healthCheck = await checkGadgetHealth();
  
  // Updated format to match latest Gadget status response
  return {
    isConnected: true,
    environment: client.config?.environment || 'development',
    latency: 42, // Mock latency value
    version: displayInfo.version,
    services: {
      api: healthCheck.status === 'healthy',
      database: healthCheck.status === 'healthy',
      storage: healthCheck.status === 'healthy',
      scheduler: healthCheck.status === 'healthy'
    }
  };
};
