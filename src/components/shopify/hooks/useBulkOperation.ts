
import { useState } from "react";
import { toast } from "sonner";
import { useShopify } from "@/contexts/shopify";
import { PriceItem } from "@/types/price";
import { adaptPriceItems } from "../utils/priceItemAdapter";

export function useBulkOperation(
  items: PriceItem[] = [],
  onOperationComplete?: () => void
) {
  const { isShopifyConnected, bulkOperations } = useShopify();
  const [operationType, setOperationType] = useState("price-update");
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

  const handleBulkOperation = async () => {
    if (!isShopifyConnected || !items.length) {
      toast.error("Cannot perform operation", {
        description: !isShopifyConnected 
          ? "Please connect to Shopify first" 
          : "No items to process"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOperationResult(null);

    try {
      // Different operations based on selected type
      if (operationType === "price-update") {
        // Use the adapter function to convert items to the expected type
        const adaptedItems = adaptPriceItems(items);
        
        const result = await bulkOperations.updatePrices(adaptedItems, {
          dryRun,
          notifyCustomers,
          onProgress: setProgress
        });

        setOperationResult({
          success: result.success,
          message: result.message,
          updatedCount: result.updatedCount,
          failedCount: result.failedCount
        });

        if (result.success) {
          toast.success("Bulk operation complete", {
            description: `Updated ${result.updatedCount} products in Shopify`
          });
        } else {
          toast.error("Bulk operation failed", {
            description: result.message
          });
        }
        
        // Call the onOperationComplete callback if provided
        if (onOperationComplete) {
          onOperationComplete();
        }
      }
    } catch (error) {
      console.error("Bulk operation error:", error);
      setOperationResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error during bulk operation",
        updatedCount: 0,
        failedCount: items.length
      });
      
      toast.error("Bulk operation failed", {
        description: "An error occurred during the operation"
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
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
    handleBulkOperation
  };
}
