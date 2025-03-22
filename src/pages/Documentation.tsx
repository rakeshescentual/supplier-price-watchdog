
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Book, BookOpen, CheckCircle, FileText, Link, Lightbulb, ShieldCheck } from 'lucide-react';
import { ShopifyComplianceChecklist } from '@/components/shopify/compliance/ShopifyComplianceChecklist';

export default function Documentation() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Documentation
          </h1>
          <p className="text-muted-foreground mt-1">
            Documentation and resources for the Escentual Supplier Price Watch app
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="shopify">
        <TabsList className="mb-4">
          <TabsTrigger value="shopify">
            <span className="flex items-center gap-1.5">
              Shopify
            </span>
          </TabsTrigger>
          <TabsTrigger value="gadget">
            <span className="flex items-center gap-1.5">
              Gadget
            </span>
          </TabsTrigger>
          <TabsTrigger value="escentual">
            <span className="flex items-center gap-1.5">
              Escentual API
            </span>
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <span className="flex items-center gap-1.5">
              Price Management
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="shopify" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Shopify Integration Guide
                  </CardTitle>
                  <CardDescription>
                    Documentation for Shopify integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <h3>Getting Started</h3>
                  <p>
                    This guide covers best practices for integrating with Shopify, with a focus on
                    requirements for Shopify Plus certification and the Built for Shopify program.
                  </p>
                  
                  <Separator className="my-4" />
                  
                  <h3>API Best Practices</h3>
                  <ul>
                    <li>
                      <strong>API Versioning:</strong> Always use the latest stable API version.
                    </li>
                    <li>
                      <strong>GraphQL:</strong> Use GraphQL for complex data needs, REST for simpler operations.
                    </li>
                    <li>
                      <strong>Rate Limiting:</strong> Implement backoff strategies and respect Shopify's leaky bucket algorithm.
                    </li>
                    <li>
                      <strong>Bulk Operations:</strong> Use bulk operations for large datasets.
                    </li>
                  </ul>
                  
                  <h3>Webhook Implementation</h3>
                  <p>
                    Webhooks are essential for real-time updates from Shopify. Implement these best practices:
                  </p>
                  <ul>
                    <li>
                      <strong>Security:</strong> Validate webhook signatures to ensure authenticity.
                    </li>
                    <li>
                      <strong>Response Time:</strong> Process webhooks quickly and respond with 200 OK.
                    </li>
                    <li>
                      <strong>Essential Topics:</strong> Implement critical webhooks like <code>app/uninstalled</code> and <code>shop/update</code>.
                    </li>
                    <li>
                      <strong>Error Handling:</strong> Implement robust error handling and retry mechanisms.
                    </li>
                  </ul>
                  
                  <h3>Shopify Plus Requirements</h3>
                  <p>
                    For Shopify Plus certification, ensure your app supports:
                  </p>
                  <ul>
                    <li>
                      <strong>Multi-Location Inventory:</strong> Support for multiple inventory locations.
                    </li>
                    <li>
                      <strong>B2B Functionality:</strong> Support for B2B price lists and customer-specific pricing.
                    </li>
                    <li>
                      <strong>Scripts Support:</strong> Creation and management of Shopify Scripts.
                    </li>
                    <li>
                      <strong>Flow Integration:</strong> Integration with Shopify Flow for automation.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ShopifyComplianceChecklist />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Built for Shopify Requirements
                </CardTitle>
                <CardDescription>
                  Key requirements for Shopify App Store approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Use versioned API calls</p>
                      <p className="text-sm text-muted-foreground">Always use dated API versions</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Implement OAuth properly</p>
                      <p className="text-sm text-muted-foreground">Use standard OAuth for authentication</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Handle rate limiting appropriately</p>
                      <p className="text-sm text-muted-foreground">Implement backoff strategies</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Implement essential webhooks</p>
                      <p className="text-sm text-muted-foreground">Support critical real-time notifications</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Secure customer data</p>
                      <p className="text-sm text-muted-foreground">Follow data protection best practices</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Security Best Practices
                </CardTitle>
                <CardDescription>
                  Security requirements for Shopify apps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Validate webhook signatures</p>
                      <p className="text-sm text-muted-foreground">Verify HMAC signatures on all webhook requests</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Implement session validation</p>
                      <p className="text-sm text-muted-foreground">Verify session tokens for all requests</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Secure API credentials</p>
                      <p className="text-sm text-muted-foreground">Never expose API keys in client-side code</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Data encryption</p>
                      <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest and in transit</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Implement CSRF protection</p>
                      <p className="text-sm text-muted-foreground">Protect against cross-site request forgery</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Additional Resources
                </CardTitle>
                <CardDescription>
                  External resources for Shopify development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a 
                    href="https://shopify.dev/docs" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col gap-1 p-4 border rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-medium flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      Shopify Developer Documentation
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Official documentation for Shopify API and app development
                    </p>
                  </a>
                  
                  <a 
                    href="https://shopify.dev/docs/apps/auth" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col gap-1 p-4 border rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-medium flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      Authentication Guide
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Learn about implementing OAuth for Shopify apps
                    </p>
                  </a>
                  
                  <a 
                    href="https://shopify.dev/docs/apps/webhooks" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col gap-1 p-4 border rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-medium flex items-center gap-1.5">
                      <Link className="h-4 w-4" />
                      Webhooks Documentation
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Detailed guide for implementing Shopify webhooks
                    </p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="gadget">
          {/* Gadget documentation content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Gadget.dev Integration Documentation</CardTitle>
              <CardDescription>
                Learn about integrating with Gadget.dev
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Gadget.dev documentation content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="escentual">
          {/* Escentual API documentation content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Escentual API Documentation</CardTitle>
              <CardDescription>
                Learn about integrating with Escentual's internal APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Escentual API documentation content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing">
          {/* Price management documentation content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Price Management Documentation</CardTitle>
              <CardDescription>
                Learn about the price management features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Price management documentation content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
