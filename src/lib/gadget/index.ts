
/**
 * Gadget.dev Integration
 * 
 * This module provides integration with Gadget.dev for enhanced data processing,
 * Shopify synchronization, and other functionality.
 */

// Re-export all submodules
export * from './client';
export * from './batch';
export * from './sync';
export * from './telemetry';
export * from './logging';
export * from './types';
export * from './mocks';

// Export a single function for initializing all Gadget functionality
export const initializeGadgetIntegration = async () => {
  const { initGadgetClient, checkGadgetHealth, isHealthy } = await import('./client');
  
  const client = initGadgetClient();
  if (!client) {
    console.warn('Failed to initialize Gadget integration');
    return { initialized: false };
  }
  
  const health = await checkGadgetHealth();
  
  return {
    initialized: true,
    client,
    healthy: isHealthy(health),
    health
  };
};
