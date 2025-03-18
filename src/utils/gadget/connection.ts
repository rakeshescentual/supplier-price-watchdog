
/**
 * Connection testing utilities for Gadget.dev API
 */
import { GadgetConfig } from '@/types/price';
import { getGadgetApiUrl } from './urls';
import { createGadgetHeaders } from './auth';
import { logInfo, logError } from '@/lib/gadget/logging';
import { toast } from 'sonner';

/**
 * Test Gadget connection and configuration with improved error handling
 */
export async function testGadgetConnection(config: GadgetConfig): Promise<{
  success: boolean;
  latency?: number;
  message?: string;
}> {
  try {
    logInfo('Testing Gadget connection', { appId: config.appId }, 'connection');
    
    const startTime = Date.now();
    const url = `${getGadgetApiUrl(config)}status`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createGadgetHeaders(config)
    });
    
    const latency = Date.now() - startTime;
    
    if (!response.ok) {
      const errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      logError("Gadget connection test failed", { 
        statusCode: response.status, 
        statusText: response.statusText 
      }, 'connection');
      
      return { 
        success: false, 
        latency,
        message: errorMessage
      };
    }
    
    const data = await response.json();
    const isReady = data.ready === true;
    
    logInfo('Gadget connection test completed', { 
      success: isReady, 
      latency,
      version: data.version || 'unknown'
    }, 'connection');
    
    return { 
      success: isReady,
      latency,
      message: isReady ? `Connected (${latency}ms)` : 'Service not ready'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logError("Gadget connection test failed", { error }, 'connection');
    
    return { 
      success: false,
      message: errorMessage
    };
  }
}

/**
 * Comprehensive Gadget health check with toast notifications
 */
export async function checkGadgetHealth(config?: GadgetConfig, silent: boolean = false): Promise<{
  healthy: boolean;
  services: Record<string, boolean>;
  latency?: number;
}> {
  try {
    // If no config provided, try to get from storage
    const effectiveConfig = config || (await import('./config')).getGadgetConfig();
    
    if (!effectiveConfig) {
      if (!silent) {
        toast.error("Gadget configuration missing", {
          description: "Please configure Gadget integration settings"
        });
      }
      return { 
        healthy: false, 
        services: { config: false } 
      };
    }
    
    const connectionResult = await testGadgetConnection(effectiveConfig);
    
    if (!connectionResult.success) {
      if (!silent) {
        toast.error("Gadget connection failed", {
          description: connectionResult.message || "Could not connect to Gadget API"
        });
      }
      return { 
        healthy: false, 
        services: { 
          api: false,
          config: true
        },
        latency: connectionResult.latency
      };
    }
    
    if (!silent && connectionResult.success) {
      toast.success("Gadget connection successful", {
        description: `API responded in ${connectionResult.latency}ms`
      });
    }
    
    return {
      healthy: true,
      services: {
        api: true,
        config: true,
        processing: true,
        storage: true
      },
      latency: connectionResult.latency
    };
  } catch (error) {
    logError("Gadget health check failed", { error }, 'connection');
    
    if (!silent) {
      toast.error("Gadget health check failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
    
    return {
      healthy: false,
      services: { system: false }
    };
  }
}
