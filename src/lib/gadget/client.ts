
/**
 * Gadget client initialization and management
 */
import { toast } from 'sonner';
import { getGadgetConfig, getGadgetApiUrl, createGadgetHeaders } from '@/utils/gadget-helpers';
import { logInfo, logError } from './logging';
import { reportHealthCheck } from './telemetry';

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
  
  // In production: Use Gadget SDK
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
    
    // In production: Check Gadget API health
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
 * Reset client cache to force reinitialization
 */
export const resetGadgetClient = (): void => {
  cachedClient = null;
  lastConfigHash = '';
  logInfo('Gadget client cache reset', {}, 'client');
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
