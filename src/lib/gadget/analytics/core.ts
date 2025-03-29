
/**
 * Core analytics functionality for Gadget.dev
 * Handles tracking events, queueing, and flushing to APIs
 */

import { logInfo, logError } from '../logging';
import { getGadgetConfig } from '@/utils/gadget/config';
import { initGadgetClientV2, isGadgetV2Initialized } from '../client/gadgetClientV2';
import { AnalyticsEvent, UsageTracker } from './types';

// Queue for batching events
let analyticsQueue: AnalyticsEvent[] = [];
let isFlushScheduled = false;
const FLUSH_INTERVAL = 5000; // 5 seconds

/**
 * Track a usage event
 */
export const trackUsage = (
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
export const flushAnalyticsQueue = async (): Promise<void> => {
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
export const createUsageTracker = (featureName: string): UsageTracker => {
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
export const trackBusinessMetric = (
  metric: string,
  value: number,
  metadata?: Record<string, any>
): void => {
  trackUsage('business', 'metric', metric, value, metadata);
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (
  feature: string,
  action: 'viewed' | 'used' | 'configured' | 'error' = 'used',
  metadata?: Record<string, any>
): void => {
  trackUsage('feature', action, feature, undefined, metadata);
};

/**
 * Track integration connection
 */
export const trackIntegrationConnection = (
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
export const trackError = (
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
export const identifyUser = (
  userId: string,
  traits?: Record<string, any>
): void => {
  trackUsage('user', 'identify', userId, undefined, traits);
};

/**
 * Track page view
 */
export const trackPageView = (
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
