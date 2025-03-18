
import { getGadgetConfig, saveGadgetConfig, clearGadgetConfig, testGadgetConnection as _testGadgetConnection } from './gadget/config';

// Re-export all functions from the gadget utility modules, except testGadgetConnection
export * from './gadget/config';
export * from './gadget/validation';
export * from './gadget/urls';
export * from './gadget/auth';
export * from './gadget/connection';
export * from './gadget/initialization';
export * from './gadget/features';
export * from './gadget/status';

// Re-export with unique names to avoid conflicts
export const testGadgetConnection = _testGadgetConnection;
export { getGadgetConfig, saveGadgetConfig, clearGadgetConfig };
