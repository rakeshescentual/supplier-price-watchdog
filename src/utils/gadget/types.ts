
/**
 * Gadget types for type safety across the application
 */

export interface GadgetConfig {
  apiKey: string;
  appId: string;
  environment: "development" | "production";
  featureFlags?: {
    enableAdvancedAnalytics?: boolean;
    enablePdfProcessing?: boolean;
    enableMarketData?: boolean;
  };
}

export interface GadgetHealth {
  status: "healthy" | "degraded" | "down";
  components: Record<string, { status: "healthy" | "degraded" | "down"; message?: string }>;
  latency?: number;
  version?: string;
}

export interface GadgetConnectionTestResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}

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
