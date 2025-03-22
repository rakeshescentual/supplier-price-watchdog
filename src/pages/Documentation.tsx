
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemCoreComponents } from '@/assets/docs/SystemCoreComponents.md';

const Documentation = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Documentation</h1>
      <p className="text-muted-foreground mb-8">
        Explore detailed information about the Escentual Price Watch application.
      </p>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="system">System Architecture</TabsTrigger>
          <TabsTrigger value="user">User Guide</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-240px)]">
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Core Components</CardTitle>
                <CardDescription>
                  Overview of the main technical components of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none dark:prose-invert">
                <div className="markdown-content">
                  <h2>Frontend Architecture</h2>
                  <p>
                    The Supplier Price Watch application is built with a modern React frontend using TypeScript, 
                    Tailwind CSS, and shadcn UI components. This combination provides a responsive, accessible, 
                    and visually consistent user interface.
                  </p>
                  
                  <h3>Key Technology Stack</h3>
                  <ul>
                    <li><strong>React</strong>: Core UI library</li>
                    <li><strong>TypeScript</strong>: For type safety and improved developer experience</li>
                    <li><strong>Tailwind CSS</strong>: Utility-first CSS framework for styling</li>
                    <li><strong>shadcn/ui</strong>: Component library built on Radix UI primitives</li>
                    <li><strong>React Router</strong>: For client-side routing</li>
                    <li><strong>React Query</strong>: For data fetching, caching, and state management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Flow Architecture</CardTitle>
                <CardDescription>
                  How data moves through the application
                </CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none dark:prose-invert">
                <div className="markdown-content">
                  <p>
                    The application follows a structured data flow pattern for handling price data:
                  </p>
                  <ol>
                    <li>User uploads a supplier price list</li>
                    <li>FileAnalysisContext processes the file</li>
                    <li>If connected to Shopify, data is matched with Shopify products</li>
                    <li>Analysis results are displayed to the user</li>
                    <li>User can take actions based on the analysis (update prices, notify customers, etc.)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  How to begin using the Price Watch application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The complete user guide will be implemented here with step-by-step instructions
                  for using all features of the application.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Technical documentation for application APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The complete API documentation will be implemented here, including
                  endpoints, request/response formats, and authentication requirements.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shopify Integration</CardTitle>
                <CardDescription>
                  Connecting with Shopify
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Documentation about integrating with Shopify, including authentication,
                  data synchronization, and webhook configuration.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gadget.dev Integration</CardTitle>
                <CardDescription>
                  Working with Gadget.dev
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Documentation about integrating with Gadget.dev for additional functionality
                  and data processing capabilities.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default Documentation;
