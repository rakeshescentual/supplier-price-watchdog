
/**
 * Gadget.dev configuration validation utilities
 */
import { toast } from 'sonner';
import { GadgetConfig } from '@/types/price';
import { validateGadgetConfig, testGadgetConnection } from '../gadget-helpers';
import { logError } from '@/lib/gadget/logging';

/**
 * Validate and save Gadget configuration with proper error handling
 * @param config GadgetConfig object to validate and save
 * @param onSuccess Optional callback function to execute on success
 * @returns Boolean indicating success
 */
export const validateAndSaveGadgetConfig = async (
  config: GadgetConfig,
  onSuccess?: () => void
): Promise<boolean> => {
  // Validate configuration
  const { isValid, errors } = validateGadgetConfig(config);
  
  if (!isValid) {
    toast.error("Invalid configuration", {
      description: errors.join(", ")
    });
    return false;
  }
  
  // Test connection before saving
  try {
    toast.info("Testing connection...", {
      description: "Verifying connection to Gadget.dev"
    });
    
    const connectionSuccess = await testGadgetConnection(config);
    
    if (!connectionSuccess) {
      toast.error("Connection test failed", {
        description: "Could not connect to Gadget.dev with the provided configuration. Please check your credentials."
      });
      return false;
    }
    
    // Import saveGadgetConfig here to avoid circular dependencies
    const { saveGadgetConfig } = await import('../gadget-helpers');
    
    // Save configuration
    const saved = saveGadgetConfig(config, onSuccess);
    
    if (saved) {
      // Import resetGadgetClient here to avoid circular dependencies
      const { resetGadgetClient } = await import('@/lib/gadget/client');
      
      // Reset client to force reinitialization with new config
      resetGadgetClient();
      
      toast.success("Configuration saved", {
        description: "Your Gadget.dev configuration has been saved and connection verified."
      });
      return true;
    } else {
      toast.error("Save failed", {
        description: "Could not save configuration."
      });
      return false;
    }
  } catch (error) {
    logError("Error validating and saving Gadget config", { error }, 'integration');
    
    toast.error("Configuration error", {
      description: error instanceof Error ? error.message : "An unexpected error occurred"
    });
    
    return false;
  }
};
