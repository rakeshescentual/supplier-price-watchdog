
import { GadgetConfig, GadgetHealthStatus } from '../types';
import { logInfo, logError } from '../logging';

// Store the client instance for reuse
let gadgetClientInstance: any = null;
let isClientInitialized = false;

/**
 * Initialize Gadget client with configuration
 * @param config Optional Gadget configuration
 * @returns Initialized Gadget client or null if initialization failed
 */
export const initGadgetClient = (config?: GadgetConfig): any => {
  // If client is already initialized and no new config is provided, return existing instance
  if (isClientInitialized && !config && gadgetClientInstance) {
    return gadgetClientInstance;
  }
  
  try {
    // Get configuration from provided config or localStorage
    const effectiveConfig = config || getGadgetConfigFromStorage();
    
    if (!effectiveConfig) {
      console.warn("No Gadget configuration provided");
      return null;
    }
    
    logInfo("Initializing Gadget client", {
      appId: effectiveConfig.appId,
      environment: effectiveConfig.environment
    });
    
    // In a production implementation, this would use the Gadget SDK:
    // import { createClient } from '@gadget-client/my-app';
    // gadgetClientInstance = createClient({
    //   apiKey: effectiveConfig.apiKey,
    //   environment: effectiveConfig.environment
    // });
    
    // For now, just create a mock client
    gadgetClientInstance = {
      config: effectiveConfig,
      ready: true,
      app: {
        id: effectiveConfig.appId,
        environment: effectiveConfig.environment
      },
      mutate: {
        syncProductPrice: async () => ({ success: true }),
        processPdf: async () => ({ success: true, data: [] })
      },
      query: {
        getHealthStatus: async () => ({
          status: 'healthy',
          details: {
            services: {
              api: true,
              database: true,
              storage: true,
              scheduler: true
            }
          }
        })
      }
    };
    
    isClientInitialized = true;
    return gadgetClientInstance;
  } catch (error) {
    logError("Failed to initialize Gadget client", { error });
    return null;
  }
};

/**
 * Check if Gadget client is initialized
 * @returns Boolean indicating if the client is initialized
 */
export const isGadgetInitialized = (): boolean => {
  return isClientInitialized && !!gadgetClientInstance?.ready;
};

/**
 * Check Gadget connection health
 * @returns Promise resolving to Gadget health status
 */
export const checkGadgetHealth = async (): Promise<GadgetHealthStatus> => {
  if (!isGadgetInitialized()) {
    return { status: 'unhealthy' };
  }
  
  try {
    // In a production implementation, this would query the Gadget API for health status
    // const response = await gadgetClientInstance.query.getHealthStatus();
    // return response.data;
    
    // For now, return mock health status
    return {
      status: 'healthy',
      details: {
        services: {
          api: true,
          database: true,
          storage: true,
          scheduler: true
        },
        latency: 42,
        version: '1.0.0'
      }
    };
  } catch (error) {
    logError("Failed to check Gadget health", { error });
    return { status: 'unhealthy' };
  }
};

/**
 * Check if Gadget health status indicates a healthy system
 * @param health The Gadget health status object
 * @returns Boolean indicating if the system is healthy
 */
export const isHealthy = (health: GadgetHealthStatus): boolean => {
  return health.status === 'healthy' || health.status === 'degraded';
};

/**
 * Get Gadget configuration from localStorage
 * @returns Gadget configuration or null if not found
 */
const getGadgetConfigFromStorage = (): GadgetConfig | null => {
  try {
    const configStr = localStorage.getItem('gadgetConfig');
    if (!configStr) return null;
    
    const config = JSON.parse(configStr);
    return config;
  } catch (error) {
    console.error("Error reading Gadget config from localStorage:", error);
    return null;
  }
};

export * from './connection';
export * from './health';
export * from './initialization';
export * from './status';
