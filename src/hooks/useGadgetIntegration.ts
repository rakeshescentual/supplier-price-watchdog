
/**
 * Hook for working with Gadget integration in components
 */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { GadgetConfig } from '@/types/price';
import { 
  getGadgetConfig,
  saveGadgetConfig, 
  testGadgetConnection 
} from '@/utils/gadget-helpers';
import { 
  checkGadgetReadiness,
  validateAndSaveGadgetConfig,
  isGadgetFeatureEnabled
} from '@/utils/gadget-integration';
import {
  initGadgetClient,
  resetGadgetClient,
  isGadgetInitialized,
  checkGadgetHealth
} from '@/lib/gadget';
import { logError } from '@/lib/gadget/logging';

/**
 * Hook for working with Gadget integration
 * @returns Object with Gadget integration state and functions
 */
export function useGadgetIntegration() {
  const [config, setConfig] = useState<GadgetConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isOperational, setIsOperational] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<boolean | null>(null);

  // Load configuration and check status on mount
  useEffect(() => {
    let mounted = true;
    
    const loadConfig = async () => {
      setIsLoading(true);
      
      try {
        // Load config
        const savedConfig = getGadgetConfig();
        if (mounted) setConfig(savedConfig);
        
        // Check operational status
        const status = await checkGadgetReadiness();
        
        if (mounted) {
          setIsConfigured(status.configured);
          setIsOperational(status.operational);
          setStatusMessage(status.message);
        }
      } catch (error) {
        if (mounted) {
          setIsConfigured(false);
          setIsOperational(false);
          setStatusMessage(error instanceof Error ? error.message : "Unknown error");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    
    loadConfig();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Test connection to Gadget
  const testConnection = useCallback(async () => {
    if (!config) return false;
    
    setIsTesting(true);
    
    try {
      const result = await testGadgetConnection(config);
      setLastTestResult(result);
      
      if (result) {
        toast.success("Connection successful", {
          description: "Successfully connected to Gadget.dev"
        });
      } else {
        toast.error("Connection failed", {
          description: "Could not connect to Gadget.dev with the provided credentials."
        });
      }
      
      return result;
    } catch (error) {
      logError("Error testing Gadget connection", { error }, 'integration');
      setLastTestResult(false);
      
      toast.error("Connection error", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      
      return false;
    } finally {
      setIsTesting(false);
    }
  }, [config]);

  // Update configuration
  const updateConfig = useCallback(async (newConfig: GadgetConfig) => {
    const success = await validateAndSaveGadgetConfig(newConfig, () => {
      setConfig(newConfig);
      setIsConfigured(true);
      
      // Recheck operational status
      checkGadgetReadiness().then(status => {
        setIsOperational(status.operational);
        setStatusMessage(status.message);
      });
    });
    
    return success;
  }, []);

  // Reset Gadget client and configuration
  const resetIntegration = useCallback(() => {
    resetGadgetClient();
    
    const status = isGadgetInitialized();
    setIsOperational(status);
    setStatusMessage(status ? "Gadget client reinitialized" : "Gadget client reset");
    
    return status;
  }, []);

  // Check if a specific feature is enabled
  const isFeatureEnabled = useCallback((featureName: string, defaultValue: boolean = false) => {
    return isGadgetFeatureEnabled(featureName, defaultValue);
  }, []);

  // Check current health status
  const checkHealth = useCallback(async () => {
    if (!isInitialized()) {
      return {
        healthy: false,
        message: "Gadget client not initialized"
      };
    }
    
    try {
      const health = await checkGadgetHealth();
      setIsOperational(health.healthy);
      setStatusMessage(health.message || (health.healthy ? "Operational" : "Service degraded"));
      
      return health;
    } catch (error) {
      logError("Error checking Gadget health", { error }, 'integration');
      
      setIsOperational(false);
      setStatusMessage(error instanceof Error ? error.message : "Health check failed");
      
      return {
        healthy: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, []);

  // Check if Gadget client is initialized
  const isInitialized = useCallback(() => {
    return isGadgetInitialized();
  }, []);

  // Get Gadget client
  const getClient = useCallback(() => {
    return initGadgetClient();
  }, []);

  return {
    // State
    config,
    isLoading,
    isConfigured,
    isOperational,
    statusMessage,
    isTesting,
    lastTestResult,
    
    // Methods
    testConnection,
    updateConfig,
    resetIntegration,
    isFeatureEnabled,
    checkHealth,
    isInitialized,
    getClient
  };
}

export default useGadgetIntegration;
