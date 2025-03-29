
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/components/documentation/DocumentationLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, FileText, Search, Info, Download, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDownload = (docName: string) => {
    // Download functionality would be implemented here
    console.log(`Downloading ${docName}`);
  };

  return (
    <DocumentationLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-primary" />
              Documentation
            </h1>
            <p className="text-muted-foreground">
              Comprehensive guides for Supplier Price Watch features and functionality
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-100 text-blue-800">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            New to Supplier Price Watch? Start with our <a href="#quick-start" className="text-blue-600 font-medium hover:underline">Quick Start Guide</a> or watch our <a href="#tutorials" className="text-blue-600 font-medium hover:underline">Video Tutorials</a>.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="user-guides" className="w-full">
          <TabsList className="mb-4 grid grid-cols-4 md:flex md:flex-wrap">
            <TabsTrigger value="user-guides" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              User Guides
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Tutorials
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-240px)]">
            <TabsContent value="user-guides" className="space-y-4">
              <Card id="quick-start">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        Quick Start Guide
                        <Badge variant="outline" className="ml-2 text-xs">Essential</Badge>
                      </CardTitle>
                      <CardDescription>
                        Get started with Supplier Price Watch in 5 minutes
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('QuickStartGuide')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  <p>
                    Our 5-minute setup guide will help you get started with analyzing your first supplier price list 
                    and making informed pricing decisions.
                  </p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="/docs/QuickStartGuide" className="flex items-center">
                      View Guide
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        User Manual
                        <Badge variant="outline" className="ml-2 text-xs">Comprehensive</Badge>
                      </CardTitle>
                      <CardDescription>
                        Complete guide to all features and functionality
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('UserGuide')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  <p>
                    The comprehensive user manual covers all aspects of the Supplier Price Watch application, 
                    from basic navigation to advanced features.
                  </p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="/docs/UserGuide" className="flex items-center">
                      View Manual
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Documentation</CardTitle>
                  <CardDescription>
                    System architecture and technical details
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  <p>
                    Technical documentation about the application architecture, 
                    data flow, and integration points.
                  </p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="/docs/TechnicalDocumentation" className="flex items-center">
                      View Documentation
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Developer Workflows</CardTitle>
                  <CardDescription>
                    Guide for developers working with the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  <p>
                    Documentation for developers about code organization, component structure,
                    and development workflows.
                  </p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="/docs/DeveloperWorkflows" className="flex items-center">
                      View Documentation
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shopify Integration</CardTitle>
                  <CardDescription>
                    Connecting with your Shopify store
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  <p>
                    Learn how to connect Supplier Price Watch with your Shopify store 
                    and synchronize product data and price updates.
                  </p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="/docs/ShopifyIntegration" className="flex items-center">
                      View Guide
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gadget.dev Integration</CardTitle>
                  <CardDescription>
                    Enhanced functionality with Gadget.dev
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  <p>
                    Detailed guide for setting up and using the Gadget.dev integration
                    for enhanced PDF processing and batch operations.
                  </p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="/docs/Gadget_Integration_Guide" className="flex items-center">
                      View Guide
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tutorials" id="tutorials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>
                    Step-by-step video guides for common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our video tutorials provide visual step-by-step instructions for all major features.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Uploading Your First Price List</h3>
                      <p className="text-sm text-muted-foreground mb-2">3:45 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Connecting to Shopify</h3>
                      <p className="text-sm text-muted-foreground mb-2">4:20 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Market Insights Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-2">5:15 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Customer Notifications</h3>
                      <p className="text-sm text-muted-foreground mb-2">3:30 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default Documentation;
