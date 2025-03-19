
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileEdit, Upload, AlertTriangle, CheckCircle, Layers } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { PriceItem as PriceFromPriceTs } from "@/types/price";
import { PriceItem as PriceFromShopifyTs } from "@/types/shopify";

interface ShopifyBulkOperationsPanelProps {
  items?: PriceFromPriceTs[];
}

// Adapter function to convert PriceItem from price.ts to PriceItem from shopify.ts
const adaptPriceItems = (items: PriceFromPriceTs[]): PriceFromShopifyTs[] => {
  return items.map(item => ({
    id: item.id || item.sku, // Ensure id exists
    sku: item.sku,
    name: item.name,
    oldPrice: item.oldPrice,
    newPrice: item.newPrice,
    status: item.status,
    percentChange: item.percentChange || ((item.newPrice - item.oldPrice) / item.oldPrice) * 100,
    shopifyProductId: item.shopifyProductId || item.productId,
    shopifyVariantId: item.shopifyVariantId || item.variantId,
    // Copy any other required properties
    category: item.category,
    supplier: item.vendor,
    lastUpdated: new Date(),
    notes: item.suggestionReason,
    difference: item.difference,
    isMatched: item.isMatched
  })) as PriceFromShopifyTs[];
};

export function ShopifyBulkOperationsPanel({ items = [] }: ShopifyBulkOperationsPanelProps) {
  const { isShopifyConnected, bulkOperations, shopifyContext } = useShopify();
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
        {!isPlusStore && (
          <div className="flex items-start p-4 border rounded-md bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Shopify Plus Recommended</h4>
              <p className="text-sm text-amber-700">
                Bulk operations work best with Shopify Plus. Some features may be limited with your current plan.
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="operation-type">Operation Type</Label>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger id="operation-type" className="w-full">
                <SelectValue placeholder="Select operation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Operations</SelectLabel>
                  <SelectItem value="price-update">Price Update</SelectItem>
                  <SelectItem value="inventory-update" disabled>Inventory Update</SelectItem>
                  <SelectItem value="metafield-update" disabled>Metafield Update</SelectItem>
                  <SelectItem value="tag-update" disabled>Tag Update</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dry-run">Dry Run</Label>
              <p className="text-xs text-muted-foreground">
                Test the operation without making changes
              </p>
            </div>
            <Switch 
              id="dry-run" 
              checked={dryRun} 
              onCheckedChange={setDryRun} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notify-customers">Notify Customers</Label>
              <p className="text-xs text-muted-foreground">
                Send notifications for price changes
              </p>
            </div>
            <Switch 
              id="notify-customers" 
              checked={notifyCustomers} 
              onCheckedChange={setNotifyCustomers} 
              disabled={dryRun || !isPlusStore}
            />
          </div>
        </div>
        
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-center text-muted-foreground">
              Processing {items.length} items ({Math.round(progress)}%)
            </p>
          </div>
        )}
        
        {operationResult && (
          <div className={`p-4 rounded-md ${operationResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-start">
              {operationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              )}
              
              <div>
                <h4 className={`font-medium ${operationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {operationResult.success ? 'Operation Completed' : 'Operation Failed'}
                </h4>
                <p className={`text-sm ${operationResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {operationResult.message}
                </p>
                
                {(operationResult.updatedCount !== undefined || operationResult.failedCount !== undefined) && (
                  <div className="mt-2 text-sm">
                    {operationResult.updatedCount !== undefined && (
                      <p>Updated: {operationResult.updatedCount} items</p>
                    )}
                    {operationResult.failedCount !== undefined && operationResult.failedCount > 0 && (
                      <p>Failed: {operationResult.failedCount} items</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isProcessing}>
          <FileEdit className="h-4 w-4 mr-2" />
          View Operation History
        </Button>
        
        <Button 
          onClick={handleBulkOperation}
          disabled={!isShopifyConnected || items.length === 0 || isProcessing}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : `Process ${items.length} Items`}
        </Button>
      </CardFooter>
    </Card>
  );
}
