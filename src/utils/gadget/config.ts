
/**
 * Configuration management utilities for Gadget.dev integration
 */
import { toast } from 'sonner';
import { GadgetConfig, GadgetConnectionTestResult } from '@/utils/gadget/types';
import { loadConnectionContext, saveConnectionContext } from '../connection-helpers';
import { getGadgetApiUrl } from './urls';
import { createGadgetHeaders } from './auth';

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

/**
 * Test connection to Gadget API
 */
export async function testGadgetConnection(): Promise<GadgetConnectionTestResult> {
  try {
    const effectiveConfig = getGadgetConfig();
    
    if (!effectiveConfig) {
      return {
        success: false,
        message: "Gadget configuration not found"
      };
    }
    
    const statusUrl = `${getGadgetApiUrl(effectiveConfig)}status`;
    
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: createGadgetHeaders(effectiveConfig)
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    
    if (data.ready === true) {
      return {
        success: true,
        message: "Connected to Gadget successfully",
        details: {
          apiVersion: data.version || "unknown",
          environment: effectiveConfig.environment
        }
      };
    }
    
    return {
      success: false,
      message: data.message || "Gadget service not ready",
      details: data
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error connecting to Gadget",
      details: { error }
    };
  }
}
