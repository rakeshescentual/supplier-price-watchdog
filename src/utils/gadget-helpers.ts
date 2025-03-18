
/**
 * Utility functions for Gadget.dev integration
 * Re-exports from smaller, more focused modules for better maintainability.
 */

// Re-export all functions from the gadget utility modules
export * from './gadget/config';
export * from './gadget/validation';
export * from './gadget/urls';
export * from './gadget/auth';
export * from './gadget/connection';
export * from './gadget/initialization';
export * from './gadget/features';
export * from './gadget/status';

// Be explicit about what we re-export to avoid ambiguity
export { getGadgetConfig, saveGadgetConfig, clearGadgetConfig } from './gadget/config';
// Use a different name to avoid conflict
export { testGadgetConnection as testGadgetEnvironment } from './gadget/connection';
