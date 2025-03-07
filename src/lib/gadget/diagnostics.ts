
/**
 * Diagnostic utilities for Gadget integration
 */
import { logInfo, logError } from './logging';
import { initGadgetClient, checkGadgetHealth, testGadgetConnection } from './client';
import { reportHealthCheck } from './telemetry';

/**
 * Run diagnostic checks on Gadget integration
 * @param options Diagnostic options
 * @returns Promise resolving to diagnostic results
 */
export const runGadgetDiagnostics = async (
  options: {
    checkConnection?: boolean;
    checkHealth?: boolean;
    checkPermissions?: boolean;
    checkFeatureFlags?: boolean;
  } = {
    checkConnection: true,
    checkHealth: true,
    checkPermissions: false,
    checkFeatureFlags: true,
  }
): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  results: Record<string, {
    status: 'pass' | 'fail' | 'warn';
    message: string;
    details?: any;
  }>;
  timestamp: string;
}> => {
  const client = initGadgetClient();
  const results: Record<string, any> = {};
  let overallStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
  
  logInfo('Running Gadget diagnostics', options, 'diagnostics');
  
  // Check if client is initialized
  results.initialization = {
    status: client ? 'pass' : 'fail',
    message: client 
      ? 'Gadget client successfully initialized'
      : 'Failed to initialize Gadget client',
    details: {
      clientReady: !!client?.ready,
      appId: client?.config?.appId,
      environment: client?.config?.environment
    }
  };
  
  if (!client) {
    overallStatus = 'down';
    
    return {
      status: overallStatus,
      results,
      timestamp: new Date().toISOString()
    };
  }
  
  // Check connection if requested
  if (options.checkConnection) {
    try {
      const connectionSuccess = await testGadgetConnection();
      
      results.connection = {
        status: connectionSuccess ? 'pass' : 'fail',
        message: connectionSuccess
          ? 'Successfully connected to Gadget API'
          : 'Failed to connect to Gadget API',
        details: {
          timestamp: new Date().toISOString()
        }
      };
      
      if (!connectionSuccess && overallStatus === 'healthy') {
        overallStatus = 'down';
      }
    } catch (error) {
      results.connection = {
        status: 'fail',
        message: 'Error testing Gadget connection',
        details: {
          error: error instanceof Error ? error.message : String(error)
        }
      };
      
      if (overallStatus === 'healthy') {
        overallStatus = 'down';
      }
    }
  }
  
  // Check health if requested
  if (options.checkHealth) {
    try {
      const health = await checkGadgetHealth();
      
      results.health = {
        status: health.healthy ? 'pass' : 'warn',
        message: health.message || (health.healthy 
          ? 'Gadget services are healthy'
          : 'Gadget services may be degraded'),
        details: {
          statusCode: health.statusCode,
          timestamp: new Date().toISOString()
        }
      };
      
      if (!health.healthy && overallStatus === 'healthy') {
        overallStatus = 'degraded';
      }
    } catch (error) {
      results.health = {
        status: 'warn',
        message: 'Error checking Gadget health',
        details: {
          error: error instanceof Error ? error.message : String(error)
        }
      };
      
      if (overallStatus === 'healthy') {
        overallStatus = 'degraded';
      }
    }
  }
  
  // Check feature flags if requested
  if (options.checkFeatureFlags) {
    const featureFlags = client.config?.featureFlags || {};
    
    results.featureFlags = {
      status: 'pass',
      message: 'Feature flags retrieved',
      details: featureFlags
    };
  }
  
  // Report health status to telemetry
  await reportHealthCheck(overallStatus, {
    diagnosticResults: results,
    timestamp: new Date().toISOString()
  });
  
  return {
    status: overallStatus,
    results,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get current Gadget integration status
 * @returns Status information
 */
export const getGadgetStatus = (): {
  initialized: boolean;
  environment: string;
  appId?: string;
  featureFlags: Record<string, boolean>;
} => {
  const client = initGadgetClient();
  
  return {
    initialized: !!client?.ready,
    environment: client?.config?.environment || 'development',
    appId: client?.config?.appId,
    featureFlags: client?.config?.featureFlags || {}
  };
};
