
/**
 * Shopify Webhooks Management
 * 
 * This module handles creating, validating, and processing Shopify webhooks.
 */
import { ShopifyContext } from '@/types/shopify';
import { shopifyClient } from './client';

export type WebhookTopic = 
  | 'products/create'
  | 'products/update'
  | 'products/delete'
  | 'inventory_levels/update'
  | 'inventory_levels/connect'
  | 'inventory_items/create'
  | 'inventory_items/update'
  | 'inventory_items/delete'
  | 'collections/create'
  | 'collections/update'
  | 'collections/delete';

export interface WebhookSubscription {
  id: string;
  topic: WebhookTopic;
  address: string;
  format: 'json' | 'xml';
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create a new webhook subscription
 */
export async function createWebhook(
  context: ShopifyContext,
  topic: WebhookTopic, 
  address: string, 
  format: 'json' | 'xml' = 'json'
): Promise<WebhookSubscription> {
  try {
    const response = await shopifyClient.graphql<{
      webhookSubscriptionCreate: {
        webhookSubscription: WebhookSubscription;
        userErrors: Array<{ field: string[], message: string }>;
      }
    }>(`
      mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
          webhookSubscription {
            id
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
            format
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      topic: topic.toUpperCase().replace('/', '_'),
      webhookSubscription: {
        callbackUrl: address,
        format
      }
    });

    if (response.webhookSubscriptionCreate.userErrors.length > 0) {
      throw new Error(response.webhookSubscriptionCreate.userErrors[0].message);
    }

    return {
      id: response.webhookSubscriptionCreate.webhookSubscription.id,
      topic,
      address,
      format,
      active: true
    };
  } catch (error) {
    console.error(`Failed to create webhook for ${topic}:`, error);
    throw error;
  }
}

/**
 * List all webhook subscriptions
 */
export async function listWebhooks(context: ShopifyContext): Promise<WebhookSubscription[]> {
  try {
    const response = await shopifyClient.graphql<{
      webhookSubscriptions: {
        edges: Array<{
          node: {
            id: string;
            topic: string;
            endpoint: {
              __typename: string;
              callbackUrl?: string;
            };
            format: 'JSON' | 'XML';
          }
        }>
      }
    }>(`
      query {
        webhookSubscriptions(first: 100) {
          edges {
            node {
              id
              topic
              endpoint {
                __typename
                ... on WebhookHttpEndpoint {
                  callbackUrl
                }
              }
              format
            }
          }
        }
      }
    `);

    return response.webhookSubscriptions.edges.map(edge => ({
      id: edge.node.id,
      topic: edge.node.topic.toLowerCase().replace('_', '/') as WebhookTopic,
      address: edge.node.endpoint.__typename === 'WebhookHttpEndpoint' 
        ? edge.node.endpoint.callbackUrl || ''
        : '',
      format: edge.node.format.toLowerCase() as 'json' | 'xml',
      active: true
    }));
  } catch (error) {
    console.error('Failed to list webhooks:', error);
    throw error;
  }
}

/**
 * Delete a webhook subscription
 */
export async function deleteWebhook(context: ShopifyContext, id: string): Promise<boolean> {
  try {
    const response = await shopifyClient.graphql<{
      webhookSubscriptionDelete: {
        userErrors: Array<{ field: string[], message: string }>;
        deletedWebhookSubscriptionId: string;
      }
    }>(`
      mutation webhookSubscriptionDelete($id: ID!) {
        webhookSubscriptionDelete(id: $id) {
          deletedWebhookSubscriptionId
          userErrors {
            field
            message
          }
        }
      }
    `, {
      id
    });

    if (response.webhookSubscriptionDelete.userErrors.length > 0) {
      throw new Error(response.webhookSubscriptionDelete.userErrors[0].message);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete webhook ${id}:`, error);
    throw error;
  }
}

/**
 * Verify a webhook request from Shopify
 */
export function verifyWebhookHmac(
  hmac: string, 
  body: string, 
  secret: string
): boolean {
  const crypto = require('crypto');
  const calculatedHmac = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
    
  return calculatedHmac === hmac;
}

/**
 * Process a webhook notification from Shopify
 */
export function processWebhook(
  topic: WebhookTopic,
  data: any
): void {
  console.log(`Processing ${topic} webhook:`, data);
  
  // Implement webhook handling logic here
  switch (topic) {
    case 'products/update':
      // Handle product updates
      break;
    case 'inventory_levels/update':
      // Handle inventory updates
      break;
    // Add other webhook handlers
  }
}
