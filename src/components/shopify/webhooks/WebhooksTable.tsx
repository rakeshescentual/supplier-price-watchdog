
import React from 'react';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WebhookSubscription } from '@/lib/shopify/webhooks';
import { AlertCircle, CheckCircle, Clock, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WebhooksTableProps {
  webhooks: WebhookSubscription[];
  isLoading: boolean;
  onDeleteWebhook: (id: string) => Promise<void>;
  onTestWebhook?: (webhook: WebhookSubscription) => Promise<void>;
}

export function WebhooksTable({ 
  webhooks, 
  isLoading, 
  onDeleteWebhook,
  onTestWebhook
}: WebhooksTableProps) {
  if (isLoading) {
    return (
      <div className="text-center p-6 border rounded-md bg-gray-50">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading webhooks...</p>
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No webhooks configured</p>
      </div>
    );
  }

  const getWebhookStatusBadge = (webhook: WebhookSubscription) => {
    const createdAt = new Date(webhook.createdAt);
    const isRecent = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000; // Less than 24 hours old
    
    return webhook.isActive ? (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
        {isRecent && (
          <span className="ml-1 text-xs bg-green-700 px-1 rounded">New</span>
        )}
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead>Callback URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.map((webhook) => (
            <TableRow key={webhook.id}>
              <TableCell className="font-medium">{webhook.topic}</TableCell>
              <TableCell className="font-mono text-xs truncate max-w-[180px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{webhook.address}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{webhook.address}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{getWebhookStatusBadge(webhook)}</TableCell>
              <TableCell>
                {webhook.createdAt ? formatDistanceToNow(new Date(webhook.createdAt), { addSuffix: true }) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {onTestWebhook && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onTestWebhook(webhook)}
                      title="Test webhook"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteWebhook(webhook.id)}
                    title="Delete webhook"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
