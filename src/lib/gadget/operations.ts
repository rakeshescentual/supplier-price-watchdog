
/**
 * Gadget operations and core utilities
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { testGadgetConnection } from './client/connection';

/**
 * Check if Gadget is properly configured and available
 */
export const ensureGadgetAvailable = async (): Promise<boolean> => {
  const client = initGadgetClient();
  
  if (!client) {
    logError('Gadget client not initialized', {}, 'operations');
    return false;
  }
  
  const isConnected = await testGadgetConnection();
  
  if (!isConnected) {
    logError('Gadget API not available', {}, 'operations');
    return false;
  }
  
  return true;
};

/**
 * Execute a Gadget operation with proper error handling
 */
export const executeGadgetOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  const isAvailable = await ensureGadgetAvailable();
  
  if (!isAvailable) {
    if (fallback !== undefined) {
      return fallback;
    }
    return undefined;
  }
  
  try {
    logInfo(`Executing operation: ${operationName}`, {}, 'operations');
    return await operation();
  } catch (error) {
    logError(`Error executing operation: ${operationName}`, { error }, 'operations');
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw error;
  }
};
