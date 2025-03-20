
import { initGadgetClient } from './client';
import { toast } from 'sonner';

/**
 * Enhanced analytics service powered by Gadget.dev
 * Tracks user events, feature usage, and performance metrics
 */
export const gadgetAnalytics = {
  client: null as any,
  
  initialize: () => {
    try {
      gadgetAnalytics.client = initGadgetClient();
      console.log("Gadget Analytics initialized");
      return true;
    } catch (error) {
      console.error("Failed to initialize Gadget Analytics:", error);
      return false;
    }
  },
  
  // Track application events
  trackEvent: async (
    eventName: string, 
    properties?: Record<string, any>
  ): Promise<boolean> => {
    if (!gadgetAnalytics.client) {
      console.warn("Gadget Analytics not initialized");
      return false;
    }
    
    try {
      console.log(`Tracking event: ${eventName}`, properties);
      // In a real implementation, this would send data to Gadget
      // Mock successful tracking
      return true;
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error);
      return false;
    }
  },
  
  // Track feature usage
  trackFeatureUsage: async (
    featureName: string,
    action: 'viewed' | 'used' | 'configured',
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    return gadgetAnalytics.trackEvent('feature_usage', {
      feature: featureName,
      action,
      ...metadata
    });
  },
  
  // Track errors
  trackError: async (
    error: Error | string,
    context?: Record<string, any>
  ): Promise<boolean> => {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return gadgetAnalytics.trackEvent('error', {
      message: errorMessage,
      stack: errorStack,
      ...context
    });
  },
  
  // Track performance metrics
  trackPerformance: async (
    operation: string,
    durationMs: number,
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    return gadgetAnalytics.trackEvent('performance', {
      operation,
      durationMs,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  },
  
  // Track business metrics
  trackBusinessMetric: async (
    metricName: string,
    value: number,
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    return gadgetAnalytics.trackEvent('business_metric', {
      metric: metricName,
      value,
      ...metadata
    });
  },
  
  // Track user actions specific to Escentual.com
  trackEscentualAction: async (
    action: 'price_change' | 'competitor_check' | 'sync_to_shopify' | 'export' | 'customer_notification',
    count: number,
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    return gadgetAnalytics.trackEvent('escentual_action', {
      action,
      count,
      ...metadata
    });
  },
  
  // Usage tracking hook creator - moved into the gadgetAnalytics object
  createUsageTracker: (featureArea: string) => {
    return {
      trackView: (component: string, metadata?: Record<string, any>) => {
        gadgetAnalytics.trackFeatureUsage(`${featureArea}.${component}`, 'viewed', metadata)
          .catch(error => console.error(`Failed to track view of ${featureArea}.${component}:`, error));
      },
      trackUse: (action: string, metadata?: Record<string, any>) => {
        gadgetAnalytics.trackFeatureUsage(`${featureArea}.${action}`, 'used', metadata)
          .catch(error => console.error(`Failed to track use of ${featureArea}.${action}:`, error));
      },
      trackConfigure: (setting: string, metadata?: Record<string, any>) => {
        gadgetAnalytics.trackFeatureUsage(`${featureArea}.${setting}`, 'configured', metadata)
          .catch(error => console.error(`Failed to track configuration of ${featureArea}.${setting}:`, error));
      }
    };
  },
  
  // Enhanced Shopify metrics for Plus merchants
  trackShopifyPlusMetrics: async (
    metricType: 'script_performance' | 'flow_execution' | 'multipass_auth' | 'b2b_pricing' | 'api_efficiency',
    value: number,
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    return gadgetAnalytics.trackEvent('shopify_plus_metric', {
      type: metricType,
      value,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  },
  
  // Track compliance metrics for Built for Shopify certification
  trackComplianceMetric: async (
    complianceArea: 'api_version' | 'webhooks' | 'oauth' | 'data_security' | 'rate_limiting' | 'app_bridge',
    status: 'compliant' | 'non_compliant' | 'warning',
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    return gadgetAnalytics.trackEvent('compliance_metric', {
      area: complianceArea,
      status,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }
};

// Performance timing wrapper
export const withPerformanceTracking = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  operationName: string
) => {
  return async (...args: Args): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - startTime;
      
      // Track performance in background
      gadgetAnalytics.trackPerformance(operationName, duration, {
        success: true,
        argumentTypes: args.map(arg => typeof arg)
      }).catch(error => {
        console.error(`Failed to track performance for ${operationName}:`, error);
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Track error and performance in background
      Promise.all([
        gadgetAnalytics.trackError(error as Error, { operation: operationName }),
        gadgetAnalytics.trackPerformance(operationName, duration, {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        })
      ]).catch(trackingError => {
        console.error(`Failed to track error/performance for ${operationName}:`, trackingError);
      });
      
      throw error;
    }
  };
};

// Enhanced rate-limit monitoring for Shopify API
export const monitorShopifyRateLimit = (response: Response) => {
  try {
    // Extract rate limit headers from Shopify response
    const remaining = parseInt(response.headers.get('X-Shopify-Shop-Api-Call-Limit')?.split('/')[0] || '0');
    const limit = parseInt(response.headers.get('X-Shopify-Shop-Api-Call-Limit')?.split('/')[1] || '40');
    const percentage = (remaining / limit) * 100;
    
    // Log rate limit usage
    console.log(`Shopify API Rate Limit: ${remaining}/${limit} (${percentage.toFixed(1)}% remaining)`);
    
    // Track as metric if usage is high
    if (percentage < 20) {
      gadgetAnalytics.trackBusinessMetric('shopify_rate_limit', percentage, {
        remaining,
        limit,
        critical: percentage < 10
      });
      
      // Warn if rate limit is critical
      if (percentage < 10) {
        console.warn('Critical Shopify API rate limit usage!');
        
        // Show toast only on very low limits to avoid spamming
        if (percentage < 5) {
          toast.warning('API Rate Limit Warning', {
            description: 'Approaching Shopify API rate limits. Some operations may be delayed.'
          });
        }
      }
    }
    
    return { remaining, limit, percentage };
  } catch (error) {
    console.error('Error monitoring rate limit:', error);
    return { remaining: 0, limit: 40, percentage: 0 };
  }
};

// Initialize analytics on module import
gadgetAnalytics.initialize();
