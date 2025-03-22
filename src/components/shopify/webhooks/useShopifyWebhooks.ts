
import { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/shopify';
import { toast } from 'sonner';
import { WebhookTopic, WebhookSubscription, createWebhook, listWebhooks, deleteWebhook, testWebhook } from '@/lib/shopify/webhooks';
import { gadgetAnalytics } from '@/lib/gadget/analytics';
import { ShopifyContext as AppShopifyContext } from '@/types/shopify';
import { ShopifyContext as WebhooksShopifyContext } from '@/lib/shopify/webhooks';

// Helper function to adapt the context type
const adaptContext = (context: AppShopifyContext): WebhooksShopifyContext => {
  return {
    shop: context.shop,
    accessToken: context.accessToken,
    shopPlan: context.shopPlan as "basic" | "shopify" | "advanced" | "plus" | undefined
  };
};

export const useShopifyWebhooks = () => {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [newWebhookTopic, setNewWebhookTopic] = useState<WebhookTopic>('products/update');
  const [newWebhookAddress, setNewWebhookAddress] = useState('https://');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const loadWebhooks = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      return;
    }
    
    setIsLoading(true);
    try {
      const adaptedContext = adaptContext(shopifyContext);
      const webhooksList = await listWebhooks(adaptedContext);
      setWebhooks(webhooksList);
      
      // Track analytics
      gadgetAnalytics.trackFeatureUsage('webhooks', 'viewed', {
        count: webhooksList.length
      });
    } catch (error) {
      console.error('Error loading webhooks:', error);
      toast.error('Failed to load webhooks');
      
      // Retry logic for transient errors
      if (retryCount < MAX_RETRIES) {
        const nextRetry = retryCount + 1;
        setRetryCount(nextRetry);
        
        toast.info(`Retrying... (${nextRetry}/${MAX_RETRIES})`);
        
        // Exponential backoff
        setTimeout(() => {
          loadWebhooks();
        }, 1000 * Math.pow(2, nextRetry));
      }
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
    
    // Validate webhook URL format
    try {
      new URL(newWebhookAddress);
    } catch (error) {
      toast.error('Invalid webhook URL format');
      return;
    }
    
    setIsCreating(true);
    try {
      const adaptedContext = adaptContext(shopifyContext);
      const webhook = await createWebhook(
        adaptedContext,
        newWebhookTopic,
        newWebhookAddress
      );
      
      setWebhooks(prev => [...prev, webhook]);
      
      toast.success('Webhook created successfully');
      
      // Analytics
      gadgetAnalytics.trackFeatureUsage('webhooks', 'used', {
        topic: newWebhookTopic,
        action: 'create'
      });
      
      // Reset form
      setNewWebhookAddress('https://');
      
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
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
      const adaptedContext = adaptContext(shopifyContext);
      await deleteWebhook(adaptedContext, id);
      
      setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
      
      toast.success('Webhook deleted successfully');
      
      // Analytics
      gadgetAnalytics.trackFeatureUsage('webhooks', 'used', {
        action: 'delete'
      });
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };
  
  const handleTestWebhook = async (webhook: WebhookSubscription) => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error('Not connected to Shopify');
      return;
    }
    
    setIsTesting(true);
    try {
      const adaptedContext = adaptContext(shopifyContext);
      const response = await testWebhook(adaptedContext, webhook.id);
      
      if (response.success) {
        toast.success('Webhook test successful', {
          description: `Shopify sent a test payload to ${webhook.address}`
        });
      } else {
        toast.error('Webhook test failed', {
          description: response.message || 'Unknown error'
        });
      }
      
      // Analytics
      gadgetAnalytics.trackFeatureUsage('webhooks', 'used', {
        topic: webhook.topic,
        action: 'test'
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to test webhook');
    } finally {
      setIsTesting(false);
    }
  };

  return {
    webhooks,
    isLoading,
    isCreating,
    isTesting,
    newWebhookTopic,
    setNewWebhookTopic,
    newWebhookAddress,
    setNewWebhookAddress,
    loadWebhooks,
    handleCreateWebhook,
    handleDeleteWebhook,
    handleTestWebhook
  };
};
