
/**
 * Gadget client status management
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from './initialization';
import { getGadgetConfig, createGadgetHeaders, getGadgetApiUrl } from '@/utils/gadget-helpers';

/**
 * Get detailed Gadget status information
 * @returns Object with detailed Gadget status
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
  const config = getGadgetConfig();
  
  if (!config) {
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
  
  try {
    // Start timing for latency measurement
    const startTime = Date.now();
    
    // For Gadget.dev migration:
    // const url = `${getGadgetApiUrl(config)}status/detailed`;
    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: createGadgetHeaders(config)
    // });
    // 
    // const data = await response.json();
    // const latency = Date.now() - startTime;
    
    // For development: Simulate a status check
    const isConnected = await testGadgetConnection();
    const latency = Date.now() - startTime;
    
    // Mock response data
    return {
      isConnected,
      environment: config.environment,
      latency,
      version: "1.0.0",
      services: {
        api: isConnected,
        database: isConnected,
        storage: isConnected,
        scheduler: isConnected
      }
    };
  } catch (error) {
    logError('Error getting Gadget status', { error }, 'client');
    
    return {
      isConnected: false,
      environment: config.environment,
      services: {
        api: false,
        database: false,
        storage: false,
        scheduler: false
      }
    };
  }
};

/**
 * Test Gadget connection and configuration
 * @param configOverride Optional config override for testing
 * @returns Promise resolving to a boolean indicating connection success
 */
export const testGadgetConnection = async (configOverride?: any): Promise<boolean> => {
  const config = configOverride || getGadgetConfig();
  if (!config) {
    logInfo('Gadget connection test skipped: No configuration found', {}, 'client');
    return false;
  }

  try {
    logInfo('Testing Gadget connection', {
      appId: config.appId,
      environment: config.environment
    }, 'client');
    
    // For Gadget.dev migration:
    // const url = `${getGadgetApiUrl(config)}status`;
    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: createGadgetHeaders(config)
    // });
    
    // const data = await response.json();
    // return response.ok && data.ready === true;
    
    // For development: Use mock connection test
    const { mockTestConnection } = await import('../mocks');
    return await mockTestConnection();
  } catch (error) {
    logError('Error testing Gadget connection', { error }, 'client');
    return false;
  }
};

