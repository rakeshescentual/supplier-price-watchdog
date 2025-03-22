// Existing types
export type WebhookTopic = 
  | 'products/create' 
  | 'products/update' 
  | 'products/delete' 
  | 'orders/create' 
  | 'orders/fulfilled' 
  | 'orders/cancelled' 
  | 'customers/create' 
  | 'customers/update' 
  | 'app/uninstalled' 
  | 'inventory_levels/update' 
  | 'inventory_items/update' 
  | 'collections/update';

export interface ShopifyContext {
  shop: string;
  accessToken: string;
  shopPlan?: 'basic' | 'shopify' | 'advanced' | 'plus';
}

export interface WebhookSubscription {
  id: string;
  topic: string;
  address: string;
  format: string;
  createdAt: string;
  isActive: boolean;
}

// WebhookTestResponse interface
export interface WebhookTestResponse {
  success: boolean;
  message?: string;
  deliveryDetails?: {
    status: number;
    responseBody: string;
    responseHeaders: Record<string, string>;
    deliveryTime: number;
  };
}

// Existing functions (simplified)
export const listWebhooks = async (context: ShopifyContext): Promise<WebhookSubscription[]> => {
  try {
    console.log(`Listing webhooks for shop ${context.shop}`);
    
    // In a real implementation, this would make an API call to Shopify
    // For demonstration purposes, we're returning mock data
    
    return [
      {
        id: 'webhook1',
        topic: 'products/update',
        address: 'https://example.com/webhooks/products-update',
        format: 'json',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'webhook2',
        topic: 'inventory_levels/update',
        address: 'https://example.com/webhooks/inventory-update',
        format: 'json',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
    ];
  } catch (error) {
    console.error('Error listing webhooks:', error);
    throw error;
  }
};

export const createWebhook = async (
  context: ShopifyContext,
  topic: WebhookTopic,
  address: string
): Promise<WebhookSubscription> => {
  try {
    console.log(`Creating webhook for ${topic} to ${address} for shop ${context.shop}`);
    
    // In a real implementation, this would make an API call to Shopify
    // For demonstration purposes, we're returning mock data
    
    return {
      id: `webhook-${Date.now()}`,
      topic,
      address,
      format: 'json',
      createdAt: new Date().toISOString(),
      isActive: true
    };
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
};

export const deleteWebhook = async (
  context: ShopifyContext,
  id: string
): Promise<boolean> => {
  try {
    console.log(`Deleting webhook ${id} for shop ${context.shop}`);
    
    // In a real implementation, this would make an API call to Shopify
    // For demonstration purposes, we're returning success
    
    return true;
  } catch (error) {
    console.error('Error deleting webhook:', error);
    throw error;
  }
};

// New function to test a webhook
export const testWebhook = async (
  context: ShopifyContext,
  webhookId: string
): Promise<WebhookTestResponse> => {
  try {
    console.log(`Testing webhook ${webhookId} for shop ${context.shop}`);
    
    // In a real implementation, this would make an API call to Shopify to test the webhook
    // For demonstration purposes, we're simulating a response
    
    // Simulate successful delivery 90% of the time
    const isSuccessful = Math.random() > 0.1;
    
    if (isSuccessful) {
      return {
        success: true,
        deliveryDetails: {
          status: 200,
          responseBody: '{"success":true}',
          responseHeaders: {
            'content-type': 'application/json',
            'x-webhook-hmac': 'mock-hmac'
          },
          deliveryTime: Math.floor(Math.random() * 300 + 100) // 100-400ms
        }
      };
    } else {
      return {
        success: false,
        message: 'Webhook endpoint returned an error',
        deliveryDetails: {
          status: 500,
          responseBody: '{"error":"Internal Server Error"}',
          responseHeaders: {
            'content-type': 'application/json'
          },
          deliveryTime: Math.floor(Math.random() * 400 + 200) // 200-600ms
        }
      };
    }
  } catch (error) {
    console.error('Error testing webhook:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Additional useful function for bulk webhook management
export const syncWebhooks = async (
  context: ShopifyContext,
  requiredWebhooks: { topic: WebhookTopic; address: string }[]
): Promise<{ created: number; existing: number; failed: number }> => {
  try {
    // Get existing webhooks
    const existingWebhooks = await listWebhooks(context);
    
    let created = 0;
    let existing = 0;
    let failed = 0;
    
    // Create required webhooks that don't exist yet
    for (const webhook of requiredWebhooks) {
      // Check if webhook already exists
      const exists = existingWebhooks.some(
        (w) => w.topic === webhook.topic && w.address === webhook.address
      );
      
      if (exists) {
        existing++;
        continue;
      }
      
      try {
        await createWebhook(context, webhook.topic, webhook.address);
        created++;
      } catch (error) {
        console.error(`Failed to create webhook ${webhook.topic}:`, error);
        failed++;
      }
    }
    
    return { created, existing, failed };
  } catch (error) {
    console.error('Error syncing webhooks:', error);
    throw error;
  }
};
