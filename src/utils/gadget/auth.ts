
/**
 * Authentication utilities for Gadget.dev API
 */
import { GadgetConfig } from '@/types/price';

/**
 * Create headers for Gadget API requests
 * @param config Gadget configuration
 * @returns Headers object with authentication
 */
export function createGadgetHeaders(config: GadgetConfig): HeadersInit {
  return {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Gadget-Environment': config.environment
  };
}

/**
 * Prepare a request for the Gadget API with proper authentication
 * @param config Gadget configuration
 * @param endpoint API endpoint
 * @param method HTTP method
 * @param data Optional request body data
 * @returns Request options object
 */
export function prepareGadgetRequest(
  config: GadgetConfig,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): RequestInit {
  const headers = createGadgetHeaders(config);
  
  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }
  
  return requestOptions;
}
