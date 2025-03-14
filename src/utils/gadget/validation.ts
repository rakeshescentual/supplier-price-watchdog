
/**
 * Validation utilities for Gadget.dev configuration
 */
import { GadgetConfig } from '@/types/price';

/**
 * Validate Gadget configuration
 */
export function validateGadgetConfig(config: GadgetConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.apiKey?.trim()) {
    errors.push("API Key is required");
  }
  
  if (!config.appId?.trim()) {
    errors.push("App ID is required");
  }
  
  return { 
    isValid: errors.length === 0,
    errors 
  };
}
