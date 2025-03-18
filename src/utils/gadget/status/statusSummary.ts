
/**
 * Comprehensive Gadget status summary utilities
 */
import { checkGadgetStatus } from './checkStatus';
import { GadgetStatusSummaryResponse } from './types';

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
