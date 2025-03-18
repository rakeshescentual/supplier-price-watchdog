
// Export all submodules except testGadgetConnection
export * from './validation';
export * from './urls';
export * from './auth';
export * from './status';

// Re-export with unique name to avoid conflicts
export { testGadgetConnection as validateGadgetConnection } from './config';
export { getGadgetConfig } from './config';

// Export integrated functionality from lib/gadget
export * from '@/lib/gadget/processing';
export * from '@/lib/gadget/client';
export * from '@/lib/gadget/telemetry';
export * from '@/lib/gadget/logging';

// Constants
export const GADGET_VERSION = '1.3.0';
export const GADGET_API_VERSION = '2023-11';

// Export utility for initialization
export { initializeGadgetIntegration } from '@/lib/gadget';
