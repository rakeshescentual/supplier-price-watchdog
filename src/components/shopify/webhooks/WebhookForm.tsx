
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
import { WebhookTopic } from '@/lib/shopify/webhooks';

interface WebhookFormProps {
  newWebhookTopic: WebhookTopic;
  setNewWebhookTopic: (topic: WebhookTopic) => void;
  newWebhookAddress: string;
  setNewWebhookAddress: (address: string) => void;
  handleCreateWebhook: () => Promise<void>;
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
  const webhookTopics: WebhookTopic[] = [
    'products/create',
    'products/update',
    'products/delete',
    'inventory_levels/update',
    'inventory_items/update',
    'collections/update'
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="webhook-topic" className="text-sm font-medium block mb-2">
          Webhook Topic
        </label>
        <Select value={newWebhookTopic} onValueChange={(value) => setNewWebhookTopic(value as WebhookTopic)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {webhookTopics.map(topic => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <label htmlFor="webhook-address" className="text-sm font-medium block mb-2">
          Callback URL
        </label>
        <Input
          id="webhook-address"
          type="url"
          value={newWebhookAddress}
          onChange={(e) => setNewWebhookAddress(e.target.value)}
          placeholder="https://your-endpoint.com/webhook"
        />
      </div>
      
      <div className="flex items-end">
        <Button
          onClick={handleCreateWebhook}
          disabled={isCreating || !newWebhookAddress || !newWebhookTopic}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>
    </div>
  );
}
