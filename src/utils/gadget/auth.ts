
/**
 * Authentication utilities for Gadget API
 */
import { GadgetConfig } from './types';

/**
 * Create headers for Gadget API requests
 */
export function createGadgetHeaders(config: GadgetConfig): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Gadget-API-Key': config.apiKey,
    'X-Gadget-App-ID': config.appId,
    'X-Gadget-Environment': config.environment
  };
}
