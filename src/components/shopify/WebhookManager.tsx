
import React, { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, AlertTriangle, PlusCircle, RefreshCw, CheckCircle2, XCircle, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { WebhookTopic } from '@/lib/shopify/webhooks';
import { testWebhook } from '@/lib/shopify/webhooks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Webhook {
  id: string;
  topic: string;
  address: string;
  format: "json";
  createdAt: string;
  isActive: boolean;
}

export function ShopifyWebhookManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState('existing');
  const [newWebhook, setNewWebhook] = useState<Webhook>({
    id: '',
    topic: '',
    address: '',
    format: "json",
    createdAt: '',
    isActive: true
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message?: string }>>({});
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');

  useEffect(() => {
    if (isShopifyConnected) {
      fetchWebhooks();
    }
  }, [isShopifyConnected]);

  const fetchWebhooks = async () => {
    if (!isShopifyConnected) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call the API to fetch webhooks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setWebhooks([
        {
          id: 'webhook1',
          topic: 'products/update',
          address: 'https://example.com/webhooks/products-update',
          format: 'json',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: 'webhook2',
          topic: 'inventory_levels/update',
          address: 'https://example.com/webhooks/inventory-update',
          format: 'json',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      ]);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      toast.error('Failed to load webhooks', {
        description: 'Could not retrieve webhooks from Shopify.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    if (!isShopifyConnected) {
      toast.error("Shopify not connected", {
        description: "Please connect to Shopify before creating webhooks."
      });
      return;
    }
    
    if (!newWebhook.topic || !newWebhook.address) {
      toast.error("Missing information", {
        description: "Please provide both topic and address for the webhook."
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // In a real app, this would call the API to create the webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const webhookId = `webhook-${Date.now()}`;
      const createdWebhook = {
        ...newWebhook,
        id: webhookId,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      setWebhooks([...webhooks, createdWebhook]);
      
      toast.success("Webhook created", {
        description: `The ${newWebhook.topic} webhook has been created successfully.`
      });
      
      // Reset form and switch to existing webhooks tab
      setNewWebhook({
        id: '',
        topic: '',
        address: '',
        format: "json",
        createdAt: '',
        isActive: true
      });
      setActiveTab('existing');
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook', {
        description: 'There was an error creating the webhook. Please try again.'
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteWebhook = async (webhookId: string) => {
    if (!isShopifyConnected) return;
    
    try {
      // In a real app, this would call the API to delete the webhook
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
      
      toast.success("Webhook deleted", {
        description: "The webhook has been successfully deleted."
      });
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook', {
        description: 'There was an error deleting the webhook. Please try again.'
      });
    }
  };
  
  const handleTestWebhook = async (webhook: Webhook) => {
    if (!isShopifyConnected || !shopifyContext) return;
    
    setIsTesting(webhook.id);
    
    try {
      // In a real app, this would call the testWebhook function
      const result = await testWebhook(shopifyContext, webhook.id);
      
      setTestResults({
        ...testResults,
        [webhook.id]: {
          success: result.success,
          message: result.message || (result.success ? 'Test successful' : 'Test failed')
        }
      });
      
      if (result.success) {
        toast.success('Webhook test successful', {
          description: `The ${webhook.topic} webhook responded correctly.`
        });
      } else {
        toast.error('Webhook test failed', {
          description: result.message || 'The webhook endpoint did not respond correctly.'
        });
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      
      setTestResults({
        ...testResults,
        [webhook.id]: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      
      toast.error('Webhook test error', {
        description: 'There was an error testing the webhook.'
      });
    } finally {
      setIsTesting(null);
    }
  };
  
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Shopify Webhooks
        </CardTitle>
        <CardDescription>
          Manage and create webhooks to receive real-time updates from your Shopify store
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ml-6">
          <TabsTrigger value="existing">Existing Webhooks</TabsTrigger>
          <TabsTrigger value="new">Create New</TabsTrigger>
        </TabsList>
        
        <CardContent className="mt-4">
          {!isShopifyConnected ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Shopify Not Connected</AlertTitle>
              <AlertDescription>
                Please connect to your Shopify store to manage webhooks.
              </AlertDescription>
            </Alert>
          ) : activeTab === 'existing' ? (
            <div>
              {isLoading ? (
                <div className="py-8 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading webhooks...</p>
                </div>
              ) : webhooks.length === 0 ? (
                <div className="py-8 text-center">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Webhooks Found</AlertTitle>
                    <AlertDescription>
                      You don't have any webhooks configured yet. Create one to receive real-time updates from Shopify.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('new')} 
                    className="mt-4"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Webhook
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">
                      {webhooks.length} {webhooks.length === 1 ? 'Webhook' : 'Webhooks'} Configured
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchWebhooks}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhooks.map((webhook) => (
                        <TableRow key={webhook.id}>
                          <TableCell>{webhook.topic}</TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {webhook.address}
                          </TableCell>
                          <TableCell>{formatDate(webhook.createdAt)}</TableCell>
                          <TableCell>
                            {webhook.isActive ? (
                              <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleTestWebhook(webhook)}
                                      disabled={isTesting === webhook.id}
                                    >
                                      {isTesting === webhook.id ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Play className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Test webhook</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleDeleteWebhook(webhook.id)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete webhook</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            {testResults[webhook.id] && (
                              <div className="mt-1 text-xs">
                                {testResults[webhook.id].success ? (
                                  <span className="text-green-600 dark:text-green-400 flex items-center justify-end">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Test passed
                                  </span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400 flex items-center justify-end">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Test failed
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="topic">Topic</Label>
                <Select onValueChange={(value) => setNewWebhook(prev => ({ ...prev, topic: value }))}>
                  <SelectTrigger id="topic">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products/create">products/create</SelectItem>
                    <SelectItem value="products/update">products/update</SelectItem>
                    <SelectItem value="products/delete">products/delete</SelectItem>
                    <SelectItem value="orders/create">orders/create</SelectItem>
                    <SelectItem value="orders/update">orders/update</SelectItem>
                    <SelectItem value="orders/delete">orders/delete</SelectItem>
                    <SelectItem value="inventory_levels/update">inventory_levels/update</SelectItem>
                    <SelectItem value="app/uninstalled">app/uninstalled</SelectItem>
                    {isPlusStore && (
                      <>
                        <SelectItem value="collections/update">collections/update</SelectItem>
                        <SelectItem value="customers/create">customers/create</SelectItem>
                        <SelectItem value="customers/update">customers/update</SelectItem>
                        <SelectItem value="fulfillments/create">fulfillments/create</SelectItem>
                        <SelectItem value="fulfillments/update">fulfillments/update</SelectItem>
                        <SelectItem value="shop/update">shop/update</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  type="url" 
                  placeholder="https://example.com/webhook" 
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, address: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  The URL that will receive webhook notifications
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="format">Format</Label>
                <Select 
                  defaultValue="json" 
                  disabled
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Only JSON format is supported
                </p>
              </div>
              
              <Alert variant="secondary" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure your webhook endpoint is publicly accessible and can handle POST requests.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {activeTab === 'new' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('existing')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateWebhook} 
                disabled={!isShopifyConnected || isCreating || !newWebhook.topic || !newWebhook.address}
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Webhook
                  </>
                )}
              </Button>
            </>
          )}
          
          {activeTab === 'existing' && (
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('new')}
              className="ml-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Webhook
            </Button>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
}

// Add an alias export for WebhookManager to maintain compatibility with existing imports
export const WebhookManager = ShopifyWebhookManager;
