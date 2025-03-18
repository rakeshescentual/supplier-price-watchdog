
/**
 * Unified client management for Gadget.dev
 * This file consolidates client functionality previously spread across multiple files
 */
import { logInfo, logError } from './logging';
import { GadgetConfig, GadgetClientStatus } from './types';
import { getGadgetConfig } from '@/utils/gadget/config';
import { validateGadgetConfig } from '@/utils/gadget/validation';
import { toast } from 'sonner';

// Cache client instance for reuse
let gadgetClient: any = null;
let clientStatus: GadgetClientStatus = {
  initialized: false,
  authenticated: false,
  healthy: false,
  environment: 'development'
};

/**
 * Initialize the Gadget client
 * @returns Initialized client or null if initialization failed
 */
export const initGadgetClient = (): any => {
  if (gadgetClient?.ready) {
    return gadgetClient;
  }

  try {
    const config = getGadgetConfig();
    if (!config) {
      logInfo('No Gadget configuration found', {}, 'client');
      return null;
    }

    const { isValid, errors } = validateGadgetConfig(config);
    if (!isValid) {
      logError('Invalid Gadget configuration', { errors }, 'client');
      return null;
    }

    // In production, this would initialize the actual Gadget SDK client
    // For now, create a mock client
    gadgetClient = {
      ready: true,
      query: {},
      mutate: {},
      connections: {
        shopify: {
          connect: async () => ({ id: 'mock-connection-id' }),
          disconnect: async () => true
        }
      }
    };

    clientStatus = {
      initialized: true,
      authenticated: true,
      healthy: true,
      environment: config.environment,
      lastChecked: new Date()
    };

    logInfo('Gadget client initialized', { environment: config.environment }, 'client');
    return gadgetClient;
  } catch (error) {
    logError('Error initializing Gadget client', { error }, 'client');
    return null;
  }
};

/**
 * Get current client status
 * @returns Current client status
 */
export const getGadgetClientStatus = (): GadgetClientStatus => {
  return { ...clientStatus };
};

/**
 * Reset the Gadget client (useful for testing or when configuration changes)
 */
export const resetGadgetClient = (): void => {
  gadgetClient = null;
  clientStatus = {
    initialized: false,
    authenticated: false,
    healthy: false,
    environment: 'development'
  };
  logInfo('Gadget client reset', {}, 'client');
};

/**
 * Check if Gadget client is initialized
 * @returns Whether the client is initialized
 */
export const isGadgetInitialized = (): boolean => {
  return gadgetClient !== null && gadgetClient.ready === true;
};

/**
 * Check Gadget service health
 * @returns Health check result
 */
export const checkGadgetHealth = async (): Promise<any> => {
  if (!gadgetClient) {
    return { status: 'disconnected' };
  }

  try {
    // In production, this would call the health check endpoint
    // For now, return a mock health response
    const health = {
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

    clientStatus.healthy = isHealthy(health);
    clientStatus.lastChecked = new Date();

    return health;
  } catch (error) {
    logError('Error checking Gadget health', { error }, 'health');
    clientStatus.healthy = false;
    clientStatus.lastChecked = new Date();
    return { status: 'error', error };
  }
};

/**
 * Check if a health response indicates the service is healthy
 * @param health Health check response
 * @returns Whether the service is healthy
 */
export const isHealthy = (health: any): boolean => {
  return health && health.status === 'healthy';
};

/**
 * Display Gadget status as a toast notification
 */
export const displayGadgetStatus = (): void => {
  const status = getGadgetClientStatus();
  
  if (!status.initialized) {
    toast.warning('Gadget not initialized', {
      description: 'Configure Gadget.dev to enable enhanced features.'
    });
    return;
  }

  const healthStatus = status.healthy ? 'healthy' : 'unhealthy';
  
  if (status.healthy) {
    toast.success('Gadget connection active', {
      description: `Connected to ${status.environment} environment.`
    });
  } else {
    toast.error('Gadget connection issue', {
      description: `Connection to ${status.environment} environment is ${healthStatus}.`
    });
  }
};

// Export additional functions from submodules
export * from './client/connection';
export * from './client/health';
export * from './client/status';
export * from './client/display';
export * from './client/initialization';
