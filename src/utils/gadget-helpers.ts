
import { toast } from 'sonner';
import { GadgetConfig } from '@/types/price';
import { loadConnectionContext, saveConnectionContext } from './connection-helpers';

/**
 * Safely fetches and parses the Gadget configuration
 */
export function getGadgetConfig(): GadgetConfig | null {
  return loadConnectionContext<GadgetConfig>('gadgetConfig', 
    (error) => {
      console.error("Error parsing Gadget config:", error);
      toast.error("Configuration error", {
        description: "There was an error loading your Gadget configuration."
      });
    }
  );
}

/**
 * Save Gadget configuration with proper error handling
 */
export function saveGadgetConfig(
  config: GadgetConfig,
  onSuccess?: () => void
): boolean {
  return saveConnectionContext('gadgetConfig', config, 
    () => {
      toast.success("Gadget configuration saved", {
        description: "Your configuration has been saved successfully."
      });
      onSuccess?.();
    },
    (error) => {
      console.error("Error saving Gadget config:", error);
      toast.error("Save error", {
        description: "Could not save your Gadget configuration."
      });
    }
  );
}

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

/**
 * Test Gadget connection and configuration
 */
export async function testGadgetConnection(config: GadgetConfig): Promise<boolean> {
  try {
    const url = `${getGadgetApiUrl(config)}status`;
    const response = await fetch(url, {
      method: 'GET',
      headers: createGadgetHeaders(config)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data.ready === true;
  } catch (error) {
    console.error("Gadget connection test failed:", error);
    return false;
  }
}

/**
 * Clear Gadget configuration from localStorage
 */
export function clearGadgetConfig(): void {
  try {
    localStorage.removeItem('gadgetConfig');
    toast.success("Configuration cleared", {
      description: "Gadget configuration has been removed."
    });
  } catch (error) {
    console.error("Error clearing Gadget config:", error);
    toast.error("Clear error", {
      description: "Could not clear your Gadget configuration."
    });
  }
}
