
/**
 * Type definitions for analytics module
 */

// Helper type for usage tracking
export type UsageAction = 'viewed' | 'used' | 'configured' | 'error';
export type UsageCategory = 'page' | 'feature' | 'integration' | 'workflow';

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface UsageTracker {
  trackView: (label?: string) => void;
  trackUse: (action: string, metadata?: Record<string, any>) => void;
  trackError: (error: Error | string, metadata?: Record<string, any>) => void;
}

// Performance tracking
export interface PerformanceMarker {
  id: string;
  label: string;
  startTime: number;
  metadata?: Record<string, any>;
}
