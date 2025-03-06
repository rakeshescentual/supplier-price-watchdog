
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Info, Code, Package, Server, Database, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { isGadgetInitialized } from "@/lib/gadgetApi";

export default function GadgetDocumentation() {
  const isConnected = isGadgetInitialized();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gadget.dev Integration</h1>
          <p className="text-muted-foreground max-w-2xl">
            Comprehensive documentation about how Supplier Price Watch integrates with Gadget.dev
            to enhance Shopify connectivity, PDF processing, and data enrichment.
          </p>
        </div>
        <div className="flex gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Gadget.dev Connected
            </div>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/gadget-settings" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Configure Gadget.dev
              </Link>
            </Button>
          )}
          <Button variant="outline" size="icon" asChild>
            <a href="https://gadget.dev/docs" target="_blank" rel="noopener noreferrer" aria-label="Open Gadget.dev documentation">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle>Integration Overview</AlertTitle>
        <AlertDescription>
          This guide explains how our application leverages Gadget.dev for enhanced features.
          Gadget.dev provides serverless backend functionality with specific optimizations for
          Shopify Plus stores and data processing workflows.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shopify">Shopify Integration</TabsTrigger>
          <TabsTrigger value="pdf">PDF Processing</TabsTrigger>
          <TabsTrigger value="data">Data Enrichment</TabsTrigger>
          <TabsTrigger value="code">Code Samples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Gadget.dev?</CardTitle>
              <CardDescription>
                A serverless backend platform optimized for eCommerce applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Gadget.dev is a full-stack JavaScript platform that simplifies building web apps by providing
                a set of tools and services designed to work together seamlessly. It offers:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="flex items-start gap-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Server className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Serverless Backend</h3>
                    <p className="text-sm text-muted-foreground">
                      Run backend code without managing servers or infrastructure
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Managed Database</h3>
                    <p className="text-sm text-muted-foreground">
                      Store and query data with automatic scaling and backups
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">API Integrations</h3>
                    <p className="text-sm text-muted-foreground">
                      Built-in connections to services like Shopify and Klaviyo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Background Jobs</h3>
                    <p className="text-sm text-muted-foreground">
                      Process heavy workloads asynchronously without timeouts
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-muted">
                <AlertDescription>
                  In our application, Gadget.dev handles Shopify authentication, PDF processing, 
                  market data enrichment, and batch operations for product updates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our application uses a hybrid approach to Gadget.dev integration:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Configuration stored in localStorage for easy setup</li>
                  <li>Graceful fallbacks when Gadget is not available</li>
                  <li>Enhanced features when connected to Gadget.dev</li>
                  <li>Optimized for both development and production environments</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  To start using Gadget.dev with our application:
                </p>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Create a Gadget account at <a href="https://gadget.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">gadget.dev</a></li>
                  <li>Create a new Gadget application</li>
                  <li>Generate an API key from your Gadget dashboard</li>
                  <li>Enter your App ID and API key in our <Link to="/gadget-settings" className="text-blue-600 hover:underline">Gadget Settings</Link> page</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shopify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shopify Integration via Gadget</CardTitle>
              <CardDescription>
                How Gadget.dev enhances the Shopify connection experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Gadget.dev provides a streamlined approach to working with the Shopify API, 
                handling authentication, rate limiting, and data synchronization automatically.
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Key Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">Authentication</Badge>
                      <span>Simplified OAuth flow without managing tokens directly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">Rate Limiting</Badge>
                      <span>Automatic handling of Shopify API rate limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">Batch Operations</Badge>
                      <span>Efficiently process large numbers of product updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">Webhooks</Badge>
                      <span>Easy setup for Shopify webhook handling</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Shopify Plus Enhanced Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-800 mb-2">Scripts</h4>
                    <p className="text-sm text-purple-700">
                      Deploy and manage Shopify Scripts for dynamic pricing rules
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Flows</h4>
                    <p className="text-sm text-blue-700">
                      Create and manage Shopify Flows for price change automations
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2">Multi-location</h4>
                    <p className="text-sm text-green-700">
                      Manage inventory across multiple locations with synchronized pricing
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h4 className="font-medium text-amber-800 mb-2">B2B</h4>
                    <p className="text-sm text-amber-700">
                      Maintain separate B2B price lists with specialized discount rules
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>PDF Processing</CardTitle>
              <CardDescription>
                How Gadget.dev helps process supplier PDF price lists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Supplier price lists often come as PDF documents, which are difficult to process
                programmatically. Gadget.dev provides specialized capabilities for extracting structured
                data from these documents.
              </p>
              
              <div className="p-4 border rounded-lg mt-4">
                <h3 className="text-lg font-medium mb-2">PDF Processing Workflow</h3>
                <ol className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Badge>1</Badge>
                    <div>
                      <p className="font-medium">Upload PDF to Gadget</p>
                      <p className="text-sm text-muted-foreground">
                        The PDF file is securely uploaded to Gadget's file storage
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>2</Badge>
                    <div>
                      <p className="font-medium">OCR and Text Extraction</p>
                      <p className="text-sm text-muted-foreground">
                        Gadget processes the PDF using OCR to extract text content
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>3</Badge>
                    <div>
                      <p className="font-medium">Structured Data Extraction</p>
                      <p className="text-sm text-muted-foreground">
                        The text is analyzed to identify product codes, names, and pricing information
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>4</Badge>
                    <div>
                      <p className="font-medium">Data Normalization</p>
                      <p className="text-sm text-muted-foreground">
                        Extracted data is normalized into a consistent format
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>5</Badge>
                    <div>
                      <p className="font-medium">Return to Application</p>
                      <p className="text-sm text-muted-foreground">
                        The structured data is returned to our application for analysis
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Implementation Note</AlertTitle>
                <AlertDescription className="text-amber-700">
                  PDF processing requires the appropriate Gadget.dev models and actions to be configured.
                  The current integration uses simplified implementation for demonstration purposes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Enrichment</CardTitle>
              <CardDescription>
                Using Gadget.dev to enhance product data with market information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Beyond basic price analysis, our application uses Gadget.dev to enrich product data
                with market information, providing competitive context for pricing decisions.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Market Data Sources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">Web Search</Badge>
                      <span>Competitive pricing from online retailers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">API Integrations</Badge>
                      <span>Data from partner marketplaces and platforms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">Historical Data</Badge>
                      <span>Past pricing trends and seasonal patterns</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Data Enrichment Process</h3>
                  <ol className="space-y-2 list-decimal pl-5">
                    <li>Products are sent to Gadget.dev in batches</li>
                    <li>Gadget performs market research for each product</li>
                    <li>Competitive pricing information is extracted</li>
                    <li>Products are categorized and market position is determined</li>
                    <li>Enriched data is returned to the application</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-4">Data Enrichment Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Price Positioning</h4>
                    <p className="text-sm text-blue-700">
                      See how your prices compare to market averages
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2">Competitive Analysis</h4>
                    <p className="text-sm text-green-700">
                      Identify opportunities and threats from competitor pricing
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-800 mb-2">Demand Forecasting</h4>
                    <p className="text-sm text-purple-700">
                      Predict how price changes will affect customer demand
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Samples</CardTitle>
              <CardDescription>
                Implementation examples for common Gadget.dev integration patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="init">
                <TabsList className="mb-4">
                  <TabsTrigger value="init">Client Initialization</TabsTrigger>
                  <TabsTrigger value="pdf">PDF Processing</TabsTrigger>
                  <TabsTrigger value="batch">Batch Operations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="init" className="space-y-4">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre>{`// Initialize Gadget client
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) return null;

  // In production with Gadget SDK
  // import { createClient } from '@gadget-client/your-app-id';
  // return createClient({ 
  //   apiKey: config.apiKey,
  //   environment: config.environment 
  // });
  
  console.log(\`Initializing Gadget client for \${config.appId}\`);
  return { config, ready: true };
};

// Check if Gadget is initialized
export const isGadgetInitialized = () => {
  const client = initGadgetClient();
  return !!client?.ready;
};`}</pre>
                  </div>
                  
                  <div className="bg-slate-100 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Implementation Notes</h4>
                    <ul className="space-y-2 list-disc pl-5 text-sm">
                      <li>Store configuration securely in localStorage</li>
                      <li>Initialize client only when needed to prevent unnecessary API calls</li>
                      <li>Check for initialization before attempting operations</li>
                      <li>Use environment setting to support development and production</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="pdf" className="space-y-4">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre>{`// Process PDF files using Gadget
export const processPdfWithGadget = async (file: File) => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget client not initialized");
  }

  console.log("Processing PDF with Gadget...");
  
  // In production with Gadget SDK:
  // 1. Upload the PDF to Gadget
  // const formData = new FormData();
  // formData.append('file', file);
  // 
  // const response = await fetch(
  //   \`https://\${client.config.appId}.gadget.app/api/files/upload\`, 
  //   {
  //     method: 'POST',
  //     headers: { 'Authorization': \`Bearer \${client.config.apiKey}\` },
  //     body: formData
  //   }
  // );
  // 
  // const { fileId } = await response.json();
  //
  // 2. Process the PDF with a Gadget action
  // const result = await client.mutate.processPriceListPdf({ fileId });
  // return result.data.items;
  
  // For development, return placeholder data
  return [];
};`}</pre>
                  </div>
                  
                  <div className="bg-slate-100 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Implementation Notes</h4>
                    <ul className="space-y-2 list-disc pl-5 text-sm">
                      <li>Use Gadget's file upload API for securely handling PDFs</li>
                      <li>Create a custom Gadget action for PDF processing</li>
                      <li>Implement OCR and structured data extraction in your Gadget app</li>
                      <li>Return normalized data that matches your application's schema</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="batch" className="space-y-4">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre>{`// Perform batch operations on items
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options: {
    batchSize?: number;
    concurrency?: number;
    retryCount?: number;
    retryDelay?: number;
    onProgress?: (processed: number, total: number) => void;
  } = {}
) => {
  const {
    batchSize = 50,
    retryCount = 3,
    retryDelay = 1000,
    onProgress
  } = options;
  
  const results: R[] = [];
  const batches = [];
  
  // Split items into batches
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  // Process batches
  let processedCount = 0;
  const totalItems = items.length;
  
  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        let attempts = 0;
        let lastError;
        
        // Implement retry logic
        while (attempts < retryCount) {
          try {
            const result = await processFn(item);
            processedCount++;
            if (onProgress) onProgress(processedCount, totalItems);
            return result;
          } catch (error) {
            lastError = error;
            attempts++;
            if (attempts < retryCount) {
              await new Promise(resolve => 
                setTimeout(resolve, retryDelay)
              );
            }
          }
        }
        
        throw lastError; // All attempts failed
      })
    );
    
    results.push(...batchResults);
  }
  
  return results;
};`}</pre>
                  </div>
                  
                  <div className="bg-slate-100 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Implementation Notes</h4>
                    <ul className="space-y-2 list-disc pl-5 text-sm">
                      <li>Use batching to efficiently process large datasets</li>
                      <li>Implement retry logic to handle transient errors</li>
                      <li>Report progress to improve user experience</li>
                      <li>Control concurrency to respect API rate limits</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-between">
            <Button asChild>
              <Link to="/gadget-settings" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Configure Gadget.dev
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <a href="https://gadget.dev/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Gadget.dev Documentation
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
