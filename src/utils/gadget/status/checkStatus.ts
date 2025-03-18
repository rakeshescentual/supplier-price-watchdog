
/**
 * Gadget status checking utilities
 */
import { getGadgetApiUrl } from '../urls';
import { createGadgetHeaders } from '../auth';
import { getGadgetConfig } from '../config';
import { GadgetStatusResponse } from './types';

/**
 * Check Gadget service status
 * @param options Configuration options for status check
 * @returns Promise resolving to status information
 */
export const checkGadgetStatus = async (options?: {
  retry?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}): Promise<GadgetStatusResponse> => {
  const config = getGadgetConfig();
  if (!config) {
    return {
      status: 'down',
      message: 'Gadget configuration not found'
    };
  }

  const opts = {
    retry: options?.retry || false,
    retryAttempts: options?.retryAttempts || 3,
    retryDelay: options?.retryDelay || 1000
  };

  try {
    const startTime = Date.now();
    const statusUrl = `${getGadgetApiUrl(config)}status`;
    
    let attempt = 0;
    let lastError;
    
    while (attempt < (opts.retry ? opts.retryAttempts : 1)) {
      attempt++;
      
      try {
        const response = await fetch(statusUrl, {
          method: 'GET',
          headers: createGadgetHeaders(config)
        });
        
        const latency = Date.now() - startTime;
        
        if (!response.ok) {
          return {
            status: 'degraded',
            message: `HTTP ${response.status}: ${response.statusText}`,
            latency
          };
        }
        
        const data = await response.json();
        
        if (data.ready === true) {
          return {
            status: 'ready',
            message: 'All systems operational',
            latency
          };
        } else {
          return {
            status: 'degraded',
            message: data.message || 'Service not ready',
            latency
          };
        }
      } catch (error) {
        lastError = error;
        
        if (opts.retry && attempt < opts.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, opts.retryDelay));
        }
      }
    }
    
    return {
      status: 'down',
      message: lastError instanceof Error ? lastError.message : 'Unknown error occurred'
    };
  } catch (error) {
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
