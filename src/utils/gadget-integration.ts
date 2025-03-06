
/**
 * Utility functions for Gadget.dev integration
 */
import { toast } from 'sonner';
import { GadgetConfig } from '@/types/price';
import {
  getGadgetConfig,
  validateGadgetConfig,
  testGadgetConnection,
  saveGadgetConfig
} from './gadget-helpers';
import {
  initGadgetClient,
  resetGadgetClient,
  checkGadgetHealth
} from '@/lib/gadget/client';
import { logInfo, logError } from '@/lib/gadget/logging';

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
    
    // Save configuration
    const saved = saveGadgetConfig(config, onSuccess);
    
    if (saved) {
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

/**
 * Check if Gadget integration is fully configured and operational
 * @returns Promise resolving to status object
 */
export const checkGadgetReadiness = async (): Promise<{
  configured: boolean;
  operational: boolean;
  message: string;
}> => {
  // Check if configuration exists
  const config = getGadgetConfig();
  
  if (!config) {
    return {
      configured: false,
      operational: false,
      message: "Gadget is not configured. Please set up your Gadget.dev configuration."
    };
  }
  
  try {
    // Check if client can be initialized
    const client = initGadgetClient();
    
    if (!client) {
      return {
        configured: true,
        operational: false,
        message: "Gadget client initialization failed. Please check your configuration."
      };
    }
    
    // Check API health
    const health = await checkGadgetHealth();
    
    if (!health.healthy) {
      return {
        configured: true,
        operational: false,
        message: health.message || "Gadget service is not operational."
      };
    }
    
    // All checks passed
    return {
      configured: true,
      operational: true,
      message: "Gadget integration is fully operational."
    };
  } catch (error) {
    logError("Error checking Gadget readiness", { error }, 'integration');
    
    return {
      configured: true,
      operational: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
};

/**
 * Initialize Gadget integration with default configuration if needed
 * @param defaultConfig Optional default configuration
 * @returns Boolean indicating success
 */
export const initializeGadgetIntegration = async (
  defaultConfig?: Partial<GadgetConfig>
): Promise<boolean> => {
  try {
    // Check if configuration already exists
    const existingConfig = getGadgetConfig();
    
    if (existingConfig) {
      logInfo("Using existing Gadget configuration", {}, 'integration');
      return true;
    }
    
    // No existing configuration, check if default provided
    if (!defaultConfig?.apiKey || !defaultConfig?.appId) {
      logInfo("No default Gadget configuration provided", {}, 'integration');
      return false;
    }
    
    // Create configuration with defaults
    const newConfig: GadgetConfig = {
      apiKey: defaultConfig.apiKey,
      appId: defaultConfig.appId,
      environment: defaultConfig.environment || 'development',
      featureFlags: defaultConfig.featureFlags || {
        enableAdvancedAnalytics: false,
        enablePdfProcessing: false,
        enableBackgroundJobs: false,
        enableShopifySync: true
      }
    };
    
    // Save new configuration
    return await validateAndSaveGadgetConfig(newConfig);
  } catch (error) {
    logError("Error initializing Gadget integration", { error }, 'integration');
    return false;
  }
};

/**
 * Get feature flag status for Gadget integration
 * @param flag Feature flag name
 * @param defaultValue Default value if flag not found
 * @returns Boolean indicating if feature is enabled
 */
export const isGadgetFeatureEnabled = (
  flag: string,
  defaultValue: boolean = false
): boolean => {
  const config = getGadgetConfig();
  
  if (!config || !config.featureFlags) {
    return defaultValue;
  }
  
  return config.featureFlags[flag as keyof typeof config.featureFlags] ?? defaultValue;
};
