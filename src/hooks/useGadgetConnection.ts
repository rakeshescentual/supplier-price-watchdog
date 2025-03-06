
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { initGadgetClient } from '@/lib/gadgetApi';
import { getGadgetConfig, testGadgetConnection } from '@/utils/gadget-helpers';
import type { GadgetConfig } from '@/types/price';

interface GadgetConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  lastChecked: Date | null;
  config: {
    appId: string;
    environment: string;
  } | null;
}

export const useGadgetConnection = () => {
  const [connectionState, setConnectionState] = useState<GadgetConnectionState>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null,
    config: null
  });

  const checkConnection = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const config = getGadgetConfig();
      
      if (!config) {
        throw new Error("Gadget configuration not found. Please set up your Gadget.dev connection in the settings.");
      }
      
      const client = initGadgetClient();
      
      if (!client || !client.ready) {
        throw new Error("Failed to initialize Gadget client. Please check your configuration.");
      }
      
      // Additional validation could go here
      // In a real implementation, you might make a test API call
      
      setConnectionState({
        isConnected: true,
        isLoading: false,
        error: null,
        lastChecked: new Date(),
        config: {
          appId: config.appId,
          environment: config.environment
        }
      });
      
      return true;
    } catch (error) {
      console.error("Gadget connection error:", error);
      
      setConnectionState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Unknown connection error"),
        lastChecked: new Date()
      }));
      
      return false;
    }
  }, []);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
    
    // Optional: Set up periodic checking
    const interval = setInterval(() => {
      checkConnection().catch(error => {
        console.error("Error in connection check interval:", error);
      });
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  const reconnect = useCallback(async () => {
    const success = await checkConnection();
    
    if (success) {
      toast.success("Gadget connected", {
        description: "Successfully connected to your Gadget.dev application."
      });
    } else {
      toast.error("Gadget connection failed", {
        description: connectionState.error?.message || "Unknown error occurred"
      });
    }
    
    return success;
  }, [checkConnection, connectionState.error]);

  return {
    ...connectionState,
    reconnect,
    checkConnection
  };
};
