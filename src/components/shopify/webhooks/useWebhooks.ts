
import { useState, useEffect } from "react";
import { enhancedShopifyClient } from "@/services/enhanced-shopify";
import { useShopify } from "@/contexts/shopify";
import { toast } from "sonner";
import { Webhook, WebhookDefinition } from "./types";
import { gadgetAnalytics } from "@/lib/gadget/analytics";

// Create a webhook tracking object for analytics
const webhookTracker = {
  trackView: () => gadgetAnalytics.trackFeatureUsage('webhooks', 'viewed'),
  trackCreate: (metadata?: Record<string, any>) => gadgetAnalytics.trackFeatureUsage('webhooks', 'used', metadata),
  trackUpdate: (metadata?: Record<string, any>) => gadgetAnalytics.trackFeatureUsage('webhooks', 'used', metadata)
};

export function useWebhooks() {
  const { isShopifyConnected } = useShopify();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Essential webhooks configuration
  const essentialWebhooks: WebhookDefinition[] = [
    {
      topic: "products/update",
      description: "Track product updates",
      recommended: true
    },
    {
      topic: "products/delete",
      description: "Handle product deletions",
      recommended: true
    },
    {
      topic: "orders/create",
      description: "Track new orders",
      recommended: false
    },
    {
      topic: "inventory_levels/update",
      description: "Track inventory changes",
      recommended: true
    },
    {
      topic: "app/uninstalled",
      description: "Handle app uninstallation",
      recommended: true
    }
  ];
  
  // Load webhooks
  const loadWebhooks = async () => {
    if (!isShopifyConnected) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch real webhooks
      // For demo purposes, we'll create mock data
      webhookTracker.trackView();
      
      setTimeout(() => {
        const mockWebhooks: Webhook[] = [
          {
            id: "webhook1",
            topic: "products/update",
            address: "https://app.escentual.com/api/webhooks/products-update",
            active: true,
            format: "json",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "webhook2",
            topic: "inventory_levels/update",
            address: "https://app.escentual.com/api/webhooks/inventory-update",
            active: true,
            format: "json",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setWebhooks(mockWebhooks);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading webhooks:", error);
      toast.error("Failed to load webhooks", {
        description: "Could not retrieve webhooks from Shopify"
      });
      setIsLoading(false);
    }
  };
  
  // Create webhook
  const createWebhook = async (topic: string) => {
    if (!isShopifyConnected) return;
    
    setIsCreating(true);
    
    try {
      const webhookAddress = `https://app.escentual.com/api/webhooks/${topic.replace(/\//g, '-')}`;
      
      const result = await enhancedShopifyClient.registerWebhook(
        topic,
        webhookAddress,
        'json'
      );
      
      if (result.success) {
        webhookTracker.trackCreate({
          topic,
          address: webhookAddress
        });
        
        toast.success("Webhook created", {
          description: `Created webhook for ${topic}`
        });
        
        // Add the new webhook to the list
        setWebhooks(prev => [
          ...prev,
          {
            id: result.webhookId,
            topic,
            address: webhookAddress,
            active: true,
            format: 'json',
            createdAt: new Date().toISOString()
          }
        ]);
      } else {
        toast.error("Failed to create webhook", {
          description: result.message || "An error occurred"
        });
      }
    } catch (error) {
      console.error("Error creating webhook:", error);
      toast.error("Webhook creation failed", {
        description: "Could not create webhook"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Toggle webhook active status
  const toggleWebhookStatus = (webhookId: string, active: boolean) => {
    // In a real implementation, this would update the webhook in Shopify
    setWebhooks(prev => 
      prev.map(webhook => 
        webhook.id === webhookId 
          ? { ...webhook, active } 
          : webhook
      )
    );
    
    webhookTracker.trackUpdate({
      webhookId,
      active
    });
    
    toast.success(`Webhook ${active ? 'activated' : 'deactivated'}`, {
      description: `Webhook has been ${active ? 'activated' : 'deactivated'}`
    });
  };
  
  // Load webhooks on component mount
  useEffect(() => {
    loadWebhooks();
  }, [isShopifyConnected]);
  
  return {
    webhooks,
    isLoading,
    isCreating,
    essentialWebhooks,
    loadWebhooks,
    createWebhook,
    toggleWebhookStatus
  };
}
