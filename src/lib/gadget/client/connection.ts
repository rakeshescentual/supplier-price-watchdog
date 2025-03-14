
/**
 * Connection utilities for Gadget client
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from './initialization';
import { GadgetHealthStatus } from '../types';

/**
 * Test connection to Gadget service
 * @returns Promise resolving to boolean indicating if connection is successful
 */
export const testGadgetConnection = async (): Promise<boolean> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      logInfo('Cannot test connection: Gadget client is not initialized', {}, 'client');
      return false;
    }
    
    logInfo('Testing connection to Gadget...', {}, 'client');
    
    // In production, this would make a simple API call to check connectivity
    // For now, return true (mock implementation)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    logInfo('Connection to Gadget successful', {}, 'client');
    return true;
  } catch (error) {
    logError('Connection to Gadget failed', { error }, 'client');
    return false;
  }
};

/**
 * Get Gadget service status
 * @returns Promise resolving to service status
 */
export const getGadgetStatus = async (): Promise<{
  status: 'online' | 'degraded' | 'offline';
  version?: string;
  message?: string;
  lastChecked: string;
}> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      return {
        status: 'offline',
        message: 'Gadget client is not initialized',
        lastChecked: new Date().toISOString()
      };
    }
    
    logInfo('Getting Gadget service status...', {}, 'client');
    
    // In production, this would make an API call to get service status
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    return {
      status: 'online',
      version: '1.2.3',
      message: 'All systems operational',
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    logError('Failed to get Gadget service status', { error }, 'client');
    
    return {
      status: 'offline',
      message: error instanceof Error ? error.message : 'Unknown error',
      lastChecked: new Date().toISOString()
    };
  }
};
