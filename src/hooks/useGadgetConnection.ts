
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { GadgetConfig } from '@/types/price';
import { getGadgetConfig, saveGadgetConfig } from '@/utils/gadget-helpers';
import { isGadgetInitialized, testGadgetConnection } from '@/lib/gadgetApi';

export function useGadgetConnection() {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [lastConnectionTest, setLastConnectionTest] = useState<Date>(new Date(0));
  const [config, setConfig] = useState<GadgetConfig>({
    apiKey: '',
    appId: '',
    environment: 'development',
    featureFlags: {}
  });

  /**
   * Initialize the Gadget connection
   */
  const init = useCallback(async () => {
    // Load configuration
    const savedConfig = getGadgetConfig();
    
    if (savedConfig) {
      setConfig(savedConfig);
      setIsConfigured(true);
      
      // Check initialized state
      const initialized = isGadgetInitialized();
      setIsInitialized(initialized);
      
      // Test connection if we haven't tested recently (within 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (lastConnectionTest < fiveMinutesAgo) {
        testConnection(savedConfig);
      }
    } else {
      setIsConfigured(false);
      setIsConnected(false);
      setIsInitialized(false);
    }
  }, [lastConnectionTest]);

  /**
   * Test the Gadget connection
   */
  const testConnection = useCallback(async (configToTest?: GadgetConfig): Promise<boolean> => {
    const configToUse = configToTest || config;
    
    if (!configToUse.apiKey || !configToUse.appId) {
      toast.error("Invalid configuration", {
        description: "API Key and App ID are required."
      });
      setIsConnected(false);
      return false;
    }
    
    try {
      const connected = await testGadgetConnection(configToUse);
      setIsConnected(connected);
      setLastConnectionTest(new Date());
      
      if (connected) {
        toast.success("Connection successful", {
          description: "Successfully connected to Gadget.dev"
        });
      } else {
        toast.error("Connection failed", {
          description: "Could not connect to Gadget.dev. Please check your credentials."
        });
      }
      
      return connected;
    } catch (error) {
      console.error("Error testing Gadget connection:", error);
      setIsConnected(false);
      toast.error("Connection error", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      return false;
    }
  }, [config]);

  // Initialize on first render
  useEffect(() => {
    init();
  }, [init]);

  return {
    init,
    testConnection,
    isConnected,
    isConfigured,
    isInitialized,
    lastConnectionTest,
    config
  };
}
