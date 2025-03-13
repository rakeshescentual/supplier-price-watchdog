
/**
 * Price-related Gadget actions
 */
import { runGadgetAction } from './core';
import { GadgetActionResponse } from './types';
import type { PriceItem } from '@/types/price';

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
