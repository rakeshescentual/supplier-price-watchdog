
import { getGadgetConfig, saveGadgetConfig, clearGadgetConfig } from './gadget/config';

// Re-export all functions from the gadget utility modules, except testGadgetConnection
export * from './gadget/validation';
export * from './gadget/urls';
export * from './gadget/auth';
export * from './gadget/connection';
export * from './gadget/initialization';
export * from './gadget/features';
export * from './gadget/status';

// Re-export with unique names to avoid conflicts
// Explicitly re-export and rename testGadgetConnection to avoid naming conflicts
export { testGadgetConnection as testGadgetConnectionHelper } from './gadget/config';
export { getGadgetConfig, saveGadgetConfig, clearGadgetConfig };
