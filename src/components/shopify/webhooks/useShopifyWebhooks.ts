
import { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/shopify';
import { toast } from 'sonner';
import { WebhookTopic, WebhookSubscription, createWebhook, listWebhooks, deleteWebhook } from '@/lib/shopify/webhooks';

export const useShopifyWebhooks = () => {
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

  return {
    webhooks,
    isLoading,
    isCreating,
    newWebhookTopic,
    setNewWebhookTopic,
    newWebhookAddress,
    setNewWebhookAddress,
    loadWebhooks,
    handleCreateWebhook,
    handleDeleteWebhook
  };
};
