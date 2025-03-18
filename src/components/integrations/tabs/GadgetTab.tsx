
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Cog, Database, Mail, ShoppingBag, Webhook } from "lucide-react";
import { GadgetConfigForm } from "@/components/GadgetConfigForm";

export const GadgetTab: React.FC = () => {
  const [gadgetTab, setGadgetTab] = useState("config");

  return (
    <div className="grid grid-cols-1 gap-8">
      <Tabs value={gadgetTab} onValueChange={setGadgetTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="mt-6">
          <GadgetConfigForm />
        </TabsContent>
        
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gadget.dev Integration Features</CardTitle>
              <CardDescription>
                Enhanced capabilities for Shopify Plus and Klaviyo integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Data Processing</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Process large datasets efficiently using Gadget's background job capabilities
                  </p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      PDF price list processing
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Batch operations for Shopify updates
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Cross-supplier trend analysis
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Shopify Plus Enhancement</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Extend Shopify Plus capabilities with custom actions and automation
                  </p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Script deployment for pricing rules
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Flow creation for business processes
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Multi-location inventory management
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <h3 className="font-medium">Klaviyo Integration</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhance Klaviyo with advanced segmentation and automation
                  </p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Advanced customer segmentation
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Scheduled email campaigns
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Personalized price change alerts
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">Webhooks & Events</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trigger actions when important events occur
                  </p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Price change notifications
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      Inventory alerts for discontinued items
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      New supplier upload processing
                    </li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Getting Started with Gadget.dev</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <p>Create an account at <a href="https://gadget.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">gadget.dev</a></p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <p>Create a new Gadget application for Supplier Price Watch</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                    <div>
                      <p>Generate an API key with appropriate permissions</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                    <div>
                      <p>Configure your Gadget application ID and API key in the Configuration tab</p>
                    </div>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation & Resources</CardTitle>
              <CardDescription>
                Learn more about Gadget.dev integration with Supplier Price Watch
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <iframe 
                src="/src/assets/docs/Gadget_Integration_Guide.md" 
                className="w-full h-[500px] border rounded"
                title="Gadget Integration Guide"
              ></iframe>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                For more information, visit the <a href="https://gadget.dev/docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Gadget Documentation</a>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
