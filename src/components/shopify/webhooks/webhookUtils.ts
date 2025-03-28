
import { useShopify } from '@/contexts/shopify';

// Define the available webhook topics
export type WebhookTopic = 
  | 'products/create'
  | 'products/update'
  | 'products/delete'
  | 'orders/create'
  | 'orders/update'
  | 'orders/cancelled'
  | 'orders/fulfilled'
  | 'customers/create'
  | 'customers/update'
  | 'inventory_levels/update'
  | 'app/uninstalled'
  | 'shop/update'
  | 'checkouts/create'
  | 'checkouts/update'
  | 'fulfillments/create'
  | 'fulfillments/update'
  | 'collections/create'
  | 'collections/update'
  | 'collections/delete'
  | 'customer_groups/create'
  | 'customer_groups/update'
  | 'customer_groups/delete'
  | 'draft_orders/create'
  | 'draft_orders/update'
  | 'themes/create'
  | 'themes/update';

export interface WebhookType {
  id: string;
  topic: WebhookTopic;
  address: string;
  format: 'json' | 'xml';
  created_at: string;
  updated_at: string;
}

// Get list of essential webhooks based on store plan
export const getEssentialWebhooks = (
  storePlan?: string
): { topic: WebhookTopic; description: string; importance: 'critical' | 'recommended' | 'optional' }[] => {
  const essentialWebhooks = [
    {
      topic: 'products/update' as WebhookTopic,
      description: 'Notifies when product data changes',
      importance: 'critical' as const
    },
    {
      topic: 'inventory_levels/update' as WebhookTopic,
      description: 'Notifies when inventory levels change',
      importance: 'critical' as const
    },
    {
      topic: 'app/uninstalled' as WebhookTopic,
      description: 'Required for app security and cleanup',
      importance: 'critical' as const
    }
  ];

  const standardWebhooks = [
    {
      topic: 'orders/create' as WebhookTopic,
      description: 'Notifies when new orders are created',
      importance: 'recommended' as const
    },
    {
      topic: 'customers/create' as WebhookTopic,
      description: 'Notifies when new customers register',
      importance: 'recommended' as const
    }
  ];

  // Add Plus-specific webhooks if on Plus plan
  const plusWebhooks = storePlan?.toLowerCase().includes('plus')
    ? [
        {
          topic: 'customers/update' as WebhookTopic,
          description: 'Notifies when customer data changes',
          importance: 'recommended' as const
        },
        {
          topic: 'draft_orders/create' as WebhookTopic,
          description: 'Notifies when draft orders are created',
          importance: 'optional' as const
        }
      ]
    : [];

  return [...essentialWebhooks, ...standardWebhooks, ...plusWebhooks];
};

// Get recommended webhooks for dropdown selection
export const getRecommendedWebhooks = (): { label: string; value: WebhookTopic }[] => {
  return [
    { label: 'Products - Create', value: 'products/create' },
    { label: 'Products - Update', value: 'products/update' },
    { label: 'Products - Delete', value: 'products/delete' },
    { label: 'Orders - Create', value: 'orders/create' },
    { label: 'Orders - Update', value: 'orders/update' },
    { label: 'Orders - Cancelled', value: 'orders/cancelled' },
    { label: 'Orders - Fulfilled', value: 'orders/fulfilled' },
    { label: 'Customers - Create', value: 'customers/create' },
    { label: 'Customers - Update', value: 'customers/update' },
    { label: 'Inventory Levels - Update', value: 'inventory_levels/update' },
    { label: 'App - Uninstalled', value: 'app/uninstalled' },
    { label: 'Shop - Update', value: 'shop/update' }
  ];
};

// Validates a webhook configuration
export const validateWebhook = (
  topic: WebhookTopic,
  address: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate topic
  if (!topic) {
    errors.push('Webhook topic is required');
  }

  // Validate address
  if (!address) {
    errors.push('Webhook address is required');
  } else if (!address.startsWith('https://')) {
    errors.push('Webhook address must use HTTPS');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Format a webhook topic for display
export const formatWebhookTopic = (topic: WebhookTopic): string => {
  return topic
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' - ');
};

// Get a webhook description for the given topic
export const getWebhookDescription = (topic: WebhookTopic): string => {
  const descriptions: Record<WebhookTopic, string> = {
    'products/create': 'Triggered when a new product is created',
    'products/update': 'Triggered when a product is updated',
    'products/delete': 'Triggered when a product is deleted',
    'orders/create': 'Triggered when a new order is placed',
    'orders/update': 'Triggered when an order is updated',
    'orders/cancelled': 'Triggered when an order is cancelled',
    'orders/fulfilled': 'Triggered when an order is fulfilled',
    'customers/create': 'Triggered when a new customer account is created',
    'customers/update': 'Triggered when customer information is updated',
    'inventory_levels/update': 'Triggered when inventory levels change',
    'app/uninstalled': 'Triggered when the app is uninstalled',
    'shop/update': 'Triggered when shop settings are updated',
    'checkouts/create': 'Triggered when a checkout is created',
    'checkouts/update': 'Triggered when a checkout is updated',
    'fulfillments/create': 'Triggered when a fulfillment is created',
    'fulfillments/update': 'Triggered when a fulfillment is updated',
    'collections/create': 'Triggered when a collection is created',
    'collections/update': 'Triggered when a collection is updated',
    'collections/delete': 'Triggered when a collection is deleted',
    'customer_groups/create': 'Triggered when a customer group is created',
    'customer_groups/update': 'Triggered when a customer group is updated',
    'customer_groups/delete': 'Triggered when a customer group is deleted',
    'draft_orders/create': 'Triggered when a draft order is created',
    'draft_orders/update': 'Triggered when a draft order is updated',
    'themes/create': 'Triggered when a theme is created',
    'themes/update': 'Triggered when a theme is updated'
  };

  return descriptions[topic] || 'No description available';
};
