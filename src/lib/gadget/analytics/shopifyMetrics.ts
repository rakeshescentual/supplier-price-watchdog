
/**
 * Shopify-specific analytics for tracking feature usage
 */
import { gadgetAnalytics } from '../analytics';

// Creates a Shopify feature-specific tracker
export const createShopifyFeatureTracker = (featureName: string) => {
  const baseFeature = `shopify:${featureName}`;
  
  return {
    trackView: (subfeature?: string): void => {
      const feature = subfeature ? `${baseFeature}:${subfeature}` : baseFeature;
      gadgetAnalytics.trackFeatureUsage(feature, 'viewed');
    },
    
    trackUse: (action: string, metadata?: Record<string, any>): void => {
      gadgetAnalytics.trackFeatureUsage(`${baseFeature}:${action}`, 'used', metadata);
    },
    
    trackError: (error: Error | string, metadata?: Record<string, any>): void => {
      gadgetAnalytics.trackError(
        error instanceof Error ? error.message : error,
        { feature: baseFeature, ...metadata }
      );
    },
    
    trackSuccess: async (operation: string, metadata?: Record<string, any>): Promise<boolean> => {
      try {
        gadgetAnalytics.trackFeatureUsage(
          `${baseFeature}:${operation}:success`, 
          'used',
          metadata
        );
        return true;
      } catch (e) {
        console.error(`Failed to track success for ${baseFeature}:${operation}`, e);
        return false;
      }
    },
    
    trackFailure: async (operation: string, error: Error | string, metadata?: Record<string, any>): Promise<boolean> => {
      try {
        const errorMessage = error instanceof Error ? error.message : error;
        gadgetAnalytics.trackFeatureUsage(
          `${baseFeature}:${operation}:failure`, 
          'error',
          { error: errorMessage, ...metadata }
        );
        return true;
      } catch (e) {
        console.error(`Failed to track failure for ${baseFeature}:${operation}`, e);
        return false;
      }
    },
    
    trackPerformance: async (operation: string, durationMs: number, metadata?: Record<string, any>): Promise<boolean> => {
      try {
        gadgetAnalytics.trackPerformance(`${baseFeature}:${operation}`, durationMs);
        return true;
      } catch (e) {
        console.error(`Failed to track performance for ${baseFeature}:${operation}`, e);
        return false;
      }
    },
    
    trackConfiguration: async (config: Record<string, any>): Promise<boolean> => {
      try {
        gadgetAnalytics.trackFeatureUsage(
          `${baseFeature}:configured`,
          'configured',
          { config }
        );
        return true;
      } catch (e) {
        console.error(`Failed to track configuration for ${baseFeature}`, e);
        return false;
      }
    }
  };
};

// Track Shopify store metrics
export const trackShopifyStoreMetrics = (
  metrics: {
    products?: number;
    collections?: number;
    orders?: number;
    customers?: number;
  }
) => {
  if (metrics.products) {
    gadgetAnalytics.trackBusinessMetric('shopify:products:count', metrics.products);
  }
  
  if (metrics.collections) {
    gadgetAnalytics.trackBusinessMetric('shopify:collections:count', metrics.collections);
  }
  
  if (metrics.orders) {
    gadgetAnalytics.trackBusinessMetric('shopify:orders:count', metrics.orders);
  }
  
  if (metrics.customers) {
    gadgetAnalytics.trackBusinessMetric('shopify:customers:count', metrics.customers);
  }
};

// Create specific feature trackers
export const shopifyWebhookTracker = createShopifyFeatureTracker('webhooks');
export const shopifyScriptTracker = createShopifyFeatureTracker('scripts');
export const shopifyFlowTracker = createShopifyFeatureTracker('flow');
export const shopifyB2BTracker = createShopifyFeatureTracker('b2b');
export const shopifyMultipassTracker = createShopifyFeatureTracker('multipass');
