
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
export * from './connection';
export * from './initialization';
export * from './features';
export * from './status';

// Constants
export const GADGET_VERSION = '1.2.0';
export const GADGET_API_VERSION = '2023-09';

// Export type definitions
export type { GadgetConfig } from '@/types/price';
