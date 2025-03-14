
/**
 * Price-related actions for Gadget
 */
import { logInfo } from '../logging';
import { runGadgetAction } from './core';
import { PriceItem } from '@/types/price';
import { GadgetActionOptions, GadgetActionResponse } from './types';

/**
 * Analyze price changes using Gadget
 * @param items Price items to analyze
 * @param options Options for the action
 * @returns Promise resolving to analysis results
 */
export const analyzePriceChanges = async (
  items: PriceItem[],
  options: GadgetActionOptions = {}
): Promise<GadgetActionResponse<{
  recommendations: Array<{
    sku: string;
    recommendedPrice: number;
    reasoning: string;
    confidence: number;
  }>;
  marketInsights: {
    averagePriceChange: number;
    priceChangeDistribution: Record<string, number>;
    competitivenessScore: number;
  };
}>> => {
  logInfo(`Analyzing ${items.length} price changes with Gadget`, {
    itemCount: items.length
  }, 'price-actions');
  
  return runGadgetAction(
    'analyzePriceChanges',
    { items },
    {
      ...options,
      toastMessages: {
        loading: 'Analyzing price changes...',
        success: 'Price analysis complete',
        error: 'Error analyzing prices',
        ...options.toastMessages
      }
    }
  );
};

/**
 * Generate price recommendations
 * @param items Price items to generate recommendations for
 * @param options Options for the action
 * @returns Promise resolving to price recommendations
 */
export const generatePriceRecommendations = async (
  items: PriceItem[],
  options: GadgetActionOptions = {}
): Promise<GadgetActionResponse<{
  recommendations: Array<{
    sku: string;
    currentPrice: number;
    recommendedPrice: number;
    percentChange: number;
    reasoning: string;
  }>;
}>> => {
  logInfo(`Generating price recommendations for ${items.length} items with Gadget`, {
    itemCount: items.length
  }, 'price-actions');
  
  return runGadgetAction(
    'generatePriceRecommendations',
    { items },
    {
      ...options,
      toastMessages: {
        loading: 'Generating price recommendations...',
        success: 'Price recommendations ready',
        error: 'Error generating recommendations',
        ...options.toastMessages
      }
    }
  );
};
