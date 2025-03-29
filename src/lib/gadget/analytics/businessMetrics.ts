
/**
 * Business metrics tracking for Gadget.dev
 * Specialized analytics for tracking business-relevant events
 */

import { trackBusinessMetric, trackUsage } from './core';

/**
 * Track a conversion event
 */
export const trackConversion = (
  source: string,
  value?: number,
  metadata?: Record<string, any>
): void => {
  trackUsage('conversion', 'completed', source, value, metadata);
  if (value !== undefined) {
    trackBusinessMetric(`conversion:${source}`, value, metadata);
  }
};

/**
 * Track a revenue event
 */
export const trackRevenue = (
  amount: number,
  currency: string = 'USD',
  metadata?: Record<string, any>
): void => {
  trackBusinessMetric('revenue', amount, {
    currency,
    ...metadata
  });
};

/**
 * Track user engagement metrics
 */
export const trackEngagement = (
  metric: string,
  value: number,
  metadata?: Record<string, any>
): void => {
  trackBusinessMetric(`engagement:${metric}`, value, metadata);
};

/**
 * Track subscription metrics
 */
export const trackSubscription = (
  action: 'started' | 'renewed' | 'upgraded' | 'downgraded' | 'canceled',
  plan: string,
  metadata?: Record<string, any>
): void => {
  trackUsage('subscription', action, plan, undefined, metadata);
};
