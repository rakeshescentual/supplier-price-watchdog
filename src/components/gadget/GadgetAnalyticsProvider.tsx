
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gadgetAnalytics } from '@/lib/gadget/analytics';
import { useGadgetStatus } from '@/hooks/useGadgetStatus';

interface GadgetAnalyticsContextType {
  trackEvent: (event: string, metadata?: Record<string, any>) => void;
  trackPageView: (title?: string, metadata?: Record<string, any>) => void;
  trackPerformance: (label: string, durationMs: number, metadata?: Record<string, any>) => void;
  startTracking: (label: string, metadata?: Record<string, any>) => () => Promise<void>;
  createFeatureTracker: (featureName: string) => {
    trackView: (label?: string) => void;
    trackUse: (action: string, metadata?: Record<string, any>) => void;
    trackError: (error: Error | string, metadata?: Record<string, any>) => void;
  };
  isEnabled: boolean;
}

const GadgetAnalyticsContext = createContext<GadgetAnalyticsContextType>({
  trackEvent: () => {},
  trackPageView: () => {},
  trackPerformance: () => {},
  startTracking: () => async () => {},
  createFeatureTracker: () => ({
    trackView: () => {},
    trackUse: () => {},
    trackError: () => {},
  }),
  isEnabled: false,
});

export const useGadgetAnalytics = () => useContext(GadgetAnalyticsContext);

interface GadgetAnalyticsProviderProps {
  children: React.ReactNode;
}

export const GadgetAnalyticsProvider: React.FC<GadgetAnalyticsProviderProps> = ({ children }) => {
  const location = useLocation();
  const { isInitialized, isHealthy } = useGadgetStatus();
  const [isEnabled, setIsEnabled] = useState(false);

  // Enable analytics when Gadget is initialized and healthy
  useEffect(() => {
    setIsEnabled(isInitialized && isHealthy);
  }, [isInitialized, isHealthy]);

  // Track page views automatically
  useEffect(() => {
    if (isEnabled) {
      const pathName = location.pathname;
      gadgetAnalytics.trackPageView(pathName);
    }
  }, [location, isEnabled]);

  // Flush analytics queue before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      gadgetAnalytics.flushAnalyticsQueue();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Create the context value
  const value: GadgetAnalyticsContextType = {
    trackEvent: (event, metadata) => {
      if (isEnabled) {
        gadgetAnalytics.trackFeatureUsage(event, 'used', metadata);
      }
    },
    trackPageView: (title, metadata) => {
      if (isEnabled) {
        gadgetAnalytics.trackPageView(location.pathname, title, metadata);
      }
    },
    trackPerformance: (label, durationMs, metadata) => {
      if (isEnabled) {
        gadgetAnalytics.trackPerformance(label, durationMs, metadata);
      }
    },
    startTracking: (label, metadata) => {
      if (isEnabled) {
        return gadgetAnalytics.startPerformanceTracking(label, metadata);
      }
      return async () => {};
    },
    createFeatureTracker: (featureName) => {
      if (isEnabled) {
        return gadgetAnalytics.createUsageTracker(featureName);
      }
      return {
        trackView: () => {},
        trackUse: () => {},
        trackError: () => {},
      };
    },
    isEnabled,
  };

  return (
    <GadgetAnalyticsContext.Provider value={value}>
      {children}
    </GadgetAnalyticsContext.Provider>
  );
};
