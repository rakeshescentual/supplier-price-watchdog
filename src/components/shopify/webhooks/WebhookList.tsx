
import { Webhook } from "@/components/shopify/webhooks/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface WebhookListProps {
  webhooks: Webhook[];
  isLoading: boolean;
  onToggleStatus: (webhookId: string, active: boolean) => void;
}

export function WebhookList({ webhooks, isLoading, onToggleStatus }: WebhookListProps) {
  return (
    <ScrollArea className="h-[140px] rounded-md border">
      {isLoading ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Loading webhooks...
        </div>
      ) : webhooks.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No webhooks configured
        </div>
      ) : (
        <div className="p-2">
          {webhooks.map(webhook => (
            <div 
              key={webhook.id} 
              className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md"
            >
              <div>
                <div className="text-sm font-medium">{webhook.topic}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {webhook.address}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={webhook.active}
                  onCheckedChange={(checked) => onToggleStatus(webhook.id, checked)}
                />
                <Badge variant={webhook.active ? "success" : "outline"} className="ml-2">
                  {webhook.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
