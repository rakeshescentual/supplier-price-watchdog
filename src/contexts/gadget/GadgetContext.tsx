
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getGadgetConfig, testGadgetConnection } from "@/utils/gadget/config";
import { checkGadgetStatus, getGadgetStatusSummary } from "@/utils/gadget/status";
import { GadgetConfig, GadgetStatusResponse } from "@/utils/gadget/types";

interface GadgetContextValue {
  isConfigured: boolean;
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  serviceStatus: GadgetStatusResponse | null;
  checkConnection: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  config: GadgetConfig | null;
}

const GadgetContext = createContext<GadgetContextValue | undefined>(undefined);

export const GadgetProvider = ({ children }: { children: ReactNode }) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [serviceStatus, setServiceStatus] = useState<GadgetStatusResponse | null>(null);
  const [config, setConfig] = useState<GadgetConfig | null>(null);

  const loadConfig = useCallback(() => {
    const gadgetConfig = getGadgetConfig();
    setConfig(gadgetConfig);
    setIsConfigured(!!gadgetConfig);
    return !!gadgetConfig;
  }, []);

  const checkConnection = useCallback(async (silent: boolean = false): Promise<boolean> => {
    setIsChecking(true);
    
    try {
      // Load the configuration
      const hasConfig = loadConfig();
      
      if (!hasConfig) {
        setIsConnected(false);
        if (!silent) {
          toast.error("Gadget not configured", {
            description: "Please configure Gadget in settings.",
          });
        }
        return false;
      }
      
      // Test the connection
      const result = await testGadgetConnection();
      setIsConnected(result.success);
      
      if (!silent) {
        if (result.success) {
          toast.success("Connected to Gadget", {
            description: "Gadget integration is active.",
          });
        } else {
          toast.error("Failed to connect to Gadget", {
            description: result.message,
          });
        }
      }
      
      return result.success;
    } catch (error) {
      console.error("Error checking Gadget connection:", error);
      setIsConnected(false);
      
      if (!silent) {
        toast.error("Connection error", {
          description: "Error connecting to Gadget services.",
        });
      }
      
      return false;
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  }, [loadConfig]);

  const refreshStatus = useCallback(async (): Promise<void> => {
    if (!isConfigured) return;
    
    try {
      const status = await checkGadgetStatus();
      setServiceStatus(status);
      
      // Update connection status based on service status
      setIsConnected(status.status !== 'down');
    } catch (error) {
      console.error("Error refreshing Gadget status:", error);
      setServiceStatus({
        status: 'down',
        message: 'Error checking status'
      });
      setIsConnected(false);
    } finally {
      setLastChecked(new Date());
    }
  }, [isConfigured]);

  // Initialize on mount
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Check connection whenever configuration changes
  useEffect(() => {
    if (isConfigured) {
      checkConnection(true);
    }
  }, [isConfigured, checkConnection]);

  // Periodically refresh status
  useEffect(() => {
    if (isConfigured && isConnected) {
      refreshStatus();
      
      const interval = setInterval(refreshStatus, 5 * 60 * 1000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [isConfigured, isConnected, refreshStatus]);

  const value: GadgetContextValue = {
    isConfigured,
    isConnected,
    isChecking,
    lastChecked,
    serviceStatus,
    checkConnection,
    refreshStatus,
    config
  };

  return <GadgetContext.Provider value={value}>{children}</GadgetContext.Provider>;
};

export const useGadget = (): GadgetContextValue => {
  const context = useContext(GadgetContext);
  if (context === undefined) {
    throw new Error("useGadget must be used within a GadgetProvider");
  }
  return context;
};
