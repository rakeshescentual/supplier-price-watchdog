
import { useState, useEffect, useCallback } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Webhook } from './types';
import { toast } from 'sonner';
import { validateWebhook } from './webhookUtils';

// Mock data for testing
const MOCK_WEBHOOKS: Webhook[] = [
  {
    id: 'webhook1',
    topic: 'products/update',
    address: 'https://api.escentual.com/webhooks/shopify/products',
    active: true,
    format: 'json',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: 'webhook2',
    topic: 'inventory_levels/update',
    address: 'https://api.escentual.com/webhooks/shopify/inventory',
    active: true,
    format: 'json',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 'webhook3',
    topic: 'app/uninstalled',
    address: 'https://api.escentual.com/webhooks/shopify/uninstall',
    active: true,
    format: 'json',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  }
];

export function useShopifyWebhooks() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [newWebhookTopic, setNewWebhookTopic] = useState('');
  const [newWebhookAddress, setNewWebhookAddress] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Helper function to handle API failures with retry
  const withRetry = async <T,>(
    operation: () => Promise<T>,
    errorMessage: string,
    finallyCallback?: () => void
  ): Promise<T | null> => {
    let currentRetry = 0;
    
    while (currentRetry <= MAX_RETRIES) {
      try {
        return await operation();
      } catch (error) {
        currentRetry++;
        console.error(`${errorMessage} (Attempt ${currentRetry}/${MAX_RETRIES}):`, error);
        
        if (currentRetry > MAX_RETRIES) {
          toast.error(errorMessage, {
            description: error instanceof Error ? error.message : 'Unknown error'
          });
          return null;
        }
        
        // Exponential backoff: wait longer between each retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentRetry) * 500));
      }
    }
    
    return null;
  };

  const loadWebhooks = useCallback(async () => {
    if (!isShopifyConnected || !shopifyContext) {
      setWebhooks([]);
      return;
    }

    setIsLoading(true);
    setRetryCount(0);

    try {
      // In a production app, this would call the Shopify API
      // For demo purposes, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate occasional network issues
      if (Math.random() < 0.1 && retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        throw new Error('Simulated network error');
      }
      
      setWebhooks(MOCK_WEBHOOKS);
    } catch (error) {
      console.error('Error loading webhooks:', error);
      
      if (retryCount < MAX_RETRIES) {
        toast.info('Retrying webhook load', {
          description: `Attempt ${retryCount + 1} of ${MAX_RETRIES}`
        });
        setTimeout(loadWebhooks, 1000);
      } else {
        toast.error('Failed to load webhooks', {
          description: 'Could not retrieve webhooks after multiple attempts'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isShopifyConnected, shopifyContext, retryCount]);

  useEffect(() => {
    if (isShopifyConnected) {
      loadWebhooks();
    }
  }, [isShopifyConnected, loadWebhooks]);

  const handleCreateWebhook = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error('Not connected to Shopify');
      return;
    }

    // Validate input
    const validation = validateWebhook(newWebhookAddress, newWebhookTopic);
    if (!validation.valid) {
      toast.error('Invalid webhook configuration', {
        description: validation.errors.join(', ')
      });
      return;
    }

    setIsCreating(true);

    const result = await withRetry(
      async () => {
        // In a production app, this would call the Shopify API
        // For demo purposes, we'll just simulate the API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a new webhook object
        const newWebhook: Webhook = {
          id: `webhook${Date.now()}`,
          topic: newWebhookTopic,
          address: newWebhookAddress,
          active: true,
          format: 'json',
          createdAt: new Date().toISOString()
        };
        
        return newWebhook;
      },
      'Failed to create webhook',
      () => setIsCreating(false)
    );
    
    if (result) {
      setWebhooks(prev => [...prev, result]);
      setNewWebhookTopic('');
      setNewWebhookAddress('');
      toast.success('Webhook created', {
        description: `Created webhook for ${result.topic}`
      });
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error('Not connected to Shopify');
      return;
    }

    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;

    const result = await withRetry(
      async () => {
        // In a production app, this would call the Shopify API
        // For demo purposes, we'll just simulate the API call
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
      },
      'Failed to delete webhook'
    );
    
    if (result) {
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
      toast.success('Webhook deleted', {
        description: `Deleted webhook for ${webhook.topic}`
      });
    }
  };

  const handleTestWebhook = async (webhookId: string): Promise<boolean> => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error('Not connected to Shopify');
      return false;
    }

    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return false;

    setIsTesting(true);

    const result = await withRetry(
      async () => {
        // In a production app, this would actually test the webhook
        // For demo purposes, we'll just simulate the test
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Simulate a test response with 80% success rate
        const success = Math.random() > 0.2;
        return success;
      },
      'Failed to test webhook',
      () => setIsTesting(false)
    );
    
    if (result !== null) {
      if (result) {
        toast.success('Webhook test successful', {
          description: `Test notification sent to ${webhook.address}`
        });
      } else {
        toast.error('Webhook test failed', {
          description: `Failed to send test notification to ${webhook.address}`
        });
      }
      return result;
    }
    
    return false;
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
}
