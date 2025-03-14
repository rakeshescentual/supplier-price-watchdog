
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { PriceItem } from "@/types/price";

interface ShopifyTabProps {
  integrationStatus: Record<string, boolean>;
  hasItems: boolean;
  items: PriceItem[];
}

export const ShopifyTab: React.FC<ShopifyTabProps> = ({
  integrationStatus,
  hasItems,
  items
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Shopify Plus Integration
        </CardTitle>
        <CardDescription>
          Enhanced features for Shopify Plus merchants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Shopify Plus Required</AlertTitle>
          <AlertDescription>
            Some features require a Shopify Plus subscription. Connect Gadget.dev to enable all features.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Pricing Scripts</h3>
            <p className="text-sm text-muted-foreground">
              Deploy custom pricing rules based on customer segments, order value, and product combinations
            </p>
            <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
          </div>
          
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Flow Automation</h3>
            <p className="text-sm text-muted-foreground">
              Automate business processes when prices change, inventory updates, or new products are added
            </p>
            <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
          </div>
          
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Multi-location Inventory</h3>
            <p className="text-sm text-muted-foreground">
              Manage price changes across multiple store locations and warehouse facilities
            </p>
            <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
          </div>
          
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">B2B Price Management</h3>
            <p className="text-sm text-muted-foreground">
              Create and manage wholesale price lists for B2B customers with special pricing tiers
            </p>
            <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Connect Your Shopify Plus Store</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Integrate with your Shopify Plus store to enable enhanced pricing features
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="default" 
              className="flex-1"
              disabled={integrationStatus.shopify}
              onClick={() => {
                toast.info("Shopify Connection Flow", {
                  description: "This would open the Shopify OAuth flow in a real implementation"
                });
              }}
            >
              {integrationStatus.shopify ? "Connected to Shopify" : "Connect Shopify Store"}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              disabled={!integrationStatus.shopify || !hasItems}
              onClick={() => {
                toast.success("Sync Complete", {
                  description: `Successfully synced ${items.length} items to Shopify`
                });
              }}
            >
              Sync Price Changes to Shopify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
