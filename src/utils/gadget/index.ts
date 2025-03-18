
/**
 * Gadget.dev integration utilities
 * 
 * This module provides integration with Gadget.dev for enhanced data processing,
 * Shopify synchronization, and other functionality.
 */

// Re-export all submodules
export * from './config';
export * from './validation';
export * from './urls';
export * from './auth';
export * from './status';

// Export integrated functionality from lib/gadget
export * from '@/lib/gadget/processing';
export * from '@/lib/gadget/client';
export * from '@/lib/gadget/telemetry';
export * from '@/lib/gadget/logging';

// Constants
export const GADGET_VERSION = '1.3.0'; // Updated version
export const GADGET_API_VERSION = '2023-11'; // Updated API version

// Export utility for initialization
export { initializeGadgetIntegration } from '@/lib/gadget';

// Export specific functions to avoid ambiguity
export { testGadgetConnection as testGadgetConnectionUtility } from './connection';
