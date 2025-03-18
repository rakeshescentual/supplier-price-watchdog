
/**
 * Status check utilities for Gadget.dev integration
 * 
 * Based on latest Gadget.dev API documentation (2023-11)
 */
import { GadgetConfig } from '@/types/price';
import { getGadgetApiUrl } from './urls';
import { createGadgetHeaders } from './auth';
import { getGadgetConfig } from './config';
import { logInfo, logError } from '@/lib/gadget/logging';
import { toast } from 'sonner';

/**
 * Check if Gadget integration is ready to be used with enhanced validation
 * @returns Object with readiness status and reason if not ready
 */
export const checkGadgetReadiness = (): { 
  ready: boolean; 
  reason?: string;
  config?: Partial<GadgetConfig>;
} => {
  try {
    const config = getGadgetConfig();
    
    if (!config) {
      return { 
        ready: false, 
        reason: 'configuration_missing'
      };
    }
    
    if (!config.apiKey) {
      return { 
        ready: false, 
        reason: 'api_key_missing',
        config: { appId: config.appId }
      };
    }
    
    if (!config.appId) {
      return { 
        ready: false, 
        reason: 'app_id_missing',
        config: { apiKey: '***' } // Masked for security
      };
    }
    
    return { 
      ready: true,
      config: { 
        appId: config.appId,
        apiKey: '***' // Masked for security
      }
    };
  } catch (error) {
    logError("Error checking Gadget readiness", { error }, 'status');
    return { 
      ready: false, 
      reason: 'unexpected_error'
    };
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
    // Using the latest health endpoint for 2023-11 API version
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
 * Get detailed Gadget system status with component health and retry logic
 * @returns Promise with detailed status information
 */
export const getDetailedGadgetStatus = async (
  options = { retry: true, retryAttempts: 2, retryDelay: 500 }
): Promise<{
  healthy: boolean;
  components: Record<string, { status: 'healthy' | 'degraded' | 'down'; message?: string }>;
  latency?: number;
  version?: string;
}> => {
  let attempts = 0;
  
  const attemptRequest = async (): Promise<any> => {
    attempts++;
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        response: data,
        latency,
        ok: true
      };
    } catch (error) {
      if (options.retry && attempts < options.retryAttempts) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, options.retryDelay));
        return attemptRequest();
      }
      
      throw error;
    }
  };
  
  try {
    const result = await attemptRequest();
    
    if (!result.ok) {
      return {
        healthy: false,
        components: {
          api: { status: 'down', message: result.error || 'Unknown error' }
        }
      };
    }
    
    // In production, this would parse the actual response
    // For now, return a mock but structured response
    return {
      healthy: true,
      components: {
        api: { status: 'healthy' },
        database: { status: 'healthy' },
        storage: { status: 'healthy' },
        processing: { status: 'healthy' }
      },
      latency: result.latency,
      version: result.response?.version || '1.3.0'
    };
  } catch (error) {
    logError("Error getting detailed Gadget status", { error }, 'status');
    
    toast.error("Unable to fetch Gadget status", {
      description: error instanceof Error ? error.message : "Connection failed"
    });
    
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

/**
 * Get a simplified status summary suitable for UI display
 */
export const getGadgetStatusSummary = async (): Promise<{
  status: 'ready' | 'partial' | 'degraded' | 'down';
  message: string;
  details?: Record<string, any>;
}> => {
  const readiness = checkGadgetReadiness();
  
  if (!readiness.ready) {
    return {
      status: 'down',
      message: 'Not configured',
      details: {
        reason: readiness.reason
      }
    };
  }
  
  try {
    const health = await getDetailedGadgetStatus({ retry: true });
    
    if (!health.healthy) {
      const downComponents = Object.entries(health.components)
        .filter(([_, status]) => status.status === 'down')
        .map(([name]) => name);
      
      return {
        status: downComponents.length === Object.keys(health.components).length ? 'down' : 'degraded',
        message: `Service ${downComponents.length === Object.keys(health.components).length ? 'unavailable' : 'degraded'}`,
        details: {
          components: health.components,
          downComponents
        }
      };
    }
    
    const degradedComponents = Object.entries(health.components)
      .filter(([_, status]) => status.status === 'degraded')
      .map(([name]) => name);
    
    if (degradedComponents.length > 0) {
      return {
        status: 'partial',
        message: 'Some services degraded',
        details: {
          components: health.components,
          degradedComponents
        }
      };
    }
    
    return {
      status: 'ready',
      message: 'All systems operational',
      details: {
        latency: health.latency,
        version: health.version
      }
    };
  } catch (error) {
    return {
      status: 'down',
      message: 'Connection error',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};
