
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Webhook, Database, RefreshCw, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { gadgetAnalytics } from "@/lib/gadget/analytics";

interface WebhookTopic {
  id: string;
  name: string;
  description: string;
  isRegistered: boolean;
  lastTriggered?: string;
  status: "active" | "inactive" | "error";
}

export function ShopifyWebhookManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [webhooks, setWebhooks] = useState<WebhookTopic[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Mock webhook topics that we'll use for demonstration
  const allWebhookTopics: WebhookTopic[] = [
    {
      id: "products/create",
      name: "Product Creation",
      description: "Triggered when a new product is created",
      isRegistered: true,
      lastTriggered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      id: "products/update",
      name: "Product Update",
      description: "Triggered when a product is updated",
      isRegistered: true,
      lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      id: "products/delete",
      name: "Product Deletion",
      description: "Triggered when a product is deleted",
      isRegistered: false,
      status: "inactive"
    },
    {
      id: "inventory_levels/update",
      name: "Inventory Update",
      description: "Triggered when inventory levels change",
      isRegistered: true,
      lastTriggered: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      id: "orders/create",
      name: "Order Creation",
      description: "Triggered when a new order is placed",
      isRegistered: true,
      lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: "error"
    },
    {
      id: "app/uninstalled",
      name: "App Uninstalled",
      description: "Triggered when the app is uninstalled",
      isRegistered: true,
      status: "active"
    },
    {
      id: "shop/update",
      name: "Shop Update",
      description: "Triggered when shop details are updated",
      isRegistered: false,
      status: "inactive"
    },
    {
      id: "themes/publish",
      name: "Theme Published",
      description: "Triggered when a theme is published",
      isRegistered: false,
      status: "inactive"
    }
  ];
  
  useEffect(() => {
    // Simulate loading webhooks
    setIsLoading(true);
    setTimeout(() => {
      setWebhooks(allWebhookTopics);
      setIsLoading(false);
    }, 1000);
    
    // Track view
    gadgetAnalytics.trackFeatureUsage('shopify.webhooks', 'viewed');
  }, []);
  
  const refreshWebhooks = () => {
    setIsLoading(true);
    
    // Track action
    gadgetAnalytics.trackFeatureUsage('shopify.webhooks', 'used', {
      action: 'refresh'
    });
    
    // Simulate refreshing webhooks
    setTimeout(() => {
      // Update lastTriggered for a random webhook
      const updatedWebhooks = [...allWebhookTopics];
      const randomIndex = Math.floor(Math.random() * updatedWebhooks.length);
      if (updatedWebhooks[randomIndex].isRegistered) {
        updatedWebhooks[randomIndex] = {
          ...updatedWebhooks[randomIndex],
          lastTriggered: new Date().toISOString()
        };
      }
      
      setWebhooks(updatedWebhooks);
      setIsLoading(false);
      
      toast.success("Webhooks refreshed", {
        description: "The latest webhook status has been loaded"
      });
    }, 1000);
  };
  
  const registerAllWebhooks = () => {
    setIsRegistering(true);
    
    // Track action
    gadgetAnalytics.trackFeatureUsage('shopify.webhooks', 'used', {
      action: 'register_all'
    });
    
    // Simulate registering all webhooks
    setTimeout(() => {
      const updatedWebhooks = allWebhookTopics.map(webhook => ({
        ...webhook,
        isRegistered: true,
        status: "active" as const
      }));
      
      setWebhooks(updatedWebhooks);
      setIsRegistering(false);
      
      toast.success("All webhooks registered", {
        description: "Successfully registered all webhooks with Shopify"
      });
    }, 2000);
  };
  
  const toggleWebhook = (id: string) => {
    // Find the webhook
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return;
    
    const action = webhook.isRegistered ? 'unregister' : 'register';
    
    // Track action
    gadgetAnalytics.trackFeatureUsage('shopify.webhooks', 'used', {
      action,
      webhookId: id
    });
    
    // Update the webhooks state
    setWebhooks(prevWebhooks => prevWebhooks.map(w => {
      if (w.id === id) {
        return {
          ...w,
          isRegistered: !w.isRegistered,
          status: !w.isRegistered ? "active" : "inactive"
        };
      }
      return w;
    }));
    
    // Show success message
    toast.success(
      webhook.isRegistered ? "Webhook unregistered" : "Webhook registered", 
      {
        description: `Successfully ${webhook.isRegistered ? 'unregistered' : 'registered'} ${webhook.name} webhook`
      }
    );
  };
  
  const getStatusBadge = (status: WebhookTopic["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Shopify Webhooks
        </CardTitle>
        <CardDescription>
          Manage webhooks for real-time Shopify event notifications
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {webhooks.filter(w => w.isRegistered).length} of {webhooks.length} webhooks registered
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshWebhooks}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button 
              size="sm" 
              onClick={registerAllWebhooks}
              disabled={isRegistering || webhooks.every(w => w.isRegistered)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Register All
            </Button>
          </div>
        </div>
        
        {webhooks.some(w => w.status === "error") && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              One or more webhooks are reporting errors. Please check your webhook endpoints.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Topic</TableHead>
                <TableHead className="w-1/3">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : webhooks.length > 0 ? (
                webhooks.map(webhook => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.name}</TableCell>
                    <TableCell>{webhook.description}</TableCell>
                    <TableCell>{getStatusBadge(webhook.status)}</TableCell>
                    <TableCell>{formatDate(webhook.lastTriggered)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={webhook.isRegistered ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleWebhook(webhook.id)}
                      >
                        {webhook.isRegistered ? (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Unregister
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Register
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No webhooks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Webhooks enable real-time event processing from your Shopify store
      </CardFooter>
    </Card>
  );
}
