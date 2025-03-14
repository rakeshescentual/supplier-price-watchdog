
import React from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Cog, Mail, Share2, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { PriceItem } from "@/types/price";

interface IntegrationsSummaryProps {
  hasItems: boolean;
  items: PriceItem[];
  summary: any;
  file?: File | null;
  integrationStatus: Record<string, boolean>;
  onConfigureIntegrations: () => void;
}

export const IntegrationsSummary: React.FC<IntegrationsSummaryProps> = ({
  hasItems,
  items,
  summary,
  file,
  integrationStatus,
  onConfigureIntegrations
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
      {hasItems && (
        <Card className="md:col-span-8">
          <CardHeader className="pb-3">
            <CardTitle>
              {file?.name || "Price Analysis"}
            </CardTitle>
            <CardDescription>
              {items.length} products analyzed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalysisSummary {...summary} />
            
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-sm text-muted-foreground">Price Increases</p>
                <p className="text-2xl font-medium text-red-600">{summary.increasedItems}</p>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-sm text-muted-foreground">Price Decreases</p>
                <p className="text-2xl font-medium text-green-600">{summary.decreasedItems}</p>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-sm text-muted-foreground">Discontinued</p>
                <p className="text-2xl font-medium text-orange-600">{summary.discontinuedItems}</p>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-sm text-muted-foreground">New Products</p>
                <p className="text-2xl font-medium text-blue-600">{summary.newItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className={hasItems ? "md:col-span-4" : "md:col-span-12"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Integration Status
          </CardTitle>
          <CardDescription>
            Connected service status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Shopify Plus</span>
              </div>
              <Badge variant={integrationStatus.shopify ? "success" : "outline"}>
                {integrationStatus.shopify ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                <span>Gadget.dev</span>
              </div>
              <Badge variant={integrationStatus.gadget ? "success" : "outline"}>
                {integrationStatus.gadget ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Klaviyo</span>
              </div>
              <Badge variant={integrationStatus.klaviyo ? "success" : "outline"}>
                {integrationStatus.klaviyo ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Google Analytics</span>
              </div>
              <Badge variant={integrationStatus.googleAnalytics ? "success" : "outline"}>
                {integrationStatus.googleAnalytics ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={onConfigureIntegrations}
          >
            Configure Integrations
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
