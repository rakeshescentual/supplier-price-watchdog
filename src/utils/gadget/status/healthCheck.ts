
/**
 * Gadget health check utilities
 */
import { GadgetHealth } from '../types';
import { getGadgetStatusSummary } from './statusSummary';
import { checkGadgetStatus } from './checkStatus';
import { GadgetServiceHealth } from './types';

// Export status utilities for application use
export const isGadgetAvailable = async (): Promise<boolean> => {
  const status = await checkGadgetStatus();
  return status.status !== 'down';
};

export const getServiceHealth = async (): Promise<GadgetServiceHealth> => {
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
    status: summary.status === 'ready' ? 'healthy' : summary.status === 'degraded' ? 'degraded' : 'down',
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
