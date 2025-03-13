
/**
 * Status checking utilities for Gadget client
 */
import { logInfo } from '../logging';
import { initGadgetClient } from './initialization';

/**
 * Check if Gadget is available and responding
 */
export const checkGadgetAvailability = async (): Promise<boolean> => {
  const client = initGadgetClient();
  
  if (!client) {
    return false;
  }
  
  // For mock client, always return true
  return true;
};

/**
 * Display status of Gadget client to console
 */
export const displayGadgetStatus = (): void => {
  const client = initGadgetClient();
  
  if (!client) {
    console.info('Gadget client is not initialized');
    return;
  }
  
  logInfo('Gadget client status', {
    initialized: true,
    config: {
      appId: client.config?.appId,
      environment: client.config?.environment,
      featureFlags: client.config?.featureFlags
    }
  }, 'status');
};
