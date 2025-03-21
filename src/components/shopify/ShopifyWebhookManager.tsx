
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bell, Plus, RefreshCw, HelpCircle } from "lucide-react";
import { enhancedShopifyClient } from "@/services/enhanced-shopify";
import { useShopify } from "@/contexts/shopify";
import { gadgetAnalytics } from "@/lib/gadget/analytics";

// Create a webhook tracking object
const webhookTracker = gadgetAnalytics.createFeatureTracker('webhooks');

interface Webhook {
  id: string;
  topic: string;
  address: string;
  active: boolean;
  format: string;
  createdAt: string;
}

export function ShopifyWebhookManager() {
  const { isShopifyConnected } = useShopify();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Essential webhooks configuration
  const essentialWebhooks = [
    {
      topic: "products/update",
      description: "Track product updates",
      recommended: true
    },
    {
      topic: "products/delete",
      description: "Handle product deletions",
      recommended: true
    },
    {
      topic: "orders/create",
      description: "Track new orders",
      recommended: false
    },
    {
      topic: "inventory_levels/update",
      description: "Track inventory changes",
      recommended: true
    },
    {
      topic: "app/uninstalled",
      description: "Handle app uninstallation",
      recommended: true
    }
  ];
  
  // Load webhooks
  const loadWebhooks = async () => {
    if (!isShopifyConnected) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch real webhooks
      // For demo purposes, we'll create mock data
      webhookTracker.trackView();
      
      setTimeout(() => {
        const mockWebhooks: Webhook[] = [
          {
            id: "webhook1",
            topic: "products/update",
            address: "https://app.escentual.com/api/webhooks/products-update",
            active: true,
            format: "json",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "webhook2",
            topic: "inventory_levels/update",
            address: "https://app.escentual.com/api/webhooks/inventory-update",
            active: true,
            format: "json",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setWebhooks(mockWebhooks);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading webhooks:", error);
      toast.error("Failed to load webhooks", {
        description: "Could not retrieve webhooks from Shopify"
      });
      setIsLoading(false);
    }
  };
  
  // Create webhook
  const createWebhook = async (topic: string) => {
    if (!isShopifyConnected) return;
    
    setIsCreating(true);
    
    try {
      const webhookAddress = `https://app.escentual.com/api/webhooks/${topic.replace(/\//g, '-')}`;
      
      const result = await enhancedShopifyClient.registerWebhook(
        topic,
        webhookAddress,
        'json'
      );
      
      if (result.success) {
        webhookTracker.trackCreate({
          topic,
          address: webhookAddress
        });
        
        toast.success("Webhook created", {
          description: `Created webhook for ${topic}`
        });
        
        // Add the new webhook to the list
        setWebhooks(prev => [
          ...prev,
          {
            id: result.webhookId,
            topic,
            address: webhookAddress,
            active: true,
            format: 'json',
            createdAt: new Date().toISOString()
          }
        ]);
      } else {
        toast.error("Failed to create webhook", {
          description: result.message || "An error occurred"
        });
      }
    } catch (error) {
      console.error("Error creating webhook:", error);
      toast.error("Webhook creation failed", {
        description: "Could not create webhook"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Toggle webhook active status
  const toggleWebhookStatus = (webhookId: string, active: boolean) => {
    // In a real implementation, this would update the webhook in Shopify
    setWebhooks(prev => 
      prev.map(webhook => 
        webhook.id === webhookId 
          ? { ...webhook, active } 
          : webhook
      )
    );
    
    webhookTracker.trackUpdate({
      webhookId,
      active
    });
    
    toast.success(`Webhook ${active ? 'activated' : 'deactivated'}`, {
      description: `Webhook has been ${active ? 'activated' : 'deactivated'}`
    });
  };
  
  // Check for missing essential webhooks
  const getMissingEssentialWebhooks = () => {
    return essentialWebhooks
      .filter(essential => essential.recommended)
      .filter(essential => 
        !webhooks.some(webhook => webhook.topic === essential.topic && webhook.active)
      );
  };
  
  // Load webhooks on component mount
  useEffect(() => {
    loadWebhooks();
  }, [isShopifyConnected]);
  
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
              
              <ScrollArea className="h-[140px] rounded-md border">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Loading webhooks...
                  </div>
                ) : webhooks.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No webhooks configured
                  </div>
                ) : (
                  <div className="p-2">
                    {webhooks.map(webhook => (
                      <div 
                        key={webhook.id} 
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md"
                      >
                        <div>
                          <div className="text-sm font-medium">{webhook.topic}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {webhook.address}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={webhook.active}
                            onCheckedChange={(checked) => toggleWebhookStatus(webhook.id, checked)}
                          />
                          <Badge variant={webhook.active ? "success" : "outline"} className="ml-2">
                            {webhook.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Essential Webhooks</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {essentialWebhooks.map(webhook => {
                  const isConfigured = webhooks.some(w => 
                    w.topic === webhook.topic && w.active
                  );
                  
                  return (
                    <div 
                      key={webhook.topic} 
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <Label htmlFor={webhook.topic} className="text-sm">
                          {webhook.topic}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {webhook.description}
                        </p>
                      </div>
                      
                      {isConfigured ? (
                        <Badge variant="success">Configured</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => createWebhook(webhook.topic)}
                          disabled={isCreating}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {getMissingEssentialWebhooks().length > 0 && (
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                <div className="font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                  Missing essential webhooks
                </div>
                <p className="text-xs mt-1 text-amber-700">
                  We recommend adding all essential webhooks for proper functionality
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
