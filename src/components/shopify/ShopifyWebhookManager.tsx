
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, RefreshCw } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { WebhookList } from "./webhooks/WebhookList";
import { EssentialWebhooks } from "./webhooks/EssentialWebhooks";
import { useWebhooks } from "./webhooks/useWebhooks";

export function ShopifyWebhookManager() {
  const { isShopifyConnected } = useShopify();
  const { 
    webhooks,
    isLoading,
    isCreating,
    essentialWebhooks,
    loadWebhooks,
    createWebhook,
    toggleWebhookStatus
  } = useWebhooks();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-500" />
            <div>
              <CardTitle className="text-base">Webhook Manager</CardTitle>
              <CardDescription>
                Configure Shopify webhooks for real-time updates
              </CardDescription>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadWebhooks} 
            disabled={isLoading || !isShopifyConnected}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isShopifyConnected ? (
          <div className="rounded-md bg-slate-50 p-4 text-center text-sm">
            Connect to Shopify to manage webhooks
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Active Webhooks</h3>
                <Badge variant="outline">
                  {webhooks.filter(w => w.active).length}/{webhooks.length}
                </Badge>
              </div>
              
              <WebhookList 
                webhooks={webhooks} 
                isLoading={isLoading}
                onToggleStatus={toggleWebhookStatus}
              />
            </div>
            
            <Separator />
            
            <EssentialWebhooks 
              essentialWebhooks={essentialWebhooks}
              existingWebhooks={webhooks}
              onCreateWebhook={createWebhook}
              isCreating={isCreating}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
