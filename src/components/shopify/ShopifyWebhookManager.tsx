
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, RefreshCw, Check, AlertTriangle, Info } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { ShopifyWebhooks } from './ShopifyWebhooks';
import { useShopify } from '@/contexts/shopify';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { getEssentialWebhooks } from './webhooks/webhookUtils';

export function ShopifyWebhookManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [checkingWebhooks, setCheckingWebhooks] = useState(false);
  const [essentialWebhooks, setEssentialWebhooks] = useState<string[]>([]);
  const [configuredWebhooks, setConfiguredWebhooks] = useState<string[]>([]);
  const [checkProgress, setCheckProgress] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  // Get list of essential webhooks
  useEffect(() => {
    if (isShopifyConnected) {
      const essentialWebhookDefs = getEssentialWebhooks(shopifyContext?.shopPlan);
      setEssentialWebhooks(essentialWebhookDefs.map(webhook => webhook.topic));
    }
  }, [isShopifyConnected, shopifyContext]);
  
  const checkEssentialWebhooks = async () => {
    if (!isShopifyConnected || !shopifyContext) return;
    
    setCheckingWebhooks(true);
    setCheckProgress(10);
    
    try {
      // In a real implementation, this would fetch configured webhooks from Shopify
      setCheckProgress(30);
      await new Promise(resolve => setTimeout(resolve, 600));
      setCheckProgress(60);
      
      // Mock result for demonstration
      const mockConfiguredWebhooks = ['products/update', 'inventory_levels/update'];
      if (Math.random() > 0.5) {
        mockConfiguredWebhooks.push('app/uninstalled');
      }
      
      setConfiguredWebhooks(mockConfiguredWebhooks);
      setCheckProgress(100);
      setLastChecked(new Date());
      
      const missingWebhooks = essentialWebhooks.filter(
        webhook => !mockConfiguredWebhooks.includes(webhook)
      );
      
      if (missingWebhooks.length === 0) {
        toast.success('All essential webhooks are configured', {
          description: 'Your integration meets Shopify webhook requirements'
        });
      } else {
        toast.warning('Missing essential webhooks', {
          description: `Missing webhooks: ${missingWebhooks.join(', ')}`
        });
      }
    } catch (error) {
      console.error('Error checking webhooks:', error);
      toast.error('Error checking webhooks', {
        description: 'Could not verify webhook configuration'
      });
    } finally {
      setTimeout(() => {
        setCheckingWebhooks(false);
        setCheckProgress(0);
      }, 500);
    }
  };
  
  // Calculate compliance percentage
  const getCompliancePercentage = () => {
    if (essentialWebhooks.length === 0) return 0;
    const configuredCount = essentialWebhooks.filter(webhook => 
      configuredWebhooks.includes(webhook)
    ).length;
    return Math.round((configuredCount / essentialWebhooks.length) * 100);
  };
  
  const compliancePercentage = getCompliancePercentage();
  
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
        {checkingWebhooks && (
          <Progress value={checkProgress} className="h-1 mb-6" />
        )}
        
        {!isShopifyConnected ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Connect to Shopify to manage webhooks
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>Essential Webhooks</span>
                {lastChecked && (
                  <span className="text-xs text-muted-foreground">
                    Last checked: {lastChecked.toLocaleTimeString()}
                  </span>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between mb-1 items-center">
                  <span className="text-xs">
                    Compliance: {compliancePercentage}%
                  </span>
                  <span className="text-xs">
                    {configuredWebhooks.length}/{essentialWebhooks.length} configured
                  </span>
                </div>
                <Progress 
                  value={compliancePercentage} 
                  className="h-2"
                  {...(compliancePercentage < 100 ? { 
                    "aria-label": "Warning", 
                    className: "h-2 bg-amber-100" 
                  } : {})}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {essentialWebhooks.map(webhook => (
                  <Badge 
                    key={webhook}
                    variant={configuredWebhooks.includes(webhook) ? "success" : "secondary"} 
                    className="flex items-center gap-1"
                  >
                    {configuredWebhooks.includes(webhook) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {webhook}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <ShopifyWebhooks />
          </>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Webhooks must be properly implemented for Shopify App Store approval
      </CardFooter>
    </Card>
  );
}
