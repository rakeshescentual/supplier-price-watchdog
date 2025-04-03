
import React, { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ShopifyBulkOperationsPanel } from "./ShopifyBulkOperationsPanel";
import { AlertTriangle } from "lucide-react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { useShopify } from "@/contexts/shopify";
import { Alert, AlertDescription } from "../ui/alert";
import { BulkOperationHistoryList } from "./bulk-operations/BulkOperationHistoryList";
import { ComingSoonPlaceholder } from "./bulk-operations/ComingSoonPlaceholder";
import { useBulkOperationsHistory } from "./bulk-operations/useBulkOperationsHistory";

export function ShopifyBulkOperations() {
  const { items } = useFileAnalysis();
  const { isShopifyConnected } = useShopify();
  const [activeTab, setActiveTab] = useState("price-updates");
  
  const {
    operationsHistory,
    isLoading,
    loadOperationHistory,
    handleExportHistory,
    handleClearHistory,
    handleRefreshHistory
  } = useBulkOperationsHistory();

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
          <ComingSoonPlaceholder />
        </TabsContent>
        
        <TabsContent value="history" className="pt-6">
          <BulkOperationHistoryList
            operationsHistory={operationsHistory}
            isLoading={isLoading}
            onRefresh={handleRefreshHistory}
            onExport={handleExportHistory}
            onClear={handleClearHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
