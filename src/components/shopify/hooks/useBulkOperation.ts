
import { useState } from "react";
import { PriceItem } from "@/types/price";
import { useShopify } from "@/contexts/shopify";
import { syncPriceItems, isGadgetAvailable } from "@/services/shopify";

export function useBulkOperation(items: PriceItem[] = [], onOperationComplete?: () => void) {
  const { shopifyContext } = useShopify();
  const [operationType, setOperationType] = useState<"update" | "schedule" | "discount">("update");
  const [dryRun, setDryRun] = useState(true);
  const [notifyCustomers, setNotifyCustomers] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [operationResult, setOperationResult] = useState<{
    success?: boolean;
    message?: string;
    updatedCount?: number;
    failedCount?: number;
  } | null>(null);

  // Determine if Gadget.dev integration can be used
  const canUseGadget = isGadgetAvailable();

  const handleBulkOperation = async () => {
    if (!shopifyContext || items.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setOperationResult(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    try {
      // Use the new service function
      const result = await syncPriceItems(
        shopifyContext,
        items,
        {
          useGadget: canUseGadget,
          dryRun,
          notifyCustomers
        }
      );

      // Ensure progress reaches 100%
      setProgress(100);
      
      // Process the result
      setOperationResult({
        success: result.success,
        message: result.message,
        updatedCount: result.syncedItems?.length || 0,
        failedCount: result.success ? 0 : items.length
      });

      // Call the completion callback if provided
      if (onOperationComplete) {
        onOperationComplete();
      }
    } catch (error) {
      console.error("Bulk operation error:", error);
      
      setOperationResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        updatedCount: 0,
        failedCount: items.length
      });
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  return {
    operationType,
    setOperationType,
    dryRun,
    setDryRun,
    notifyCustomers,
    setNotifyCustomers,
    isProcessing,
    progress,
    operationResult,
    handleBulkOperation,
    canUseGadget
  };
}

export default useBulkOperation;
