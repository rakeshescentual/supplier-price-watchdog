
/**
 * Competitor-related actions for Gadget
 */
import { logInfo } from '../logging';
import { runGadgetAction } from './core';
import { GadgetActionOptions, GadgetActionResponse } from './types';

/**
 * Schedule a competitor price check
 * @param productSkus SKUs to check
 * @param options Options for the action
 * @returns Promise resolving to scheduled check result
 */
export const scheduleCompetitorCheck = async (
  productSkus: string[],
  options: GadgetActionOptions = {}
): Promise<GadgetActionResponse<{
  jobId: string;
  estimatedCompletionTime: string;
  skusToCheck: string[];
}>> => {
  logInfo(`Scheduling competitor check for ${productSkus.length} SKUs with Gadget`, {
    skuCount: productSkus.length
  }, 'competitor-actions');
  
  return runGadgetAction(
    'scheduleCompetitorCheck',
    { productSkus },
    {
      ...options,
      toastMessages: {
        loading: 'Scheduling competitor price check...',
        success: 'Competitor check scheduled',
        error: 'Error scheduling competitor check',
        ...options.toastMessages
      }
    }
  );
};
