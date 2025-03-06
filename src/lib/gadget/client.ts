
import { GadgetConfig } from '@/types/price';
import { getGadgetConfig } from '@/utils/gadget-helpers';

/**
 * Initialize the Gadget client using the stored configuration
 * @returns Initialized Gadget client or null if configuration is missing
 */
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) return null;

  try {
    // In production: use Gadget SDK
    // import { createClient } from '@gadget-client/your-app-slug';
    // return createClient({ 
    //   apiKey: config.apiKey,
    //   environment: config.environment,
    //   enableNetworkLogs: config.environment === 'development'
    // });
    
    return { config, ready: true };
  } catch (error) {
    console.error("Error initializing Gadget client:", error);
    return null;
  }
};

/**
 * Check if Gadget is initialized
 * @returns Boolean indicating if Gadget client is ready
 */
export const isGadgetInitialized = (): boolean => {
  const client = initGadgetClient();
  return !!client?.ready;
};

/**
 * Test Gadget connection with improved error handling
 * @param config Optional Gadget configuration to use for testing
 * @returns Promise resolving to a boolean indicating connection success
 */
export const testGadgetConnection = async (config?: GadgetConfig): Promise<boolean> => {
  const configToUse = config || getGadgetConfig();
  if (!configToUse) return false;
  
  try {
    console.log(`Testing Gadget connection to ${configToUse.appId}...`);
    
    // In production, use actual Gadget API
    // const response = await fetch(
    //   `https://${configToUse.appId}.gadget.app/api/status`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${configToUse.apiKey}`,
    //       'Content-Type': 'application/json'
    //     },
    //     signal: AbortSignal.timeout(5000) // 5 second timeout
    //   }
    // );
    
    // Mock successful response for demonstration
    // return response.ok;
    
    // For development: simulate a successful connection
    return true;
  } catch (error) {
    console.error("Gadget connection test failed:", error);
    return false;
  }
};

/**
 * Check if a feature is enabled through Gadget feature flags
 * @param featureName Name of the feature to check
 * @returns Boolean indicating if the feature is enabled
 */
export const isGadgetFeatureEnabled = (featureName: string): boolean => {
  const config = getGadgetConfig();
  
  if (!config || !config.featureFlags) {
    return false;
  }
  
  return !!config.featureFlags[featureName];
};
