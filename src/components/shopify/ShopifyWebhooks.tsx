
import React from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Bell, AlertTriangle } from 'lucide-react';
import { WebhookForm } from './webhooks/WebhookForm';
import { WebhooksTable } from './webhooks/WebhooksTable';
import { NotConnectedState } from './webhooks/NotConnectedState';
import { useShopifyWebhooks } from './webhooks/useShopifyWebhooks';
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ShopifyWebhooks() {
  const { isShopifyConnected } = useShopify();
  const {
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
  } = useShopifyWebhooks();

  // Check for essential webhooks
  const essentialWebhookTopics = ['products/update', 'inventory_levels/update', 'app/uninstalled'];
  const hasMissingEssentialWebhooks = isShopifyConnected && webhooks.length > 0 && 
    essentialWebhookTopics.some(topic => !webhooks.some(webhook => webhook.topic === topic));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Shopify Webhooks
        </CardTitle>
        <CardDescription>
          Manage real-time notifications from your Shopify store
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isShopifyConnected ? (
          <NotConnectedState />
        ) : (
          <div className="space-y-6">
            {hasMissingEssentialWebhooks && (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Some essential webhooks are missing. Consider adding them for better integration.
                </AlertDescription>
              </Alert>
            )}
            
            <WebhookForm
              newWebhookTopic={newWebhookTopic}
              setNewWebhookTopic={setNewWebhookTopic}
              newWebhookAddress={newWebhookAddress}
              setNewWebhookAddress={setNewWebhookAddress}
              handleCreateWebhook={handleCreateWebhook}
              isCreating={isCreating}
            />
            
            <WebhooksTable
              webhooks={webhooks}
              isLoading={isLoading}
              onDeleteWebhook={handleDeleteWebhook}
              onTestWebhook={handleTestWebhook}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <Bell className="h-4 w-4 inline-block mr-1" />
          Webhooks allow Shopify to notify your app in real-time about events
        </div>
        <Button
          variant="outline"
          onClick={loadWebhooks}
          disabled={!isShopifyConnected || isLoading || isTesting}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </CardFooter>
    </Card>
  );
}
