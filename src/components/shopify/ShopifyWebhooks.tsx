
import React, { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { ArrowLeftRight, Bell, PlusCircle, Trash2 } from 'lucide-react';
import { WebhookTopic, WebhookSubscription, createWebhook, listWebhooks, deleteWebhook } from '@/lib/shopify/webhooks';

export function ShopifyWebhooks() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newWebhookTopic, setNewWebhookTopic] = useState<WebhookTopic>('products/update');
  const [newWebhookAddress, setNewWebhookAddress] = useState('https://');
  const [isCreating, setIsCreating] = useState(false);

  const loadWebhooks = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      return;
    }
    
    setIsLoading(true);
    try {
      const webhooksList = await listWebhooks(shopifyContext);
      setWebhooks(webhooksList);
    } catch (error) {
      console.error('Error loading webhooks:', error);
      toast.error('Failed to load webhooks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isShopifyConnected && shopifyContext) {
      loadWebhooks();
    }
  }, [isShopifyConnected, shopifyContext]);

  const handleCreateWebhook = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error('Not connected to Shopify');
      return;
    }
    
    if (!newWebhookAddress || !newWebhookTopic) {
      toast.error('Please provide both webhook topic and address');
      return;
    }
    
    setIsCreating(true);
    try {
      const webhook = await createWebhook(
        shopifyContext,
        newWebhookTopic,
        newWebhookAddress
      );
      
      setWebhooks(prev => [...prev, webhook]);
      
      toast.success('Webhook created successfully');
      
      // Reset form
      setNewWebhookAddress('https://');
      
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error('Not connected to Shopify');
      return;
    }
    
    try {
      await deleteWebhook(shopifyContext, id);
      
      setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
      
      toast.success('Webhook deleted successfully');
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  const webhookTopics: WebhookTopic[] = [
    'products/create',
    'products/update',
    'products/delete',
    'inventory_levels/update',
    'inventory_items/update',
    'collections/update'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Shopify Webhooks
        </CardTitle>
        <CardDescription>
          Manage real-time notifications from your Shopify store
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isShopifyConnected ? (
          <div className="flex items-center justify-center p-6 border rounded-md bg-gray-50">
            <p className="text-muted-foreground text-center">
              Connect to Shopify to manage webhooks
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="webhook-topic" className="text-sm font-medium block mb-2">
                  Webhook Topic
                </label>
                <Select value={newWebhookTopic} onValueChange={(value) => setNewWebhookTopic(value as WebhookTopic)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {webhookTopics.map(topic => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="webhook-address" className="text-sm font-medium block mb-2">
                  Callback URL
                </label>
                <Input
                  id="webhook-address"
                  type="url"
                  value={newWebhookAddress}
                  onChange={(e) => setNewWebhookAddress(e.target.value)}
                  placeholder="https://your-endpoint.com/webhook"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={handleCreateWebhook}
                  disabled={isCreating || !newWebhookAddress || !newWebhookTopic}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Webhook
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Callback URL</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                        </div>
                      </td>
                    </tr>
                  ) : webhooks.length > 0 ? (
                    webhooks.map(webhook => (
                      <tr key={webhook.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {webhook.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {webhook.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {webhook.format.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWebhook(webhook.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No webhooks configured
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <Bell className="h-4 w-4 inline-block mr-1" />
          Webhooks allow Shopify to notify your app in real-time about events
        </div>
        <Button
          variant="outline"
          onClick={loadWebhooks}
          disabled={!isShopifyConnected || isLoading}
        >
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
