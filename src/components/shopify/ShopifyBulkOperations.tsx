import React, { useState } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useFileAnalysis } from '@/contexts/FileAnalysisContext';
import type { PriceItem as ShopifyPriceItem } from '@/types/shopify';

export function ShopifyBulkOperations() {
  const { items } = useFileAnalysis();
  const { isShopifyConnected, shopifyContext, bulkOperations } = useShopify();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastOperation, setLastOperation] = useState<{
    success: boolean;
    operationId?: string;
    updatedCount: number;
    failedCount: number;
    timestamp: Date;
  } | null>(null);

  const increasedItems = items.filter(item => item.status === 'increased');
  const decreasedItems = items.filter(item => item.status === 'decreased');
  const unchangedItems = items.filter(item => item.status === 'unchanged');
  
  const convertToShopifyPriceItems = (items: any[]): ShopifyPriceItem[] => {
    return items.map(item => ({
      id: item.id || item.sku,
      sku: item.sku,
      name: item.name,
      oldPrice: item.oldPrice,
      newPrice: item.newPrice,
      status: item.status,
      percentChange: item.percentChange || ((item.newPrice - item.oldPrice) / item.oldPrice * 100),
      difference: item.difference || (item.newPrice - item.oldPrice),
      isMatched: item.isMatched !== undefined ? item.isMatched : true,
      shopifyProductId: item.shopifyProductId || item.productId,
      shopifyVariantId: item.shopifyVariantId || item.variantId,
      category: item.category,
      supplier: item.supplier || item.vendor,
      ...item
    }));
  };
  
  const handleBulkUpdate = async (dryRun: boolean = false) => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error("Not connected to Shopify");
      return;
    }
    
    if (items.length === 0) {
      toast.error("No items to update");
      return;
    }
    
    setIsRunning(true);
    setProgress(0);
    
    try {
      const shopifyItems = convertToShopifyPriceItems(items);
      
      const result = await bulkOperations.updatePrices(shopifyItems, {
        dryRun,
        notifyCustomers: false,
        onProgress: (p) => setProgress(p)
      });
      
      setLastOperation({
        success: result.success,
        operationId: result.operationId,
        updatedCount: result.updatedCount,
        failedCount: result.failedCount,
        timestamp: new Date()
      });
      
      if (result.success) {
        toast.success("Bulk update complete", {
          description: `Updated ${result.updatedCount} items`
        });
      } else {
        toast.error("Bulk update failed", {
          description: result.message
        });
      }
    } catch (error) {
      console.error("Bulk update error:", error);
      toast.error("Bulk update error", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');
  
  if (!isPlusStore && isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Shopify Bulk Operations
          </CardTitle>
          <CardDescription>
            Process large-scale updates with Shopify's Bulk Operations API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Plus Required</AlertTitle>
            <AlertDescription>
              Bulk Operations are only available for Shopify Plus stores. Please upgrade your Shopify plan to access this feature.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Shopify Bulk Operations
        </CardTitle>
        <CardDescription>
          Process large-scale updates with Shopify's Bulk Operations API
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ml-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <CardContent className="space-y-4">
            {!isShopifyConnected ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Not Connected</AlertTitle>
                <AlertDescription>
                  Connect to Shopify to use bulk operations.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-1">Price Increases</p>
                    <p className="text-2xl font-bold">{increasedItems.length}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-1">Price Decreases</p>
                    <p className="text-2xl font-bold">{decreasedItems.length}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-1">No Change</p>
                    <p className="text-2xl font-bold">{unchangedItems.length}</p>
                  </div>
                </div>
                
                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Processing bulk update...</span>
                      <span className="text-sm">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
                
                {lastOperation && (
                  <div className={`border rounded-md p-4 ${lastOperation.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-start gap-2">
                      {lastOperation.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {lastOperation.success ? 'Bulk update completed' : 'Bulk update failed'}
                        </p>
                        <p className="text-sm">
                          {lastOperation.updatedCount} items updated, {lastOperation.failedCount} failed
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lastOperation.timestamp.toLocaleString()}
                        </p>
                        {lastOperation.operationId && (
                          <p className="text-xs mt-1">
                            Operation ID: <code className="bg-muted px-1 py-0.5 rounded">{lastOperation.operationId}</code>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleBulkUpdate(true)} 
              disabled={!isShopifyConnected || isRunning || items.length === 0}
            >
              Test Run
            </Button>
            <Button 
              onClick={() => handleBulkUpdate(false)} 
              disabled={!isShopifyConnected || isRunning || items.length === 0}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Run Bulk Update'
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="history">
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200">
                  {lastOperation ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{lastOperation.timestamp.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Price Update</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={lastOperation.success ? "success" : "destructive"}>
                          {lastOperation.success ? "Completed" : "Failed"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{lastOperation.updatedCount + lastOperation.failedCount}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
                        No operations recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
