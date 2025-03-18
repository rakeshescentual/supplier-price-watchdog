
import { useState, useEffect, useCallback } from 'react';
import { useGadgetStatus } from './useGadgetStatus';
import { toast } from 'sonner';

/**
 * Custom hook to access Gadget.dev features with fallbacks
 */
export const useGadgetFeatures = () => {
  const { isInitialized, isHealthy, healthStatus } = useGadgetStatus();
  const [isFeatureAvailable, setIsFeatureAvailable] = useState<boolean>(false);
  
  // Check if features are available based on initialization and health
  useEffect(() => {
    const available = isInitialized && (isHealthy || healthStatus === 'degraded');
    setIsFeatureAvailable(available);
  }, [isInitialized, isHealthy, healthStatus]);
  
  /**
   * Execute a Gadget feature with proper error handling and fallback
   * @param featureFunction Function that uses Gadget API
   * @param fallbackFunction Optional fallback function to use if Gadget is unavailable
   * @param options Configuration options
   */
  const executeFeature = useCallback(async <T,>(
    featureFunction: () => Promise<T>,
    fallbackFunction?: () => Promise<T>,
    options: {
      featureName: string;
      showToast?: boolean;
      criticalFeature?: boolean;
    } = { featureName: 'Gadget feature', showToast: true, criticalFeature: false }
  ): Promise<T | null> => {
    const { featureName, showToast, criticalFeature } = options;
    
    // Check if feature is available
    if (!isFeatureAvailable) {
      if (fallbackFunction) {
        if (showToast) {
          toast.info(`Using local fallback for "${featureName}"`, {
            description: 'Some advanced features may be limited'
          });
        }
        
        try {
          return await fallbackFunction();
        } catch (error) {
          console.error(`Fallback for "${featureName}" failed:`, error);
          if (showToast) {
            toast.error(`${featureName} failed`, {
              description: error instanceof Error ? error.message : 'Unknown error'
            });
          }
          return null;
        }
      } else if (criticalFeature) {
        // This is a critical feature with no fallback
        if (showToast) {
          toast.error(`${featureName} unavailable`, {
            description: 'This feature requires Gadget.dev connection'
          });
        }
        return null;
      } else {
        // Non-critical feature with no fallback, just return null silently
        return null;
      }
    }
    
    // Gadget is available, try to execute the feature
    try {
      return await featureFunction();
    } catch (error) {
      console.error(`Gadget feature "${featureName}" failed:`, error);
      
      // If we have a fallback, try to use it
      if (fallbackFunction) {
        if (showToast) {
          toast.warning(`Falling back for "${featureName}"`, {
            description: 'Using local processing instead'
          });
        }
        
        try {
          return await fallbackFunction();
        } catch (fallbackError) {
          console.error(`Fallback for "${featureName}" also failed:`, fallbackError);
          if (showToast) {
            toast.error(`${featureName} failed`, {
              description: 'Both Gadget and local processing failed'
            });
          }
          return null;
        }
      } else {
        // No fallback available
        if (showToast) {
          toast.error(`${featureName} failed`, {
            description: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        return null;
      }
    }
  }, [isFeatureAvailable]);
  
  return {
    isFeatureAvailable,
    executeFeature,
    isGadgetInitialized: isInitialized,
    isGadgetHealthy: isHealthy,
    gadgetHealthStatus: healthStatus
  };
};
