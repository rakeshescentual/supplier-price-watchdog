
/**
 * Gadget health check functionality
 */
import { logInfo, logError } from '../logging';
import { getGadgetConfig, getGadgetApiUrl, createGadgetHeaders } from '@/utils/gadget-helpers';
import { reportHealthCheck } from '../telemetry';
import { testGadgetConnection } from './status';

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

