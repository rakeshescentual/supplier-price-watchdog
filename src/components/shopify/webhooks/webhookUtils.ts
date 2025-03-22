
import { WebhookDefinition } from './types';

/**
 * Returns a list of essential webhooks based on the Shopify plan
 */
export const getEssentialWebhooks = (plan?: string): WebhookDefinition[] => {
  const basicWebhooks: WebhookDefinition[] = [
    {
      topic: 'app/uninstalled',
      description: 'Triggered when the app is uninstalled from a store',
      recommended: true
    },
    {
      topic: 'products/update',
      description: 'Triggered when a product is updated',
      recommended: true
    },
    {
      topic: 'inventory_levels/update',
      description: 'Triggered when inventory levels change',
      recommended: true
    },
    {
      topic: 'shop/update',
      description: 'Triggered when shop details are updated',
      recommended: true
    }
  ];
  
  // Additional webhooks for Shopify Plus plans
  const plusWebhooks: WebhookDefinition[] = [
    {
      topic: 'locations/create',
      description: 'Triggered when a new location is created',
      recommended: true
    },
    {
      topic: 'locations/update',
      description: 'Triggered when a location is updated',
      recommended: true
    },
    {
      topic: 'locations/delete',
      description: 'Triggered when a location is deleted',
      recommended: true
    },
    {
      topic: 'fulfillment_orders/fulfillment_request_rejected',
      description: 'Triggered when a fulfillment request is rejected',
      recommended: true
    },
    {
      topic: 'fulfillment_orders/scheduled_fulfillment_order_ready',
      description: 'Triggered when a scheduled fulfillment order is ready',
      recommended: true
    }
  ];
  
  // Return appropriate webhooks based on the shop plan
  return plan === 'plus' 
    ? [...basicWebhooks, ...plusWebhooks]
    : basicWebhooks;
};

/**
 * Validates webhook configuration
 */
export const validateWebhook = (
  address: string, 
  topic: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate address format
  if (!address.startsWith('https://')) {
    errors.push('Webhook address must use HTTPS protocol for security');
  }
  
  // Validate address for proper URL format
  try {
    new URL(address);
  } catch (e) {
    errors.push('Invalid URL format');
  }
  
  // Validate topic format
  if (!topic.includes('/')) {
    errors.push('Topic must be in format "resource/event"');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Groups webhooks by topic category
 */
export const groupWebhooksByCategory = (webhooks: { topic: string }[]): Record<string, number> => {
  const categories: Record<string, number> = {};
  
  webhooks.forEach(webhook => {
    const category = webhook.topic.split('/')[0];
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return categories;
};

/**
 * Get recommended webhook topics for Escentual's use case
 */
export const getRecommendedWebhooks = (): WebhookDefinition[] => {
  return [
    {
      topic: 'products/update',
      description: 'Keep Escentual product data in sync with Shopify',
      recommended: true
    },
    {
      topic: 'products/delete',
      description: 'Remove products when deleted from Shopify',
      recommended: true
    },
    {
      topic: 'inventory_levels/update',
      description: 'Update inventory levels across all locations',
      recommended: true
    },
    {
      topic: 'orders/create',
      description: 'Process new orders in real-time',
      recommended: true
    },
    {
      topic: 'customers/create',
      description: 'Sync new customer data to Escentual\'s systems',
      recommended: true
    },
    {
      topic: 'customers/update',
      description: 'Keep customer profiles in sync',
      recommended: false
    },
    {
      topic: 'fulfillments/create',
      description: 'Track when orders are fulfilled',
      recommended: false
    },
    {
      topic: 'price_rules/create',
      description: 'Track new promotions and discounts',
      recommended: false
    }
  ];
};
