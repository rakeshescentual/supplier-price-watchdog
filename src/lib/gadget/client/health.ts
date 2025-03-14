
/**
 * Health check utilities for Gadget client
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from './initialization';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  details?: Record<string, any>;
}

/**
 * Check Gadget service health
 * @returns Promise resolving to health check result
 */
export const checkGadgetHealth = async (): Promise<HealthCheckResult> => {
  const client = initGadgetClient();
  
  if (!client) {
    return {
      status: 'unhealthy',
      message: 'Gadget client is not initialized',
      details: {
        timestamp: new Date().toISOString(),
        error: 'Client initialization failed'
      }
    };
  }
  
  try {
    // In production, we would make an actual health check API call here
    // For mock implementation, return healthy status
    return {
      status: 'healthy',
      message: 'All systems operational',
      details: {
        timestamp: new Date().toISOString(),
        apiLatency: 42, // Mock value
        services: {
          api: true,
          database: true,
          storage: true,
          scheduler: true
        }
      }
    };
  } catch (error) {
    logError('Health check failed', { error }, 'health');
    
    return {
      status: 'degraded',
      message: error instanceof Error ? error.message : 'Unknown error during health check',
      details: {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.stack : String(error)
      }
    };
  }
};

/**
 * Utility function to check if health status is healthy
 */
export const isHealthy = (health: HealthCheckResult): boolean => {
  return health.status === 'healthy';
};

/**
 * Utility function to check if health status is degraded
 */
export const isDegraded = (health: HealthCheckResult): boolean => {
  return health.status === 'degraded';
};

/**
 * Utility function to check if health status is unhealthy
 */
export const isUnhealthy = (health: HealthCheckResult): boolean => {
  return health.status === 'unhealthy';
};

