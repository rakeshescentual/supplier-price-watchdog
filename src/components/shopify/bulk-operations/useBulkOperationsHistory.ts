
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  getBulkOperationHistory, 
  clearBulkOperationHistory, 
  BulkOperationHistoryItem 
} from "@/lib/shopify/bulkOperations";

export function useBulkOperationsHistory() {
  const [operationsHistory, setOperationsHistory] = useState<BulkOperationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadOperationHistory = () => {
    try {
      const history = getBulkOperationHistory();
      setOperationsHistory(history);
    } catch (error) {
      console.error("Error loading operation history:", error);
    }
  };
  
  useEffect(() => {
    loadOperationHistory();
  }, []);
  
  const handleExportHistory = () => {
    try {
      // Create a JSON string of the operations history
      const historyJson = JSON.stringify(operationsHistory, null, 2);
      
      // Create a blob from the JSON string
      const blob = new Blob([historyJson], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopify-operations-history-${new Date().toISOString().slice(0, 10)}.json`;
      
      // Trigger a click on the anchor element
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("History exported", {
        description: "Operations history has been downloaded"
      });
    } catch (error) {
      console.error("Error exporting history:", error);
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Failed to export history"
      });
    }
  };
  
  const handleClearHistory = () => {
    try {
      clearBulkOperationHistory();
      setOperationsHistory([]);
      toast.success("History cleared", {
        description: "Operations history has been cleared"
      });
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Clear failed", {
        description: error instanceof Error ? error.message : "Failed to clear history"
      });
    }
  };
  
  const handleRefreshHistory = () => {
    setIsLoading(true);
    try {
      loadOperationHistory();
      toast.success("History refreshed");
    } catch (error) {
      toast.error("Refresh failed", {
        description: error instanceof Error ? error.message : "Failed to refresh history"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    operationsHistory,
    isLoading,
    loadOperationHistory,
    handleExportHistory,
    handleClearHistory,
    handleRefreshHistory
  };
}
