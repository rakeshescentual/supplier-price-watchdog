
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit, Upload, Layers } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { PriceItem } from "@/types/price";
import { PriceUpdateOperationForm } from "./bulk-operations/PriceUpdateOperationForm";
import { OperationProgress } from "./bulk-operations/OperationProgress";
import { useBulkOperation } from "./hooks/useBulkOperation";

interface ShopifyBulkOperationsPanelProps {
  items?: PriceItem[];
  onOperationComplete?: () => void;
}

export function ShopifyBulkOperationsPanel({ 
  items = [], 
  onOperationComplete 
}: ShopifyBulkOperationsPanelProps) {
  const { shopifyContext } = useShopify();
  const {
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
  } = useBulkOperation(items, onOperationComplete);

  const isPlusStore = shopifyContext?.shopPlan === "Shopify Plus";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Shopify Bulk Operations
        </CardTitle>
        <CardDescription>
          Efficiently update multiple products in your Shopify store
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <PriceUpdateOperationForm 
          operationType={operationType}
          setOperationType={setOperationType}
          dryRun={dryRun}
          setDryRun={setDryRun}
          notifyCustomers={notifyCustomers}
          setNotifyCustomers={setNotifyCustomers}
          isPlusStore={isPlusStore}
        />
        
        <OperationProgress 
          isProcessing={isProcessing}
          progress={progress}
          itemCount={items.length}
          operationResult={operationResult}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isProcessing}>
          <FileEdit className="h-4 w-4 mr-2" />
          View Operation History
        </Button>
        
        <Button 
          onClick={handleBulkOperation}
          disabled={!shopifyContext || items.length === 0 || isProcessing}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : `Process ${items.length} Items`}
        </Button>
      </CardFooter>
    </Card>
  );
}
