
/**
 * Competitor-related Gadget actions
 */
import { runGadgetAction } from './core';
import { GadgetActionResponse } from './types';

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
