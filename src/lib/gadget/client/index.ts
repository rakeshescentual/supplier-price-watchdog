
/**
 * Gadget Client module - Main Entry Point
 * 
 * This module provides functions for initializing and managing the Gadget client.
 */

// Re-export all client-related functions and types
export * from './initialization';
export * from './health';
export * from './connection';

// Export the display status function
export const displayGadgetStatus = () => {
  console.log("Gadget.dev integration is ready to use");
};
