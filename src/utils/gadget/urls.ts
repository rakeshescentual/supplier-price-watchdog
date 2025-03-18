
/**
 * URL utilities for Gadget API
 */
import { GadgetConfig } from './types';

/**
 * Get the base URL for Gadget API
 */
export function getGadgetApiUrl(config: GadgetConfig): string {
  const { appId, environment } = config;
  const baseUrl = environment === 'production'
    ? `https://${appId}.gadget.app/api/`
    : `https://${appId}.development.gadget.app/api/`;
  
  return baseUrl;
}
