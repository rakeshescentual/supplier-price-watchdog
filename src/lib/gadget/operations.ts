
/**
 * Core operation utilities for Gadget
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
 * Updated to use the latest error handling patterns from Gadget
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
    // New error categorization based on Gadget's latest error types
    if (error instanceof Error) {
      // Check for specific Gadget error types that would be available in the real SDK
      const errorCode = (error as any).code || 'UNKNOWN';
      const isRetryable = ['NETWORK_ERROR', 'RATE_LIMITED', 'SERVICE_UNAVAILABLE'].includes(errorCode);
      
      logError(`Error executing operation: ${operationName}`, { 
        error, 
        errorCode, 
        isRetryable 
      }, 'operations');
    } else {
      logError(`Error executing operation: ${operationName}`, { error }, 'operations');
    }
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw error;
  }
};
