
import { gadgetAnalytics } from '../analytics';

export interface ShopifyPlusMetrics {
  apiUsage: {
    rest: number;
    graphql: number;
    totalRequests: number;
    rateLimited: number;
  };
  features: {
    scripts: number;
    flow: number;
    launchpad: number;
    b2b: number;
  };
  performance: {
    averageResponseTime: number;
    slowRequests: number;
    failedRequests: number;
  };
}

/**
 * Track Shopify Plus metrics for enhanced monitoring
 */
export const trackShopifyPlusMetrics = (metrics: Partial<ShopifyPlusMetrics>): Promise<boolean> => {
  return gadgetAnalytics.trackBusinessMetric('shopify_plus_usage', 1, {
    ...metrics,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Shopify Scripts usage
 */
export const trackScriptsUsage = (
  action: 'viewed' | 'used' | 'configured',
  scriptType: 'discount' | 'shipping' | 'payment',
  metadata?: Record<string, any>
): Promise<boolean> => {
  return gadgetAnalytics.trackFeatureUsage('shopify_scripts', action, {
    scriptType,
    ...metadata
  });
};

/**
 * Track Shopify Flow usage
 */
export const trackFlowUsage = (
  action: 'viewed' | 'used' | 'configured',
  flowType: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  return gadgetAnalytics.trackFeatureUsage('shopify_flow', action, {
    flowType,
    ...metadata
  });
};

/**
 * Track B2B feature usage
 */
export const trackB2BUsage = (
  action: 'viewed' | 'used' | 'configured',
  feature: 'pricelist' | 'company' | 'locations' | 'payment_terms',
  metadata?: Record<string, any>
): Promise<boolean> => {
  return gadgetAnalytics.trackFeatureUsage('shopify_b2b', action, {
    feature,
    ...metadata
  });
};

/**
 * Create a Shopify feature tracker
 */
export const createShopifyFeatureTracker = (featureName: string) => {
  return {
    trackView: (subfeature?: string) => {
      return gadgetAnalytics.trackFeatureUsage(`shopify_${featureName}`, 'viewed', {
        subfeature
      });
    },
    trackCreate: (metadata?: Record<string, any>) => {
      return gadgetAnalytics.trackFeatureUsage(`shopify_${featureName}`, 'used', metadata);
    },
    trackUpdate: (metadata?: Record<string, any>) => {
      return gadgetAnalytics.trackFeatureUsage(`shopify_${featureName}`, 'used', metadata);
    },
    trackDelete: (metadata?: Record<string, any>) => {
      return gadgetAnalytics.trackFeatureUsage(`shopify_${featureName}`, 'used', metadata);
    },
    trackUse: (action: string, metadata?: Record<string, any>) => {
      return gadgetAnalytics.trackFeatureUsage(`shopify_${featureName}`, 'used', {
        action,
        ...metadata
      });
    }
  };
};
