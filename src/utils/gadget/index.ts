
/**
 * Gadget utility functions index
 * Re-exports all gadget utility functions from their respective modules
 */

// Configuration management
export { getGadgetConfig, saveGadgetConfig, clearGadgetConfig } from './config';

// Validation utilities
export { validateGadgetConfig } from './validation';

// URL generation
export { getGadgetApiUrl } from './urls';

// Authentication
export { createGadgetHeaders, prepareGadgetRequest } from './auth';

// Connection testing
export { testGadgetConnection } from './connection';

// Initialization
export { initializeGadgetIntegration } from './initialization';

// Feature flags
export { 
  isGadgetFeatureEnabled,
  areAllFeaturesEnabled,
  getEnabledFeatures
} from './features';

// Status checks
export { checkGadgetReadiness, checkGadgetConnectionHealth } from './status';
