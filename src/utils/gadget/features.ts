
/**
 * Gadget.dev feature flag utilities
 */
import { getGadgetConfig } from '../gadget-helpers';

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
