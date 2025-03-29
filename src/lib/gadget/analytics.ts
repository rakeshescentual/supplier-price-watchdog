
/**
 * Enhanced analytics module for Gadget.dev
 * Supports the upcoming analytics API changes
 */

import { logInfo, logError } from './logging';
import { getGadgetConfig } from '@/utils/gadget/config';
import { initGadgetClientV2, isGadgetV2Initialized } from './client/gadgetClientV2';

// Helper type for usage tracking
type UsageAction = 'viewed' | 'used' | 'configured' | 'error';
type UsageCategory = 'page' | 'feature' | 'integration' | 'workflow';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface UsageTracker {
  trackView: (label?: string) => void;
  trackUse: (action: string, metadata?: Record<string, any>) => void;
  trackError: (error: Error | string, metadata?: Record<string, any>) => void;
}

// Performance tracking
interface PerformanceMarker {
  id: string;
  label: string;
  startTime: number;
  metadata?: Record<string, any>;
}

// Queue for batching events
let analyticsQueue: AnalyticsEvent[] = [];
let isFlushScheduled = false;
const FLUSH_INTERVAL = 5000; // 5 seconds

// Store for performance markers
const performanceMarkers: Map<string, PerformanceMarker> = new Map();

/**
 * Start tracking performance for an operation
 * @returns Function to call when operation is complete
 */
const startPerformanceTracking = (
  label: string,
  metadata?: Record<string, any>
): (() => Promise<void>) => {
  const id = `perf-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const marker: PerformanceMarker = {
    id,
    label,
    startTime: performance.now(),
    metadata
  };
  
  performanceMarkers.set(id, marker);
  
  return async () => {
    const endTime = performance.now();
    const marker = performanceMarkers.get(id);
    
    if (marker) {
      performanceMarkers.delete(id);
      const durationMs = Math.round(endTime - marker.startTime);
      
      // Track the performance metric
      trackUsage('performance', 'measure', marker.label, durationMs, {
        ...marker.metadata,
        durationMs
      });
      
      logInfo(`Performance: ${marker.label} completed in ${durationMs}ms`, {
        label: marker.label,
        durationMs,
        ...marker.metadata
      }, 'telemetry');
    }
  };
};

/**
 * Track a usage event
 */
const trackUsage = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number,
  metadata?: Record<string, any>
): void => {
  try {
    // Create event
    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    // Add to queue
    analyticsQueue.push(event);
    
    // Schedule queue flush if not already scheduled
    if (!isFlushScheduled) {
      isFlushScheduled = true;
      setTimeout(flushAnalyticsQueue, FLUSH_INTERVAL);
    }
    
    // Log event
    logInfo(`Analytics event: ${category}/${action}`, {
      label,
      value,
      metadata
    }, 'telemetry');
  } catch (error) {
    logError('Error tracking analytics event', { error }, 'system');
  }
};

/**
 * Flush analytics queue
 */
const flushAnalyticsQueue = async (): Promise<void> => {
  if (analyticsQueue.length === 0) {
    isFlushScheduled = false;
    return;
  }
  
  try {
    const events = [...analyticsQueue];
    analyticsQueue = [];
    isFlushScheduled = false;
    
    // Try to use V2 client first
    let client;
    if (isGadgetV2Initialized()) {
      client = await initGadgetClientV2();
    }
    
    if (client) {
      // In production, this would use the new analytics API:
      // await client.api.analytics.trackEvents({ events });
      
      // For now, just log
      logInfo(`Flushed ${events.length} analytics events`, {
        eventCount: events.length
      }, 'telemetry');
    } else {
      // Fall back to local storage if client not available
      const storedEvents = JSON.parse(localStorage.getItem('gadget_analytics_events') || '[]');
      localStorage.setItem('gadget_analytics_events', JSON.stringify([...storedEvents, ...events]));
    }
  } catch (error) {
    logError('Error flushing analytics queue', { error }, 'system');
    
    // Store in localStorage as fallback
    try {
      const storedEvents = JSON.parse(localStorage.getItem('gadget_analytics_events') || '[]');
      localStorage.setItem('gadget_analytics_events', JSON.stringify([...storedEvents, ...analyticsQueue]));
      analyticsQueue = [];
    } catch (e) {
      // Last resort fallback
      console.error('Failed to store analytics events in localStorage', e);
    }
  }
};

/**
 * Create a feature-specific usage tracker
 */
const createUsageTracker = (featureName: string): UsageTracker => {
  return {
    trackView: (label?: string) => {
      trackUsage('feature', 'viewed', `${featureName}${label ? `:${label}` : ''}`, undefined, { feature: featureName });
    },
    trackUse: (action: string, metadata?: Record<string, any>) => {
      trackUsage('feature', 'used', `${featureName}:${action}`, undefined, { feature: featureName, ...metadata });
    },
    trackError: (error: Error | string, metadata?: Record<string, any>) => {
      const errorMessage = error instanceof Error ? error.message : error;
      trackUsage('feature', 'error', `${featureName}:error`, undefined, { 
        feature: featureName, 
        error: errorMessage,
        ...metadata 
      });
    }
  };
};

/**
 * Track a business metric
 */
const trackBusinessMetric = (
  metric: string,
  value: number,
  metadata?: Record<string, any>
): void => {
  trackUsage('business', 'metric', metric, value, metadata);
};

/**
 * Track feature usage
 */
const trackFeatureUsage = (
  feature: string,
  action: UsageAction = 'used',
  metadata?: Record<string, any>
): void => {
  trackUsage('feature', action, feature, undefined, metadata);
};

/**
 * Track integration connection
 */
const trackIntegrationConnection = (
  integration: string,
  connected: boolean,
  metadata?: Record<string, any>
): void => {
  trackUsage(
    'integration', 
    connected ? 'connected' : 'disconnected', 
    integration, 
    undefined,
    metadata
  );
};

/**
 * Track error
 */
const trackError = (
  error: Error | string,
  metadata?: Record<string, any>
): void => {
  const errorMessage = error instanceof Error ? error.message : error;
  trackUsage('error', 'occurred', errorMessage, undefined, metadata);
};

/**
 * Identify user for analytics
 * @param userId User ID to associate with subsequent events
 */
const identifyUser = (
  userId: string,
  traits?: Record<string, any>
): void => {
  trackUsage('user', 'identify', userId, undefined, traits);
};

/**
 * Track page view
 */
const trackPageView = (
  path: string,
  title?: string,
  metadata?: Record<string, any>
): void => {
  trackUsage('page', 'view', path, undefined, {
    title,
    url: window.location.href,
    referrer: document.referrer,
    ...metadata
  });
};

// Export analytics API
export const gadgetAnalytics = {
  trackUsage,
  trackFeatureUsage,
  trackIntegrationConnection,
  trackBusinessMetric,
  trackError,
  createUsageTracker,
  flushAnalyticsQueue,
  startPerformanceTracking,
  identifyUser,
  trackPageView,
  // Add performance tracking
  trackPerformance: (label: string, durationMs: number, metadata?: Record<string, any>) => {
    trackUsage('performance', 'measure', label, durationMs, metadata);
  }
};
