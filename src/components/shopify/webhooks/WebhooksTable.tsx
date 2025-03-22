
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Webhook } from './types';
import { Trash2, Send, Check, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WebhooksTableProps {
  webhooks: Webhook[];
  isLoading: boolean;
  onDeleteWebhook: (webhookId: string) => void;
  onTestWebhook: (webhookId: string) => Promise<boolean>;
}

export function WebhooksTable({ 
  webhooks, 
  isLoading, 
  onDeleteWebhook, 
  onTestWebhook 
}: WebhooksTableProps) {
  const [testingWebhooks, setTestingWebhooks] = React.useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = React.useState<Record<string, boolean>>({});

  const handleTestWebhook = async (webhookId: string) => {
    setTestingWebhooks(prev => ({ ...prev, [webhookId]: true }));
    try {
      const result = await onTestWebhook(webhookId);
      setTestResults(prev => ({ ...prev, [webhookId]: result }));
      
      // Clear test result after 5 seconds
      setTimeout(() => {
        setTestResults(prev => {
          const newResults = { ...prev };
          delete newResults[webhookId];
          return newResults;
        });
      }, 5000);
    } finally {
      setTestingWebhooks(prev => ({ ...prev, [webhookId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-sm text-muted-foreground">No webhooks configured</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.map((webhook) => {
            const isTesting = testingWebhooks[webhook.id];
            const testResult = testResults[webhook.id];
            const testStatus = testResult === undefined 
              ? null 
              : testResult === true
                ? "success"
                : "error";
              
            return (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium">
                  {webhook.topic}
                </TableCell>
                <TableCell className="font-mono text-xs max-w-md truncate">
                  {webhook.address}
                </TableCell>
                <TableCell>
                  {webhook.active ? (
                    <Badge variant="success" className="flex w-fit items-center gap-1">
                      <Check className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex w-fit items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(webhook.createdAt), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook.id)}
                      disabled={isTesting}
                      className={
                        testStatus === "success" ? "border-green-200 bg-green-50" :
                        testStatus === "error" ? "border-red-200 bg-red-50" : ""
                      }
                    >
                      {isTesting ? (
                        "Testing..."
                      ) : testStatus === "success" ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                          Success
                        </>
                      ) : testStatus === "error" ? (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                          Failed
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          Test
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
