
/**
 * Configuration management utilities for Gadget.dev integration
 */
import { toast } from 'sonner';
import { GadgetConfig } from '@/types/price';
import { loadConnectionContext, saveConnectionContext } from '../connection-helpers';

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
