
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRecommendedWebhooks } from './webhookUtils';
import { Plus, Link } from 'lucide-react';
import { WebhookTopic } from '@/lib/shopify/webhooks';

interface WebhookFormProps {
  newWebhookTopic: string;
  setNewWebhookTopic: (topic: string) => void;
  newWebhookAddress: string;
  setNewWebhookAddress: (address: string) => void;
  handleCreateWebhook: () => void;
  isCreating: boolean;
}

export function WebhookForm({
  newWebhookTopic,
  setNewWebhookTopic,
  newWebhookAddress,
  setNewWebhookAddress,
  handleCreateWebhook,
  isCreating
}: WebhookFormProps) {
  const recommendedWebhooks = getRecommendedWebhooks();
  
  // Prefill with Escentual domain
  React.useEffect(() => {
    if (!newWebhookAddress) {
      setNewWebhookAddress('https://api.escentual.com/webhooks/shopify/');
    }
  }, [newWebhookAddress, setNewWebhookAddress]);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form 
          className="flex flex-col md:flex-row gap-3 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateWebhook();
          }}
        >
          <div className="space-y-2 flex-1">
            <label htmlFor="webhook-topic" className="text-sm font-medium">
              Webhook Topic
            </label>
            <Select
              value={newWebhookTopic}
              onValueChange={setNewWebhookTopic}
            >
              <SelectTrigger id="webhook-topic">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {recommendedWebhooks.map((webhook) => (
                  <SelectItem 
                    key={webhook.topic} 
                    value={webhook.topic}
                  >
                    <div className="flex items-center">
                      <span>{webhook.topic}</span>
                      {webhook.recommended && (
                        <span className="ml-2 text-xs text-green-600 font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 flex-1">
            <label htmlFor="webhook-address" className="text-sm font-medium">
              Endpoint URL
            </label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="webhook-address"
                type="url"
                placeholder="https://example.com/webhook"
                value={newWebhookAddress}
                onChange={(e) => setNewWebhookAddress(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isCreating || !newWebhookTopic || !newWebhookAddress}
            className="md:self-end"
          >
            {isCreating ? (
              "Creating..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Webhook
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-3 text-xs text-muted-foreground flex items-center">
          <Link className="h-3 w-3 mr-1" />
          Endpoints must be publicly accessible HTTPS URLs
        </div>
      </CardContent>
    </Card>
  );
}
