
/**
 * Display utilities for Gadget client
 */
import { logInfo } from '../logging';

/**
 * Get displayable client information
 */
export const getDisplayInfo = (): Record<string, any> => {
  // For mock implementation, return static info
  return {
    version: '1.0.0',
    environment: 'development',
    features: ['price-analysis', 'shopify-sync', 'pdf-processing']
  };
};

/**
 * Get displayable client status
 */
export const getClientDisplay = (): string => {
  const info = getDisplayInfo();
  return `Gadget Client v${info.version} (${info.environment})`;
};
