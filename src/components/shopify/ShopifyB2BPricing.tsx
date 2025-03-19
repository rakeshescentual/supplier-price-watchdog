
import React, { useState } from 'react';
import { useShopify } from '@/contexts/shopify';
import { useFileAnalysis } from '@/contexts/FileAnalysisContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Building2, AlertTriangle, Users, Percent, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { syncB2BPrices } from '@/lib/gadget/shopify-integration/b2b';

type CustomerSegment = {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  selected: boolean;
};

export function ShopifyB2BPricing() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const { items } = useFileAnalysis();
  const [activeTab, setActiveTab] = useState('segments');
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState(10);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([
    {
      id: 'wholesale',
      name: 'Wholesale',
      description: 'B2B customers with wholesale agreements',
      customerCount: 48,
      selected: true
    },
    {
      id: 'distributor',
      name: 'Distributors',
      description: 'Regional distribution partners',
      customerCount: 12,
      selected: false
    },
    {
      id: 'salon',
      name: 'Salon Partners',
      description: 'Professional salon and spa partners',
      customerCount: 87,
      selected: false
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy Partners',
      description: 'Pharmaceutical retail partners',
      customerCount: 34,
      selected: true
    }
  ]);
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');
  
  const toggleSegmentSelection = (id: string) => {
    setCustomerSegments(segments => 
      segments.map(segment => 
        segment.id === id ? { ...segment, selected: !segment.selected } : segment
      )
    );
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const selectedSegments = customerSegments.filter(s => s.selected);
      
      const blob = new Blob([JSON.stringify({
        segments: selectedSegments.map(s => s.id),
        items: items.map(item => ({
          sku: item.sku,
          name: item.name,
          regularPrice: item.newPrice,
          b2bPrice: +(item.newPrice * (1 - globalDiscountPercent / 100)).toFixed(2)
        }))
      }, null, 2)], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'escentual-b2b-prices.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
      toast.success("B2B price list exported");
    }, 1500);
  };
  
  const handleSync = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error("Not connected to Shopify");
      return;
    }
    
    const selectedSegments = customerSegments
      .filter(segment => segment.selected)
      .map(segment => segment.id);
    
    if (selectedSegments.length === 0) {
      toast.error("No customer segments selected", {
        description: "Please select at least one customer segment"
      });
      return;
    }
    
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      // Apply B2B pricing to items
      const b2bItems = items.map(item => ({
        ...item,
        b2bPrice: +(item.newPrice * (1 - globalDiscountPercent / 100)).toFixed(2)
      }));
      
      // Progress simulation
      const updateProgress = (progress: number) => {
        setSyncProgress(progress);
      };
      
      // Start at 10%
      updateProgress(10);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          const next = prev + Math.random() * 10;
          return next > 90 ? 90 : next;
        });
      }, 500);
      
      // Call the B2B sync function
      const result = await syncB2BPrices(
        shopifyContext,
        b2bItems,
        selectedSegments
      );
      
      clearInterval(progressInterval);
      setSyncProgress(100);
      
      if (result.success) {
        toast.success("B2B prices synced", {
          description: `Price changes applied to ${selectedSegments.length} customer segments`
        });
      } else {
        toast.error("B2B sync failed", {
          description: result.message || "Unknown error"
        });
      }
    } catch (error) {
      console.error("B2B sync error:", error);
      toast.error("B2B sync error", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      setSyncProgress(0);
    } finally {
      setIsSyncing(false);
    }
  };
  
  if (!isPlusStore && isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            B2B Price Management
          </CardTitle>
          <CardDescription>
            Manage wholesale and special customer pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Plus Required</AlertTitle>
            <AlertDescription>
              B2B price management is a Shopify Plus feature. Upgrade your store to access B2B functionality.
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
          <Building2 className="h-5 w-5" />
          B2B Price Management
        </CardTitle>
        <CardDescription>
          Manage wholesale and special customer pricing
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ml-6">
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="segments">
          <CardContent className="space-y-6">
            {!isShopifyConnected ? (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Connect to Shopify to manage B2B customer segments
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">B2B Customer Segments</h3>
                    <Badge variant="outline" className="font-normal">
                      {customerSegments.length} segments
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {customerSegments.map(segment => (
                      <div key={segment.id} className="flex items-start space-x-3 border p-4 rounded-md">
                        <Checkbox 
                          id={`segment-${segment.id}`} 
                          checked={segment.selected}
                          onCheckedChange={() => toggleSegmentSelection(segment.id)}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <label 
                              htmlFor={`segment-${segment.id}`}
                              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {segment.name}
                            </label>
                            <Badge variant="secondary" className="font-normal">
                              <Users className="h-3 w-3 mr-1" /> {segment.customerCount}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {segment.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="pricing">
          <CardContent className="space-y-6">
            {!isShopifyConnected ? (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Connect to Shopify to manage B2B pricing rules
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="global-discount" className="text-sm font-medium">
                      Global B2B Discount
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="global-discount"
                        type="number"
                        min={0}
                        max={100}
                        value={globalDiscountPercent}
                        onChange={e => setGlobalDiscountPercent(Number(e.target.value))}
                        className="w-24"
                      />
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">off retail price</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This discount will be applied to all products for selected B2B customer segments
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-muted/30 border rounded-md p-4">
                    <h4 className="text-sm font-medium mb-2">Preview</h4>
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">Example product:</span> {items.length > 0 ? items[0].name : 'No product data'}
                      </div>
                      
                      {items.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Regular Price</p>
                            <p className="font-medium">£{items[0].newPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">B2B Price</p>
                            <p className="font-medium text-green-600">
                              £{(items[0].newPrice * (1 - globalDiscountPercent / 100)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Selected B2B customers will see the discounted prices when logged in
                      </p>
                    </div>
                  </div>
                  
                  {isSyncing && (
                    <div className="space-y-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Syncing B2B prices...</span>
                        <span className="text-sm">{Math.round(syncProgress)}%</span>
                      </div>
                      <Progress value={syncProgress} />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          onClick={handleExport} 
          disabled={isExporting || !isShopifyConnected || items.length === 0}
        >
          {isExporting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export B2B Prices
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleSync} 
          disabled={isSyncing || !isShopifyConnected || items.length === 0}
        >
          {isSyncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            'Sync B2B Prices'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
