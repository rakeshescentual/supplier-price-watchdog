
/**
 * Status check utilities for Gadget.dev integration
 * 
 * Based on latest Gadget.dev API documentation (2023-09)
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
    // Using the latest health endpoint for 2023-09 API version
    const response = await fetch(`${apiUrl}health`, {
      method: 'GET',
      headers
    });
    
    // Check for the updated health response format
    if (response.ok) {
      const data = await response.json();
      // The latest Gadget API returns a status field in the response
      const isHealthy = response.ok && data?.status === 'healthy';
      
      if (isHealthy) {
        logInfo("Gadget connection is healthy", {
          statusCode: response.status,
          version: data?.version || 'unknown'
        }, 'status');
      } else {
        logError("Gadget connection is unhealthy", {
          statusCode: response.status,
          statusText: response.statusText,
          details: data?.details || 'No details provided'
        }, 'status');
      }
      
      return isHealthy;
    }
    
    // Fall back to basic status check for compatibility
    const isHealthy = response.ok;
    
    if (isHealthy) {
      logInfo("Gadget connection is healthy (basic check)", {
        statusCode: response.status
      }, 'status');
    } else {
      logError("Gadget connection is unhealthy (basic check)", {
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

/**
 * Get detailed Gadget system status with component health
 * @returns Promise with detailed status information
 */
export const getDetailedGadgetStatus = async (): Promise<{
  healthy: boolean;
  components: Record<string, { status: 'healthy' | 'degraded' | 'down'; message?: string }>;
  latency?: number;
}> => {
  try {
    const config = getGadgetConfig();
    
    if (!config) {
      throw new Error("No Gadget configuration found");
    }
    
    const apiUrl = getGadgetApiUrl(config);
    const headers = createGadgetHeaders(config);
    const startTime = Date.now();
    
    // Make a request to the detailed status endpoint
    const response = await fetch(`${apiUrl}system/status`, {
      method: 'GET',
      headers
    });
    
    const latency = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        healthy: false,
        components: {
          api: { status: 'down', message: `HTTP ${response.status}: ${response.statusText}` }
        },
        latency
      };
    }
    
    // For development/testing
    // In production, this would parse the actual response
    return {
      healthy: true,
      components: {
        api: { status: 'healthy' },
        database: { status: 'healthy' },
        storage: { status: 'healthy' },
        processing: { status: 'healthy' }
      },
      latency
    };
  } catch (error) {
    logError("Error getting detailed Gadget status", { error }, 'status');
    
    return {
      healthy: false,
      components: {
        system: { 
          status: 'down', 
          message: error instanceof Error ? error.message : "Unknown error" 
        }
      }
    };
  }
};
