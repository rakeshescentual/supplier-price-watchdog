
import { useGadget } from "@/contexts/gadget/GadgetContext";
import { useState, useCallback, useEffect } from "react";

export const useGadgetContext = (autoCheck: boolean = true) => {
  const context = useGadget();
  const [isReady, setIsReady] = useState(false);
  
  // Automatically check connection on mount if requested
  useEffect(() => {
    if (autoCheck && context.isConfigured && !context.lastChecked) {
      context.checkConnection(true).then((connected) => {
        setIsReady(connected);
      });
    } else {
      setIsReady(context.isConnected);
    }
  }, [autoCheck, context]);
  
  // Refresh connection and status
  const refresh = useCallback(async () => {
    const connected = await context.checkConnection();
    if (connected) {
      await context.refreshStatus();
    }
    setIsReady(connected);
    return connected;
  }, [context]);
  
  return {
    ...context,
    isReady,
    refresh
  };
};
