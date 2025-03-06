
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { initGadgetClient } from '@/lib/gadgetApi';
import { getGadgetConfig, testGadgetConnection } from '@/utils/gadget-helpers';
import type { GadgetConfig } from '@/types/price';

interface GadgetConnectionState {
  isConnected: boolean;
  isConfigured: boolean;
  isInitialized: boolean;
  lastConnectionTest: Date | null;
  config: GadgetConfig | null;
}

export const useGadgetConnection = () => {
  const [state, setState] = useState<GadgetConnectionState>({
    isConnected: false,
    isConfigured: false,
    isInitialized: false,
    lastConnectionTest: null,
    config: null
  });

  const init = useCallback(async () => {
    const config = getGadgetConfig();
    const client = initGadgetClient();
    
    setState(prev => ({
      ...prev,
      isConfigured: !!config,
      isInitialized: !!client?.ready,
      config
    }));
    
    if (config) {
      try {
        const isConnected = await testGadgetConnection(config);
        setState(prev => ({
          ...prev,
          isConnected,
          lastConnectionTest: new Date()
        }));
        
        if (isConnected) {
          console.log("Gadget connection successful");
        } else {
          console.warn("Gadget connection test failed");
        }
      } catch (error) {
        console.error("Error testing Gadget connection:", error);
        setState(prev => ({
          ...prev,
          isConnected: false,
          lastConnectionTest: new Date()
        }));
      }
    }
  }, []);

  const testConnection = useCallback(async (config?: GadgetConfig): Promise<boolean> => {
    const configToTest = config || state.config;
    if (!configToTest) {
      toast.error("No Gadget configuration", {
        description: "Please provide configuration details to test connection."
      });
      return false;
    }
    
    try {
      const isConnected = await testGadgetConnection(configToTest);
      
      setState(prev => ({
        ...prev,
        isConnected,
        lastConnectionTest: new Date()
      }));
      
      if (isConnected) {
        toast.success("Gadget connection successful", {
          description: "Successfully connected to Gadget.dev"
        });
      } else {
        toast.error("Gadget connection failed", {
          description: "Could not connect to Gadget. Please check your configuration."
        });
      }
      
      return isConnected;
    } catch (error) {
      console.error("Error testing Gadget connection:", error);
      toast.error("Connection error", {
        description: "An error occurred while testing Gadget connection."
      });
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        lastConnectionTest: new Date()
      }));
      
      return false;
    }
  }, [state.config]);

  useEffect(() => {
    init();
  }, [init]);

  return {
    ...state,
    init,
    testConnection
  };
};
