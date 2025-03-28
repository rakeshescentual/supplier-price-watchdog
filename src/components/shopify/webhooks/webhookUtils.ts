
/**
 * Utilities for handling Shopify webhooks
 * Implements best practices for the upcoming webhook API changes
 */

import { toast } from 'sonner';

// Webhook topic types based on Shopify's latest specs
export const WEBHOOK_TOPICS = [
  // Core topics
  'products/create',
  'products/update',
  'products/delete',
  'orders/create',
  'orders/cancelled',
  'orders/fulfilled',
  'customers/create',
  'customers/update',
  'inventory_levels/update',
  'inventory_items/create',
  'inventory_items/update',
  'fulfillments/create',
  
  // App topics
  'app/uninstalled',
  
  // Plus-only topics
  'themes/publish',
  'collections/update',
  'price_rules/create',
  'price_rules/update',
  'bulk_operations/finish',
  'customer_payment_methods/create',
  'customer_payment_methods/update',
  'customer_payment_methods/revoke',
  'company_locations/create',
  'company_locations/update',
  'company_locations/delete',
  'locales/create',
  'shop/update',
] as const;

export type WebhookTopic = typeof WEBHOOK_TOPICS[number];

export interface WebhookValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a webhook configuration before registering
 */
export const validateWebhook = (
  address: string, 
  topic: string
): WebhookValidationResult => {
  const errors: string[] = [];
  
  // Check webhook address
  if (!address) {
    errors.push('Webhook address is required');
  } else if (!address.startsWith('https://')) {
    errors.push('Webhook address must use HTTPS');
  } else if (!/^https:\/\/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(address)) {
    errors.push('Invalid webhook URL format');
  }
  
  // Check topic
  if (!topic) {
    errors.push('Webhook topic is required');
  } else if (!WEBHOOK_TOPICS.includes(topic as WebhookTopic)) {
    errors.push(`Invalid webhook topic: ${topic}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Process webhook payloads according to Shopify's latest best practices
 */
export const processWebhookPayload = async (
  topic: WebhookTopic,
  payload: any,
  hmac: string,
  shopDomain: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    // In production:
    // 1. Verify HMAC signature
    // 2. Validate payload format
    // 3. Process based on topic
    
    console.log(`Processing ${topic} webhook from ${shopDomain}`);
    
    // Mock processing based on topic
    switch (topic) {
      case 'products/update':
        return {
          success: true,
          message: 'Product update processed',
          data: { id: payload.id }
        };
        
      case 'inventory_levels/update':
        return {
          success: true,
          message: 'Inventory update processed',
          data: { 
            inventoryItemId: payload.inventory_item_id,
            availableAdjustment: payload.available_adjustment
          }
        };
        
      case 'app/uninstalled':
        return {
          success: true,
          message: 'App uninstalled event processed',
          data: { shopDomain }
        };
        
      default:
        return {
          success: true,
          message: `${topic} webhook processed`,
          data: { received: true }
        };
    }
  } catch (error) {
    console.error(`Error processing ${topic} webhook:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Register webhook with the new API pattern
 */
export const registerShopifyWebhook = async (
  shopDomain: string,
  accessToken: string,
  topic: WebhookTopic,
  address: string,
  format: 'json' | 'xml' = 'json'
): Promise<{ success: boolean; webhookId?: string; message?: string }> => {
  // Validate inputs
  const validation = validateWebhook(address, topic);
  if (!validation.valid) {
    return { 
      success: false, 
      message: validation.errors.join(', ')
    };
  }
  
  try {
    // In production, this would use the Shopify API
    // The new Shopify API pattern uses GraphQL for webhooks:
    /*
    const CREATE_WEBHOOK_MUTATION = `
      mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
          userErrors {
            field
            message
          }
          webhookSubscription {
            id
          }
        }
      }
    `;
    
    const variables = {
      topic: topic.toUpperCase().replace(/\//g, '_'),
      webhookSubscription: {
        callbackUrl: address,
        format
      }
    };
    
    const response = await fetch(`https://${shopDomain}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        query: CREATE_WEBHOOK_MUTATION,
        variables
      })
    });
    
    const result = await response.json();
    */
    
    // Mock successful response
    console.log(`Registering ${topic} webhook to ${address}`);
    
    return {
      success: true,
      webhookId: `webhook_${Date.now()}`,
      message: `Successfully registered ${topic} webhook`
    };
  } catch (error) {
    console.error('Error registering webhook:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test a webhook by sending a test notification
 */
export const testWebhook = async (
  shopDomain: string,
  accessToken: string,
  webhookId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // In production, this would use the Shopify API to test the webhook
    // For now, simulate a test
    
    console.log(`Testing webhook ${webhookId} for ${shopDomain}`);
    
    // Simulate 90% success rate
    if (Math.random() < 0.9) {
      return {
        success: true,
        message: 'Test notification sent successfully'
      };
    } else {
      throw new Error('Webhook endpoint returned status 500');
    }
  } catch (error) {
    console.error('Error testing webhook:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
