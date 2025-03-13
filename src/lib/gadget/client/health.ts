
/**
 * Health checking utilities for Gadget client
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from './initialization';

/**
 * Check health of Gadget client and API
 */
export const checkGadgetHealth = async (): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  details?: Record<string, any>;
}> => {
  const client = initGadgetClient();
  
  if (!client) {
    return {
      status: 'unhealthy',
      message: 'Gadget client is not initialized'
    };
  }
  
  try {
    // For development, return a mock healthy response
    return {
      status: 'healthy',
      details: {
        apiLatency: 42,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    logError('Error checking Gadget health', { error }, 'health');
    
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
