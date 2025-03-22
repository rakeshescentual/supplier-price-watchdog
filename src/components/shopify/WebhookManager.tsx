import React, { useState } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, AlertTriangle, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Webhook {
  topic: string;
  address: string;
  format: "json";
}

export function ShopifyWebhookManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState('existing');
  const [newWebhook, setNewWebhook] = useState<Webhook>({
    topic: '',
    address: '',
    format: "json"
  });
  const [isCreating, setIsCreating] = useState(false);
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');

  const handleCreateWebhook = async () => {
    if (!isShopifyConnected) {
      toast.error("Shopify not connected", {
        description: "Please connect to Shopify before creating webhooks."
      });
      return;
    }
    
    setIsCreating(true);
    
    // In a real app, this would call the API to create the webhook
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Webhook created", {
      description: `The ${newWebhook.topic} webhook has been created successfully.`
    });
    
    setIsCreating(false);
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
          {activeTab === 'existing' ? (
            <div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Coming Soon</AlertTitle>
                <AlertDescription>
                  This feature is under development. Check back later for a list of existing webhooks.
                </AlertDescription>
              </Alert>
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
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="format">Format</Label>
                <Select 
                  defaultValue="json" 
                  onValueChange={(value) => setNewWebhook(prev => ({ ...prev, format: value as "json" }))}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end">
          {activeTab === 'new' && (
            <Button onClick={handleCreateWebhook} disabled={!isShopifyConnected || isCreating}>
              {isCreating ? "Creating..." : "Create Webhook"}
            </Button>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
}
