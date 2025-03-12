
/**
 * Custom Gadget Actions Module
 * 
 * This module provides an interface to custom Gadget actions
 * for the Supplier Price Watch application.
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { startPerformanceTracking } from './telemetry';
import { GadgetActionResponse } from './index';
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';

/**
 * Run a custom Gadget action with performance tracking and error handling
 */
export async function runGadgetAction<T, P = Record<string, any>>(
  actionName: string,
  params: P,
  options: {
    showToast?: boolean;
    toastMessages?: {
      loading?: string;
      success?: string;
      error?: string;
    };
    retries?: number;
  } = {}
): Promise<GadgetActionResponse<T>> {
  const client = initGadgetClient();
  if (!client) {
    const error = new Error("Gadget client not initialized");
    if (options.showToast) {
      toast.error(options.toastMessages?.error || "Action failed", {
        description: error.message
      });
    }
    throw error;
  }
  
  const finishTracking = startPerformanceTracking(`action:${actionName}`, { params });
  
  try {
    logInfo(`Running Gadget action: ${actionName}`, { params }, 'actions');
    
    if (options.showToast && options.toastMessages?.loading) {
      toast.loading(options.toastMessages.loading);
    }
    
    // In production with actual Gadget client:
    // const result = await client.mutate[actionName](params);
    
    // For development, simulate a successful response
    const mockResult: GadgetActionResponse<T> = {
      success: true,
      data: {} as T,
      performanceMetrics: {
        durationMs: 250,
        queryCount: 3,
        cacheHitRate: 0.65
      }
    };
    
    finishTracking();
    
    if (options.showToast && options.toastMessages?.success) {
      toast.success(options.toastMessages.success);
    }
    
    return mockResult;
  } catch (error) {
    logError(`Error running Gadget action: ${actionName}`, { error, params }, 'actions');
    finishTracking();
    
    if (options.showToast) {
      toast.error(options.toastMessages?.error || "Action failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
    
    return {
      success: false,
      data: {} as T,
      errors: [{
        message: error instanceof Error ? error.message : "Unknown error",
        code: "ACTION_EXECUTION_ERROR"
      }]
    };
  }
}

/**
 * Analyze price changes with advanced AI via Gadget
 */
export async function analyzePriceChanges(
  items: PriceItem[]
): Promise<GadgetActionResponse<{
  analysis: {
    summary: string;
    impactScore: number;
    recommendations: string[];
    categories: {
      name: string;
      count: number;
      averageIncrease: number;
    }[];
  }
}>> {
  return runGadgetAction(
    'analyzePriceChanges',
    { items },
    {
      showToast: true,
      toastMessages: {
        loading: "Analyzing price changes...",
        success: "Price analysis complete",
        error: "Price analysis failed"
      }
    }
  );
}

/**
 * Schedule a competitor price check via Gadget background job
 */
export async function scheduleCompetitorCheck(
  products: { sku: string; name: string }[],
  competitors: string[]
): Promise<GadgetActionResponse<{
  jobId: string;
  estimatedCompletion: string;
}>> {
  return runGadgetAction(
    'scheduleCompetitorCheck',
    { products, competitors },
    {
      showToast: true,
      toastMessages: {
        loading: "Scheduling competitor price check...",
        success: "Competitor check scheduled",
        error: "Failed to schedule competitor check"
      }
    }
  );
}

/**
 * Synchronize price changes to multiple platforms via Gadget
 */
export async function syncPricesToPlatforms(
  items: PriceItem[],
  platforms: ('shopify' | 'klaviyo' | 'erp')[]
): Promise<GadgetActionResponse<{
  successful: number;
  failed: number;
  platforms: Record<string, { success: boolean; message?: string }>
}>> {
  return runGadgetAction(
    'syncPricesToPlatforms',
    { items, platforms },
    {
      showToast: true,
      toastMessages: {
        loading: "Syncing prices to platforms...",
        success: "Prices synced successfully",
        error: "Price sync failed"
      },
      retries: 2
    }
  );
}

/**
 * Generate optimized price recommendations via Gadget's AI service
 */
export async function generatePriceRecommendations(
  items: PriceItem[],
  options: {
    strategy: 'competitive' | 'margin' | 'volume';
    targetMargin?: number;
    minPrice?: number;
    maxPrice?: number;
  }
): Promise<GadgetActionResponse<{
  recommendations: Array<{
    sku: string;
    currentPrice: number;
    recommendedPrice: number;
    reasoning: string;
    potentialImpact: {
      margin: number;
      volume: number;
      revenue: number;
    }
  }>
}>> {
  return runGadgetAction(
    'generatePriceRecommendations',
    { items, options },
    {
      showToast: true,
      toastMessages: {
        loading: "Generating price recommendations...",
        success: "Price recommendations ready",
        error: "Failed to generate recommendations"
      }
    }
  );
}
