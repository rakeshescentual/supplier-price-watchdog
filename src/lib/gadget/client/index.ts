
/**
 * Gadget client initialization and management - Main Entry Point
 *
 * This module provides functionality for initializing and managing the Gadget client.
 */

// Re-export all client-related functions and types
export * from './initialization';
export * from './status';
export * from './health';
export * from './display';

// Export test connection and status utilities
export { testGadgetConnection, getGadgetStatus } from './connection';
