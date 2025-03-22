import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { Zap, Play, PlusCircle, Download, Upload } from 'lucide-react';
import { createShopifyFlow } from '@/lib/gadget/shopify-integration';
import { useShopify } from '@/contexts/shopify';

interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
}

const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: 'price-change-notification',
    name: 'Price Change Notification',
    description: 'Send notifications when product prices change',
    trigger: 'products/update',
    category: 'pricing',
    complexity: 'simple'
  },
  {
    id: 'bulk-price-schedule',
    name: 'Bulk Price Schedule',
    description: 'Schedule price changes for specific dates',
    trigger: 'scheduled',
    category: 'pricing',
    complexity: 'medium'
  },
  {
    id: 'competitive-price-match',
    name: 'Competitive Price Match',
    description: 'Automatically adjust prices based on competitor data',
    trigger: 'shopify/bulk_operations/finish',
    category: 'pricing',
    complexity: 'complex'
  },
  {
    id: 'low-stock-price-adjust',
    name: 'Low Stock Price Adjustment',
    description: 'Adjust prices when inventory gets low',
    trigger: 'inventory_levels/update',
    category: 'inventory',
    complexity: 'medium'
  }
];

export function FlowsAutomation() {
  const [activeTab, setActiveTab] = useState('templates');
  const [deploying, setDeploying] = useState<string | null>(null);
  const { isShopifyConnected, shopifyContext } = useShopify();
  const { toast } = useToast();

  const deployFlow = async (templateId: string) => {
    if (!isShopifyConnected || !shopifyContext) {
      toast({
        variant: 'destructive',
        title: 'Shopify not connected',
        description: 'Connect to Shopify to deploy flows'
      });
      return;
    }
    
    setDeploying(templateId);
    try {
      const template = FLOW_TEMPLATES.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');
      
      const result = await createShopifyFlow(shopifyContext.shop);
      
      if (result.success) {
        toast({
          title: 'Flow deployed',
          description: `Successfully deployed "${template.name}" to Shopify`
        });
      } else {
        throw new Error('Failed to deploy flow');
      }
    } catch (error) {
      console.error('Error deploying flow:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to deploy flow',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setDeploying(null);
    }
  };

  const getComplexityColor = (complexity: FlowTemplate['complexity']) => {
    switch (complexity) {
      case 'simple': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'complex': return 'text-orange-500';
      default: return '';
    }
  };

  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Shopify Flows & Automation
          </CardTitle>
          <CardDescription>
            Connect to Shopify Plus to use automation features
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground">
          Connect to Shopify to manage flows and automation
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Shopify Flows & Automation
        </CardTitle>
        <CardDescription>
          Create and deploy automated workflows for your Shopify Plus store
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Custom Flows</TabsTrigger>
            <TabsTrigger value="active" className="flex-1">Active Flows</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="templates" className="p-0">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <Accordion type="single" collapsible className="w-full">
                {FLOW_TEMPLATES.map(template => (
                  <AccordionItem key={template.id} value={template.id}>
                    <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-md">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <Zap className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.trigger}</div>
                          </div>
                        </div>
                        <div className={`text-xs ${getComplexityColor(template.complexity)}`}>
                          {template.complexity}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-xs bg-muted px-2 py-1 rounded">
                            Category: {template.category}
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => deployFlow(template.id)}
                            disabled={deploying === template.id}
                          >
                            {deploying === template.id ? (
                              <>Deploying...</>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Deploy Flow
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="custom" className="p-0">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex flex-col items-center text-center max-w-md space-y-2">
                <Zap className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Create Custom Flow</h3>
                <p className="text-sm text-muted-foreground">
                  Build a custom flow from scratch or import an existing one from your Shopify store
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="active" className="p-0">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex flex-col items-center text-center max-w-md space-y-2">
                <Zap className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Active Flows</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any active flows yet. Deploy a template or create a custom flow.
                </p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Sync from Shopify
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
