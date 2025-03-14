
/**
 * URL generation utilities for Gadget.dev API
 */
import { GadgetConfig } from '@/types/price';

/**
 * Generate Gadget API base URL
 */
export function getGadgetApiUrl(config: GadgetConfig): string {
  const { appId, environment } = config;
  // In production environments, Gadget uses a different URL structure
  return environment === 'production' 
    ? `https://${appId}.gadget.app/api/` 
    : `https://${appId}--development.gadget.app/api/`;
}
