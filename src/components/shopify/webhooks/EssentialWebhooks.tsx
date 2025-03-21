
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Plus } from "lucide-react";
import { WebhookDefinition, Webhook } from "@/components/shopify/webhooks/types";

interface EssentialWebhooksProps {
  essentialWebhooks: WebhookDefinition[];
  existingWebhooks: Webhook[];
  onCreateWebhook: (topic: string) => void;
  isCreating: boolean;
}

export function EssentialWebhooks({ 
  essentialWebhooks, 
  existingWebhooks, 
  onCreateWebhook, 
  isCreating 
}: EssentialWebhooksProps) {
  
  // Get missing essential webhooks 
  const getMissingEssentialWebhooks = () => {
    return essentialWebhooks
      .filter(essential => essential.recommended)
      .filter(essential => 
        !existingWebhooks.some(webhook => webhook.topic === essential.topic && webhook.active)
      );
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Essential Webhooks</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {essentialWebhooks.map(webhook => {
          const isConfigured = existingWebhooks.some(w => 
            w.topic === webhook.topic && w.active
          );
          
          return (
            <div 
              key={webhook.topic} 
              className="flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <Label htmlFor={webhook.topic} className="text-sm">
                  {webhook.topic}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {webhook.description}
                </p>
              </div>
              
              {isConfigured ? (
                <Badge variant="success">Configured</Badge>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onCreateWebhook(webhook.topic)}
                  disabled={isCreating}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          );
        })}
      </div>
      
      {getMissingEssentialWebhooks().length > 0 && (
        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          <div className="font-medium flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            Missing essential webhooks
          </div>
          <p className="text-xs mt-1 text-amber-700">
            We recommend adding all essential webhooks for proper functionality
          </p>
        </div>
      )}
    </div>
  );
}
