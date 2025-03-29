
/**
 * Performance tracking module for Gadget.dev analytics
 */

import { logInfo } from '../logging';
import { trackUsage } from './core';
import { PerformanceMarker } from './types';

// Store for performance markers
const performanceMarkers: Map<string, PerformanceMarker> = new Map();

/**
 * Start tracking performance for an operation
 * @returns Function to call when operation is complete
 */
export const startPerformanceTracking = (
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
      trackPerformance(marker.label, durationMs, {
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
 * Track a performance metric
 */
export const trackPerformance = (
  label: string,
  durationMs: number,
  metadata?: Record<string, any>
): void => {
  trackUsage('performance', 'measure', label, durationMs, metadata);
};
