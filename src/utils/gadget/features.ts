
/**
 * Gadget.dev feature flag utilities
 */
import { GadgetConfig } from '@/types/price';
import { getGadgetConfig } from './config';

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

/**
 * Check if all features are enabled
 * @returns Boolean indicating if all features are enabled
 */
export const areAllFeaturesEnabled = (): boolean => {
  const config = getGadgetConfig();
  
  if (!config || !config.featureFlags) {
    return false;
  }
  
  return Object.values(config.featureFlags).every(value => value === true);
};

/**
 * Get list of enabled features
 * @returns Array of enabled feature names
 */
export const getEnabledFeatures = (): string[] => {
  const config = getGadgetConfig();
  
  if (!config || !config.featureFlags) {
    return [];
  }
  
  return Object.entries(config.featureFlags)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name);
};
