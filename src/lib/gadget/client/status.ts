
/**
 * Gadget client status and health check utilities
 */
import { toast } from 'sonner';
import { getGadgetConfig, getGadgetApiUrl } from '@/utils/gadget-helpers';
import { logInfo, logError } from '../logging';
import { reportHealthCheck } from '../telemetry';
import { initGadgetClient } from './initialization';

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
 * Check Gadget connection health
 * @returns Promise resolving to health status
 */
export const checkGadgetHealth = async (): Promise<{
  healthy: boolean;
  statusCode?: number;
  message?: string;
}> => {
  const config = getGadgetConfig();
  if (!config) {
    return { healthy: false, message: "No Gadget configuration found" };
  }
  
  try {
    logInfo('Checking Gadget connection health', {
      appId: config.appId,
      environment: config.environment
    }, 'client');
    
    // For Gadget.dev migration:
    // Check Gadget API health
    // const url = `${getGadgetApiUrl(config)}health`;
    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: createGadgetHeaders(config)
    // });
    
    // const data = await response.json();
    // const healthy = response.ok && data.status === 'healthy';
    
    // Simulate a health check
    const healthy = Math.random() > 0.1; // 90% chance of being healthy
    
    // Report health status to telemetry
    await reportHealthCheck(
      healthy ? 'healthy' : 'degraded',
      { appId: config.appId, environment: config.environment }
    );
    
    return {
      healthy,
      statusCode: healthy ? 200 : 503,
      message: healthy ? "Gadget services operational" : "Gadget services degraded"
    };
  } catch (error) {
    logError('Error checking Gadget health', { error }, 'client');
    
    return {
      healthy: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Unknown error checking Gadget health"
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

/**
 * Display Gadget service status to user
 */
export const displayGadgetStatus = async (): Promise<void> => {
  try {
    const health = await checkGadgetHealth();
    
    if (health.healthy) {
      toast.success("Gadget Services", {
        description: "All Gadget services are operational."
      });
    } else {
      toast.warning("Gadget Services", {
        description: health.message || "Some Gadget services may be degraded."
      });
    }
  } catch (error) {
    toast.error("Gadget Status Check Failed", {
      description: "Could not determine Gadget service status."
    });
  }
};
