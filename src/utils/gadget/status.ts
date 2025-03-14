
/**
 * Status check utilities for Gadget.dev integration
 */
import { GadgetConfig } from '@/types/price';
import { getGadgetApiUrl } from './urls';
import { createGadgetHeaders } from './auth';
import { getGadgetConfig } from './config';
import { logInfo, logError } from '@/lib/gadget/logging';

/**
 * Check if Gadget integration is ready to be used
 * @returns Boolean indicating readiness
 */
export const checkGadgetReadiness = (): boolean => {
  try {
    const config = getGadgetConfig();
    return !!config && !!config.apiKey && !!config.appId;
  } catch (error) {
    logError("Error checking Gadget readiness", { error }, 'status');
    return false;
  }
};

/**
 * Check Gadget connection health by making a test request
 * @returns Promise with boolean indicating health status
 */
export const checkGadgetConnectionHealth = async (): Promise<boolean> => {
  try {
    const config = getGadgetConfig();
    
    if (!config) {
      logInfo("No Gadget configuration found for health check", {}, 'status');
      return false;
    }
    
    const apiUrl = getGadgetApiUrl(config);
    const headers = createGadgetHeaders(config);
    
    // Make a simple health check request to the Gadget API
    const response = await fetch(`${apiUrl}health`, {
      method: 'GET',
      headers
    });
    
    const isHealthy = response.ok;
    
    if (isHealthy) {
      logInfo("Gadget connection is healthy", {
        statusCode: response.status
      }, 'status');
    } else {
      logError("Gadget connection is unhealthy", {
        statusCode: response.status,
        statusText: response.statusText
      }, 'status');
    }
    
    return isHealthy;
  } catch (error) {
    logError("Error checking Gadget connection health", { error }, 'status');
    return false;
  }
};
