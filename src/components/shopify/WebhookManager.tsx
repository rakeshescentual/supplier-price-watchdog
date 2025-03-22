
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Bell, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { useShopify } from '@/contexts/shopify';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Webhook {
  id: string;
  topic: string;
  address: string;
  format: 'json' | 'xml';
  active: boolean;
  createdAt: string;
}

const WEBHOOK_TOPICS = [
  'products/create',
  'products/update',
  'products/delete',
  'orders/create',
  'orders/updated',
  'inventory_levels/update',
  'collections/create',
  'collections/update',
  'price_rules/create',
  'price_rules/update'
];

export function WebhookManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    topic: '',
    address: '',
    format: 'json' as const
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchWebhooks = async () => {
    if (!isShopifyConnected) return;
    
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demo
      setWebhooks([
        {
          id: '1',
          topic: 'products/update',
          address: 'https://escentual-hooks.gadget.app/webhooks/products',
          format: 'json',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          topic: 'inventory_levels/update',
          address: 'https://escentual-hooks.gadget.app/webhooks/inventory',
          format: 'json',
          active: true,
          createdAt: new Date().toISOString()
        }
      ]);
      
      toast({
        title: 'Webhooks loaded',
        description: 'Successfully fetched webhooks from Shopify'
      });
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load webhooks',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!isShopifyConnected || !newWebhook.topic || !newWebhook.address) return;
    
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock creation for demo
      const newId = Date.now().toString();
      setWebhooks(prev => [
        ...prev,
        {
          id: newId,
          ...newWebhook,
          active: true,
          createdAt: new Date().toISOString()
        }
      ]);
      
      setDialogOpen(false);
      setNewWebhook({
        topic: '',
        address: '',
        format: 'json'
      });
      
      toast({
        title: 'Webhook created',
        description: `Created webhook for ${newWebhook.topic}`
      });
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create webhook',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWebhook = async (id: string, active: boolean) => {
    if (!isShopifyConnected) return;
    
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state for demo
      setWebhooks(prev => 
        prev.map(webhook => 
          webhook.id === id ? { ...webhook, active } : webhook
        )
      );
      
      toast({
        title: active ? 'Webhook activated' : 'Webhook deactivated',
        description: `Successfully ${active ? 'activated' : 'deactivated'} the webhook`
      });
    } catch (error) {
      console.error('Error toggling webhook:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update webhook',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!isShopifyConnected) return;
    
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state for demo
      setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
      
      toast({
        title: 'Webhook deleted',
        description: 'Successfully removed the webhook'
      });
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete webhook',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Initialize on first render
  useState(() => {
    if (isShopifyConnected) {
      fetchWebhooks();
    }
  });

  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Shopify Webhooks
          </CardTitle>
          <CardDescription>
            Connect to Shopify to manage webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            Connect to Shopify to manage webhooks
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Shopify Webhooks
          </CardTitle>
          <CardDescription>
            Manage notifications from Shopify to your application
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
                <DialogDescription>
                  Set up a new webhook to receive Shopify event notifications
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-topic">Topic</Label>
                  <Select
                    value={newWebhook.topic}
                    onValueChange={(value) => setNewWebhook({...newWebhook, topic: value})}
                  >
                    <SelectTrigger id="webhook-topic">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEBHOOK_TOPICS.map(topic => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-address">Endpoint URL</Label>
                  <Input
                    id="webhook-address"
                    value={newWebhook.address}
                    onChange={(e) => setNewWebhook({...newWebhook, address: e.target.value})}
                    placeholder="https://your-endpoint.com/webhook"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-format">Format</Label>
                  <Select
                    value={newWebhook.format}
                    onValueChange={(value: 'json' | 'xml') => setNewWebhook({...newWebhook, format: value})}
                  >
                    <SelectTrigger id="webhook-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={createWebhook}
                  disabled={!newWebhook.topic || !newWebhook.address}
                >
                  Create Webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={fetchWebhooks} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {webhooks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {isLoading ? 'Loading webhooks...' : 'No webhooks configured'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.topic}</TableCell>
                  <TableCell className="font-mono text-xs">{webhook.address}</TableCell>
                  <TableCell>{webhook.format.toUpperCase()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={webhook.active}
                        onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                      />
                      <Badge variant={webhook.active ? "success" : "secondary"}>
                        {webhook.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
