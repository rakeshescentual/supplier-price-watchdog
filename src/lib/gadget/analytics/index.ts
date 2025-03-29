
/**
 * Analytics module for Gadget.dev - Main entry point
 * Provides a unified API for all analytics functionality
 */

// Re-export everything from the core module
export * from './core';

// Export the full analytics API object
import { trackUsage, trackFeatureUsage, trackIntegrationConnection, 
         trackBusinessMetric, trackError, createUsageTracker, 
         flushAnalyticsQueue, identifyUser, trackPageView } from './core';
import { startPerformanceTracking, trackPerformance } from './performance';
import { AnalyticsEvent, UsageTracker } from './types';

// Unified analytics API
export const gadgetAnalytics = {
  // Core analytics
  trackUsage,
  trackFeatureUsage,
  trackIntegrationConnection,
  trackBusinessMetric,
  trackError,
  createUsageTracker,
  flushAnalyticsQueue,
  identifyUser,
  trackPageView,
  
  // Performance tracking
  startPerformanceTracking,
  trackPerformance: (label: string, durationMs: number, metadata?: Record<string, any>) => {
    trackPerformance(label, durationMs, metadata);
  }
};

// Re-export types
export type { AnalyticsEvent, UsageTracker };
