
import React, { useState } from 'react';
import { useShopify } from '@/contexts/shopify';
import { enhancedShopifyService } from '@/services/enhanced-shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Bell, Plus, Trash, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const WEBHOOK_TOPICS = [
  { value: 'products/create', label: 'Product Created' },
  { value: 'products/update', label: 'Product Updated' },
  { value: 'products/delete', label: 'Product Deleted' },
  { value: 'inventory_levels/update', label: 'Inventory Updated' },
  { value: 'orders/create', label: 'Order Created' },
  { value: 'orders/paid', label: 'Order Paid' },
  { value: 'shop/update', label: 'Shop Updated' },
  { value: 'themes/publish', label: 'Theme Published' },
  { value: 'collections/create', label: 'Collection Created' },
  { value: 'collections/update', label: 'Collection Updated' },
  { value: 'price_rules/create', label: 'Price Rule Created' },
  { value: 'checkouts/create', label: 'Checkout Started' },
  { value: 'checkouts/update', label: 'Checkout Updated' },
  { value: 'customers/create', label: 'Customer Created' },
  { value: 'customers/update', label: 'Customer Updated' },
];

type Webhook = {
  id: string;
  topic: string;
  callbackUrl: string;
  createdAt: string;
  status: 'active' | 'error';
  lastTriggered?: string;
};

export function ShopifyWebhookManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhookTopic, setNewWebhookTopic] = useState(WEBHOOK_TOPICS[0].value);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const handleRegisterWebhook = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error("Not connected to Shopify");
      return;
    }
    
    if (!newWebhookTopic || !newWebhookUrl) {
      toast.error("Please select a topic and enter a callback URL");
      return;
    }
    
    // Simple URL validation
    try {
      new URL(newWebhookUrl);
    } catch {
      toast.error("Invalid URL format", {
        description: "Please enter a valid URL including the protocol (https://)"
      });
      return;
    }
    
    setIsRegistering(true);
    try {
      const result = await enhancedShopifyService.registerWebhook(
        newWebhookTopic,
        newWebhookUrl
      );
      
      if (result.success && result.webhookId) {
        // Add new webhook to state
        const topicLabel = WEBHOOK_TOPICS.find(t => t.value === newWebhookTopic)?.label || newWebhookTopic;
        
        setWebhooks([
          ...webhooks,
          {
            id: result.webhookId,
            topic: newWebhookTopic,
            callbackUrl: newWebhookUrl,
            createdAt: new Date().toISOString(),
            status: 'active'
          }
        ]);
        
        setNewWebhookUrl('');
        
        toast.success("Webhook registered", {
          description: `Successfully registered webhook for ${topicLabel}`
        });
      } else {
        toast.error("Failed to register webhook", {
          description: result.message || "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error registering webhook:", error);
      toast.error("Error registering webhook", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleDeleteWebhook = (id: string) => {
    // In a real app, this would call the Shopify API to remove the webhook
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    toast.success("Webhook deleted");
  };
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Shopify Webhooks
          </CardTitle>
          <CardDescription>
            Receive real-time notifications for Shopify events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning" className="mb-0">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Connect to Shopify to manage webhooks
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const getTopicLabel = (topic: string) => {
    return WEBHOOK_TOPICS.find(t => t.value === topic)?.label || topic;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Shopify Webhooks
        </CardTitle>
        <CardDescription>
          Receive real-time notifications for Shopify events
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label htmlFor="webhookTopic" className="text-sm font-medium">
              Event Type
            </label>
            <Select 
              value={newWebhookTopic} 
              onValueChange={setNewWebhookTopic}
            >
              <SelectTrigger id="webhookTopic">
                <SelectValue placeholder="Select an event type" />
              </SelectTrigger>
              <SelectContent>
                {WEBHOOK_TOPICS.map(topic => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="webhookUrl" className="text-sm font-medium">
              Callback URL
            </label>
            <Input
              id="webhookUrl"
              placeholder="https://your-app.com/api/shopify-webhooks"
              value={newWebhookUrl}
              onChange={e => setNewWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This URL will receive POST requests when the event occurs
            </p>
          </div>
          
          <Button
            onClick={handleRegisterWebhook}
            disabled={isRegistering || !newWebhookUrl}
            className="w-full sm:w-auto sm:self-end"
          >
            <Plus className="mr-2 h-4 w-4" />
            Register Webhook
          </Button>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium mb-4">Registered Webhooks</h3>
          
          {webhooks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground border rounded-md">
              <p>No webhooks registered yet</p>
              <p className="text-xs mt-1">Register webhooks above to receive Shopify events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map(webhook => (
                <div key={webhook.id} className="border rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{getTopicLabel(webhook.topic)}</h4>
                      <Badge variant={webhook.status === 'active' ? 'success' : 'destructive'}>
                        {webhook.status === 'active' ? 'Active' : 'Error'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 break-all">
                      {webhook.callbackUrl}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(webhook.createdAt).toLocaleString()}
                      {webhook.lastTriggered ? ` • Last triggered: ${new Date(webhook.lastTriggered).toLocaleString()}` : ''}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="self-end sm:self-auto"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <div className="text-xs text-muted-foreground">
          <p>Webhooks deliver real-time updates from your Shopify store</p>
        </div>
      </CardFooter>
    </Card>
  );
}
