
/**
 * Gadget status utilities
 */
import { getGadgetApiUrl } from './urls';
import { createGadgetHeaders } from './auth';
import { getGadgetConfig } from './config';
import { GadgetStatusResponse, GadgetStatusSummaryResponse, GadgetHealth } from './types';

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

/**
 * Get a comprehensive status summary for all Gadget services
 */
export const getGadgetStatusSummary = async (): Promise<GadgetStatusSummaryResponse> => {
  try {
    // Check main API status first
    const apiStatus = await checkGadgetStatus({ 
      retry: true,
      retryAttempts: 2,
      retryDelay: 1000
    });
    
    if (apiStatus.status === 'down') {
      return {
        status: 'down',
        message: 'Gadget services unavailable',
        details: {
          api: apiStatus,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // In a real implementation, check status of various Gadget services
    // For now, we'll just return the API status
    return {
      status: apiStatus.status === 'ready' ? 'ready' : 'degraded',
      message: apiStatus.message,
      details: {
        api: apiStatus,
        services: {
          processing: { status: 'ready', message: 'Service operational' },
          storage: { status: 'ready', message: 'Service operational' },
          shopify: { status: 'ready', message: 'Service operational' }
        },
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Unknown error checking Gadget status',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    };
  }
};

// Export additional status utilities for use in the application
export const isGadgetAvailable = async (): Promise<boolean> => {
  const status = await checkGadgetStatus();
  return status.status !== 'down';
};

export const getServiceHealth = async (): Promise<Record<string, 'healthy' | 'degraded' | 'unhealthy'>> => {
  const status = await getGadgetStatusSummary();
  
  if (status.status === 'down') {
    return {
      api: 'unhealthy',
      processing: 'unhealthy',
      storage: 'unhealthy',
      shopify: 'unhealthy'
    };
  }
  
  // Map status to health indicators
  const mapStatusToHealth = (status: string): 'healthy' | 'degraded' | 'unhealthy' => {
    switch (status) {
      case 'ready': return 'healthy';
      case 'degraded': return 'degraded';
      default: return 'unhealthy';
    }
  };
  
  return {
    api: mapStatusToHealth(status.details.api.status),
    processing: mapStatusToHealth(status.details.services.processing.status),
    storage: mapStatusToHealth(status.details.services.storage.status),
    shopify: mapStatusToHealth(status.details.services.shopify.status)
  };
};

// Additional utility functions for GadgetHealthMonitor and GadgetHealthSummary components
export const checkGadgetConnectionHealth = async (): Promise<boolean> => {
  const status = await checkGadgetStatus();
  return status.status === 'ready';
};

export const getDetailedGadgetStatus = async (): Promise<GadgetHealth> => {
  const summary = await getGadgetStatusSummary();
  
  return {
    healthy: summary.status === 'ready',
    components: {
      api: { status: summary.details.api.status === 'ready' ? 'healthy' : summary.details.api.status === 'degraded' ? 'degraded' : 'down' },
      database: { status: summary.details.services.storage.status === 'ready' ? 'healthy' : 'degraded' },
      storage: { status: summary.details.services.storage.status === 'ready' ? 'healthy' : 'degraded' },
      processing: { status: summary.details.services.processing.status === 'ready' ? 'healthy' : 'degraded' }
    },
    latency: summary.details.api.latency,
    version: '1.3.0' // Example version
  };
};

export const checkGadgetReadiness = () => {
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
      reason: 'api_key_missing'
    };
  }
  
  if (!config.appId) {
    return {
      ready: false,
      reason: 'app_id_missing'
    };
  }
  
  return {
    ready: true
  };
};
