
import React, { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ShopifyBulkOperationsPanel } from "./ShopifyBulkOperationsPanel";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Download, 
  Clock, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { getBulkOperationHistory, clearBulkOperationHistory } from "@/lib/shopify/bulkOperations";
import { BulkOperationHistory } from "@/lib/shopify/bulkOperations";
import { useShopify } from "@/contexts/shopify";
import { Alert, AlertDescription } from "../ui/alert";

export function ShopifyBulkOperations() {
  const { items } = useFileAnalysis();
  const { isShopifyConnected } = useShopify();
  const [activeTab, setActiveTab] = useState("price-updates");
  const [operationsHistory, setOperationsHistory] = useState<BulkOperationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load operation history on component mount
    loadOperationHistory();
  }, []);
  
  const loadOperationHistory = () => {
    try {
      const history = getBulkOperationHistory();
      setOperationsHistory(history);
    } catch (error) {
      console.error("Error loading operation history:", error);
    }
  };
  
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

  if (!isShopifyConnected) {
    return (
      <Alert variant="warning" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Shopify connection is required to use bulk operations. Please connect to Shopify first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="price-updates">Price Updates</TabsTrigger>
          <TabsTrigger value="inventory-updates">Inventory Updates</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price-updates" className="pt-6">
          <ShopifyBulkOperationsPanel items={items} onOperationComplete={loadOperationHistory} />
        </TabsContent>
        
        <TabsContent value="inventory-updates" className="pt-6">
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Feature Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                Bulk inventory updates will be available in an upcoming release.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="pt-6">
          <div className="border rounded-md">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-medium">Recent Bulk Operations</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshHistory}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportHistory}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {operationsHistory.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearHistory}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear History
                  </Button>
                )}
              </div>
            </div>
            
            {operationsHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No operation history found
              </div>
            ) : (
              <div className="divide-y">
                {operationsHistory.map(operation => (
                  <div key={operation.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {operation.type === "priceUpdate" ? "Price Update" : 
                           operation.type === "inventoryUpdate" ? "Inventory Update" : 
                           operation.type === "metafieldUpdate" ? "Metafield Update" : 
                           "Bulk Operation"}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          operation.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          operation.status === "FAILED" ? "bg-red-100 text-red-800" : 
                          operation.status === "CANCELED" ? "bg-orange-100 text-orange-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {operation.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {new Date(operation.createdAt).toLocaleDateString()} {new Date(operation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-muted-foreground">Total Items</div>
                          <div className="font-medium">{operation.itemCount}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Completed</div>
                          <div className="font-medium text-green-600">
                            {operation.status === "COMPLETED" ? operation.itemCount : 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Failed</div>
                          <div className={`font-medium ${operation.status === "FAILED" ? "text-red-600" : ""}`}>
                            {operation.status === "FAILED" ? operation.itemCount : 0}
                          </div>
                        </div>
                      </div>
                      {operation.errorMessage && (
                        <div className="mt-2 p-2 text-xs bg-red-50 text-red-700 rounded">
                          {operation.errorMessage}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

