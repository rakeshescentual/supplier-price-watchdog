
/**
 * Gadget.dev initialization utilities
 */
import { GadgetConfig } from '@/types/price';
import { getGadgetConfig } from '../gadget-helpers';
import { logInfo, logError } from '@/lib/gadget/logging';
import { validateAndSaveGadgetConfig } from './validation';

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
