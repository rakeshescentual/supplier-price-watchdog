
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, RefreshCw, Check } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { ShopifyWebhooks } from './ShopifyWebhooks';
import { useShopify } from '@/contexts/shopify';
import { toast } from 'sonner';

export function ShopifyWebhookManager() {
  const { isShopifyConnected } = useShopify();
  const [checkingWebhooks, setCheckingWebhooks] = React.useState(false);
  
  const checkEssentialWebhooks = async () => {
    setCheckingWebhooks(true);
    
    try {
      // In a real implementation, this would check for essential webhooks
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock result for demonstration
      const allEssentialWebhooksConfigured = Math.random() > 0.5;
      
      if (allEssentialWebhooksConfigured) {
        toast.success('All essential webhooks are configured', {
          description: 'Your integration meets Shopify webhook requirements'
        });
      } else {
        toast.warning('Missing essential webhooks', {
          description: 'Some recommended webhooks are not configured. See details below.'
        });
      }
    } catch (error) {
      toast.error('Error checking webhooks', {
        description: 'Could not verify webhook configuration'
      });
    } finally {
      setCheckingWebhooks(false);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Webhook Manager
            </CardTitle>
            <CardDescription>
              Manage and monitor Shopify webhook notifications
            </CardDescription>
          </div>
          {isShopifyConnected && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={checkEssentialWebhooks}
              disabled={checkingWebhooks}
            >
              {checkingWebhooks ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Validate Required Webhooks
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Essential Webhooks</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              products/update
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              inventory_levels/update
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              app/uninstalled
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              shop/update
            </Badge>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <ShopifyWebhooks />
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Webhooks must be properly implemented for Shopify App Store approval
      </CardFooter>
    </Card>
  );
}
