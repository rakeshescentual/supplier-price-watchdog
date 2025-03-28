
import { WebhookTopic } from '@/lib/shopify/webhooks';

interface WebhookDefinition {
  topic: WebhookTopic;
  description: string;
  recommended: boolean;
}

// Function to get the recommended webhooks
export function getRecommendedWebhooks(): WebhookDefinition[] {
  return [
    {
      topic: 'products/update',
      description: 'Fires when products are updated',
      recommended: true
    },
    {
      topic: 'inventory_levels/update',
      description: 'Fires when inventory levels change',
      recommended: true
    },
    {
      topic: 'orders/create',
      description: 'Fires when a new order is created',
      recommended: true
    },
    {
      topic: 'app/uninstalled',
      description: 'Fires when your app is uninstalled',
      recommended: true
    },
    {
      topic: 'customers/create',
      description: 'Fires when a new customer is created',
      recommended: false
    },
    {
      topic: 'customers/update',
      description: 'Fires when a customer is updated',
      recommended: false
    },
    {
      topic: 'orders/update',
      description: 'Fires when an order is updated',
      recommended: false
    },
    {
      topic: 'fulfillments/create',
      description: 'Fires when a fulfillment is created',
      recommended: false
    },
    {
      topic: 'products/create',
      description: 'Fires when a product is created',
      recommended: false
    },
    {
      topic: 'products/delete',
      description: 'Fires when a product is deleted',
      recommended: false
    }
  ];
}

// Function to validate webhook input
export function validateWebhook(address: string, topic: WebhookTopic) {
  const errors: string[] = [];
  
  if (!topic) {
    errors.push('Topic is required');
  }
  
  if (!address) {
    errors.push('Address is required');
  } else if (!address.startsWith('https://')) {
    errors.push('Address must use HTTPS');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
