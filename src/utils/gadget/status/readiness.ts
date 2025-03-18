
/**
 * Gadget readiness check utilities
 */
import { getGadgetConfig } from '../config';
import { GadgetReadinessCheck } from './types';

/**
 * Check if Gadget is configured properly and ready to use
 */
export const checkGadgetReadiness = (): GadgetReadinessCheck => {
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
