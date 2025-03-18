
/**
 * Type definitions for Gadget status utilities
 */

export interface GadgetStatusResponse {
  status: 'ready' | 'degraded' | 'down';
  message: string;
  latency?: number;
}

export interface GadgetStatusSummaryResponse {
  status: 'ready' | 'partial' | 'degraded' | 'down';
  message: string;
  details: Record<string, any>;
}

export interface GadgetComponentStatus {
  status: 'healthy' | 'degraded' | 'down';
  message?: string;
}

export interface GadgetReadinessCheck {
  ready: boolean;
  reason?: 'configuration_missing' | 'api_key_missing' | 'app_id_missing';
}

export type GadgetServiceHealth = Record<string, 'healthy' | 'degraded' | 'unhealthy'>;
