
/**
 * Authentication utilities for Gadget.dev API
 */
import { GadgetConfig } from '@/types/price';

/**
 * Create headers for Gadget API requests
 */
export function createGadgetHeaders(config: GadgetConfig): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
    'X-Gadget-Environment': config.environment
  };
}

/**
 * Helper to prepare fetch options for Gadget API calls
 */
export function prepareGadgetRequest(
  config: GadgetConfig, 
  method: string = 'GET', 
  body?: object
): RequestInit {
  return {
    method,
    headers: createGadgetHeaders(config),
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include' // Important for Gadget session management
  };
}
