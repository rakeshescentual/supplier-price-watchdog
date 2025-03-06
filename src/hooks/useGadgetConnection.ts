
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { GadgetConfig } from '@/types/price';
import { initGadgetClient, isGadgetInitialized } from '@/lib/gadgetApi';
import { getGadgetConfig, testGadgetConnection } from '@/utils/gadget-helpers';

export function useGadgetConnection() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [config, setConfig] = useState<GadgetConfig | null>(null);
  const [lastConnectionTest, setLastConnectionTest] = useState<Date | null>(null);
  
  const init = useCallback(async () => {
    const storedConfig = getGadgetConfig();
    
    if (storedConfig) {
      setConfig(storedConfig);
      setIsConfigured(true);
      
      const initialized = isGadgetInitialized();
      setIsInitialized(initialized);
      
      if (initialized) {
        try {
          const connected = await testGadgetConnection(storedConfig);
          setIsConnected(connected);
          setLastConnectionTest(new Date());
          
          if (connected) {
            toast.success("Gadget connected", {
              description: "Successfully connected to Gadget.dev"
            });
          } else {
            toast.warning("Gadget connection issue", {
              description: "Could not connect to Gadget.dev. Check your configuration."
            });
          }
        } catch (error) {
          console.error("Error testing Gadget connection:", error);
          setIsConnected(false);
          toast.error("Connection error", {
            description: "An error occurred while testing the Gadget connection."
          });
        }
      }
    } else {
      setIsConfigured(false);
      setIsConnected(false);
      setIsInitialized(false);
      setConfig(null);
    }
  }, []);
  
  const testConnection = useCallback(async (testConfig?: GadgetConfig): Promise<boolean> => {
    try {
      const configToTest = testConfig || config;
      
      if (!configToTest) {
        toast.error("Missing configuration", {
          description: "Gadget configuration is required for testing"
        });
        return false;
      }
      
      const connected = await testGadgetConnection(configToTest);
      setIsConnected(connected);
      setLastConnectionTest(new Date());
      
      return connected;
    } catch (error) {
      console.error("Error testing Gadget connection:", error);
      setIsConnected(false);
      setLastConnectionTest(new Date());
      return false;
    }
  }, [config]);
  
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
    config: config as GadgetConfig
  };
}
