
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, ChevronLeft, ChevronRight, Bookmark, Search, X, Lightbulb } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";
import gadgetIntegrationGuide from '../assets/docs/Gadget_Integration_Guide.md?raw';
import technicalDocumentation from '../assets/docs/TechnicalDocumentation.md?raw';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState<string>("technical");
  const [bookmarks, setBookmarks] = useState<{[key: string]: string[]}>({
    technical: [],
    gadget: []
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    technical: number;
    gadget: number;
  }>({ technical: 0, gadget: 0 });
  const [quickRefOpen, setQuickRefOpen] = useState<boolean>(false);

  // Filter docs based on search term
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults({ technical: 0, gadget: 0 });
      return;
    }
    
    // Count how many matches in each doc
    const technicalMatches = (technicalDocumentation.match(new RegExp(searchTerm, 'gi')) || []).length;
    const gadgetMatches = (gadgetIntegrationGuide.match(new RegExp(searchTerm, 'gi')) || []).length;
    
    setSearchResults({
      technical: technicalMatches,
      gadget: gadgetMatches
    });
    
    // If current tab has no results but other tab does, suggest switching
    if (searchResults[activeTab as 'technical' | 'gadget'] === 0 && 
        searchResults[activeTab === 'technical' ? 'gadget' : 'technical'] > 0) {
      toast.info("No results in current tab", {
        description: `Try the ${activeTab === 'technical' ? 'Gadget.dev Integration' : 'Technical Documentation'} tab`,
        action: {
          label: "Switch",
          onClick: () => setActiveTab(activeTab === 'technical' ? 'gadget' : 'technical')
        }
      });
    }
  }, [searchTerm, activeTab]);

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Documentation downloaded", {
      description: `${filename} has been downloaded to your device.`
    });
  };

  const toggleBookmark = (section: string) => {
    // In a real implementation, this would save the current scroll position
    // and add it to the bookmarks list
    const newBookmark = `Section ${bookmarks[activeTab].length + 1}`;
    setBookmarks({
      ...bookmarks,
      [activeTab]: [...bookmarks[activeTab], newBookmark]
    });
    
    toast.success("Bookmark added", {
      description: "You can access this section from the bookmark menu below."
    });
  };

  const renderDocNavigationControls = () => (
    <div className="flex justify-between items-center mb-4">
      <Button variant="outline" size="sm">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous Section
      </Button>
      <Button variant="outline" size="sm" onClick={() => toggleBookmark(activeTab)}>
        <Bookmark className="h-4 w-4 mr-2" />
        Bookmark
      </Button>
      <Button variant="outline" size="sm">
        Next Section
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  // Quick reference guide content
  const quickReferenceContent = () => {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-amber-800 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
            Quick Reference Guide
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setQuickRefOpen(false)} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {activeTab === "technical" ? (
          <div className="space-y-2">
            <p className="font-medium text-amber-800">Common Tasks:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700">
              <li>Upload a price list: Navigate to File Upload page and select your Excel/PDF file</li>
              <li>Analyze price changes: Use the Price Table component and apply filters</li>
              <li>Connect to Shopify: Go to Settings page and enter your Shopify credentials</li>
              <li>Sync prices to Shopify: Select items in Price Table and use "Sync to Shopify" button</li>
              <li>Set up notifications: Use the Customer Notifications panel from the sidebar</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium text-amber-800">Gadget.dev Quick Reference:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700">
              <li>Configure Gadget: Go to Settings page and enter your Gadget App ID and API Key</li>
              <li>Process PDFs: Enable PDF processing in your Gadget app models</li>
              <li>Batch operations: Use performBatchOperations helper for efficient API usage</li>
              <li>Custom Gadget actions: Create actions for price analysis and synchronization</li>
              <li>Error handling: Check logs in Gadget dashboard for troubleshooting</li>
            </ul>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 bg-amber-100 hover:bg-amber-200 text-amber-800"
          onClick={() => handleDownload(activeTab === "technical" ? technicalDocumentation : gadgetIntegrationGuide, 
            activeTab === "technical" ? "TechnicalDocumentation.md" : "GadgetIntegrationGuide.md")}
        >
          <Download className="h-3 w-3 mr-2" />
          Download Full Guide
        </Button>
      </div>
    );
  };

  const renderSearchBar = () => (
    <div className="relative flex items-center mb-4">
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search documentation..."
        className="pl-8 pr-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 h-7 w-7 p-0"
          onClick={() => setSearchTerm("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      {searchTerm && (
        <div className="absolute right-10 text-xs text-muted-foreground">
          {searchResults[activeTab as 'technical' | 'gadget']} results
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4 mr-2" />
            {showSearch ? "Hide Search" : "Search Docs"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setQuickRefOpen(!quickRefOpen)}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Quick Reference
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="technical" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="technical">
            Technical Documentation
            {searchTerm && searchResults.technical > 0 && (
              <span className="ml-2 text-xs bg-primary/20 text-primary rounded-full px-1.5">
                {searchResults.technical}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="gadget">
            Gadget.dev Integration
            {searchTerm && searchResults.gadget > 0 && (
              <span className="ml-2 text-xs bg-primary/20 text-primary rounded-full px-1.5">
                {searchResults.gadget}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="technical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Documentation</CardTitle>
              <CardDescription>
                Complete technical overview of the Supplier Price Watch application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showSearch && renderSearchBar()}
              {quickRefOpen && quickReferenceContent()}
              {renderDocNavigationControls()}
              
              <ScrollArea className="h-[70vh] w-full pr-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>
                    {technicalDocumentation}
                  </ReactMarkdown>
                  
                  {/* Additional Usage Examples Section */}
                  <h2 id="usage-examples">Usage Examples</h2>
                  
                  <h3>Example 1: Analyzing a Price List</h3>
                  <p>Follow these steps to analyze a supplier price list:</p>
                  <ol>
                    <li>Navigate to the File Upload page</li>
                    <li>Click "Upload File" and select your price list (Excel or PDF)</li>
                    <li>The system will automatically process and display price changes</li>
                    <li>Use the filters to focus on specific changes (e.g., price increases only)</li>
                    <li>Review AI insights for recommended actions</li>
                  </ol>
                  <p>Expected outcome: A detailed breakdown of price changes with actionable insights.</p>
                  
                  <h3>Example 2: Sending Price Increase Notifications</h3>
                  <p>To notify customers about price increases:</p>
                  <ol>
                    <li>Navigate to the Google Workspace Integration page</li>
                    <li>Authenticate with your Google account if not already connected</li>
                    <li>Select "Create Price Increase Notification"</li>
                    <li>Choose which products to include in the notification</li>
                    <li>Customize the email template as needed</li>
                    <li>Click "Send Notification" to distribute to your customer list</li>
                  </ol>
                  
                  <h3>Example 3: Syncing with Shopify</h3>
                  <p>To update your Shopify store with new prices:</p>
                  <ol>
                    <li>Ensure your Shopify store is connected (via Settings page)</li>
                    <li>From the Price Analysis view, select the items to update</li>
                    <li>Click "Sync to Shopify" button</li>
                    <li>Review the changes before confirming</li>
                    <li>Confirm to push changes to your Shopify store</li>
                  </ol>
                  <p>Note: Changes will be reflected in your Shopify admin immediately but may take a few minutes to appear on your storefront.</p>
                  
                  <h2 id="testing">Testing and Quality Assurance</h2>
                  <p>The application includes a comprehensive test suite to ensure reliability:</p>
                  <ul>
                    <li><strong>Unit Tests:</strong> Run with <code>npm test</code> to verify individual components</li>
                    <li><strong>Integration Tests:</strong> Run with <code>npm run test:integration</code> to test API integrations</li>
                    <li><strong>End-to-End Tests:</strong> Run with <code>npm run test:e2e</code> to simulate user workflows</li>
                  </ul>
                  <p>When reviewing test results, focus on:</p>
                  <ul>
                    <li>Failed assertions that may indicate regression issues</li>
                    <li>Performance metrics for data processing operations</li>
                    <li>API response validation for external integrations</li>
                  </ul>
                  
                  <h2 id="deployment">Deployment Guide</h2>
                  <h3>Environment Configuration</h3>
                  <p>Before deployment, ensure these environment variables are configured:</p>
                  <pre><code>
VITE_SHOPIFY_API_KEY=your_shopify_api_key
VITE_GADGET_APP_ID=your_gadget_app_id
VITE_GADGET_API_KEY=your_gadget_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
                  </code></pre>
                  
                  <h3>Deployment Process</h3>
                  <ol>
                    <li>Build the production bundle: <code>npm run build</code></li>
                    <li>Test the production build locally: <code>npm run preview</code></li>
                    <li>Deploy using your preferred hosting service:
                      <ul>
                        <li>Netlify: Connect GitHub repository and configure build command</li>
                        <li>Vercel: Import from Git and set environment variables</li>
                        <li>AWS S3/CloudFront: Upload dist folder and configure CloudFront distribution</li>
                      </ul>
                    </li>
                    <li>Verify the deployment by testing all major features</li>
                  </ol>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {bookmarks.technical.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Bookmarks:</span>
                    {bookmarks.technical.map((bookmark, index) => (
                      <Button key={index} variant="ghost" size="sm">
                        {bookmark}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload(technicalDocumentation, 'TechnicalDocumentation.md')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Documentation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="gadget" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gadget.dev Integration Guide</CardTitle>
              <CardDescription>
                Detailed guide on how Gadget.dev is integrated into the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showSearch && renderSearchBar()}
              {quickRefOpen && quickReferenceContent()}
              {renderDocNavigationControls()}
              
              <ScrollArea className="h-[70vh] w-full pr-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>
                    {gadgetIntegrationGuide}
                  </ReactMarkdown>
                  
                  {/* Additional Gadget.dev Specific Usage Examples */}
                  <h2 id="gadget-examples">Gadget.dev Implementation Examples</h2>
                  
                  <h3>Example 1: Setting Up Gadget.dev for PDF Processing</h3>
                  <p>Follow these steps to configure PDF processing with Gadget.dev:</p>
                  <ol>
                    <li>Create a new Gadget.dev application in your dashboard</li>
                    <li>Add the Document Processing capability to your app</li>
                    <li>Create a new model for "PriceListDocument" with these fields:
                      <ul>
                        <li>file (File field)</li>
                        <li>processedData (JSON field)</li>
                        <li>status (Enum: pending, processing, completed, failed)</li>
                      </ul>
                    </li>
                    <li>Create a custom action "processPdf" that:
                      <ul>
                        <li>Takes a PDF file as input</li>
                        <li>Uses Gadget's document processing to extract table data</li>
                        <li>Transforms the data into the application's PriceItem format</li>
                        <li>Returns the structured data</li>
                      </ul>
                    </li>
                    <li>Connect your Gadget app to the Supplier Price Watch using the configuration form</li>
                  </ol>
                  
                  <h3>Example 2: Creating Batch Operations for Shopify Plus</h3>
                  <p>For efficient Shopify Plus integration via Gadget.dev:</p>
                  <ol>
                    <li>In your Gadget app, configure the Shopify connection</li>
                    <li>Create a "BatchOperation" model with:
                      <ul>
                        <li>items (JSON array field)</li>
                        <li>operationType (Enum: priceUpdate, inventoryUpdate, etc.)</li>
                        <li>status (Enum: pending, in-progress, completed, failed)</li>
                        <li>results (JSON field for operation results)</li>
                      </ul>
                    </li>
                    <li>Implement a "processBatch" action that:
                      <ul>
                        <li>Takes a batch of items and operation type</li>
                        <li>Processes in chunks to respect Shopify API limits</li>
                        <li>Handles errors with proper retries</li>
                        <li>Returns success/failure status with details</li>
                      </ul>
                    </li>
                  </ol>
                  
                  <h3>Example 3: Integrating Gadget with Google Workspace</h3>
                  <p>To set up Gadget as a bridge for Google Workspace:</p>
                  <ol>
                    <li>Add OAuth capability to your Gadget app for Google</li>
                    <li>Configure the Google Cloud Console:
                      <ul>
                        <li>Create OAuth credentials with appropriate redirect URIs</li>
                        <li>Enable Gmail and Calendar APIs</li>
                      </ul>
                    </li>
                    <li>In Gadget, create actions for:
                      <ul>
                        <li>"sendPriceNotification" - bridges to Gmail API</li>
                        <li>"scheduleEffectiveDate" - creates Calendar events</li>
                      </ul>
                    </li>
                    <li>Implement secure token storage and refresh mechanisms</li>
                  </ol>
                  
                  <h2 id="troubleshooting">Troubleshooting Gadget.dev Integration</h2>
                  <p>Common issues and their solutions:</p>
                  
                  <h3>Authentication Failures</h3>
                  <ul>
                    <li><strong>Problem:</strong> "Invalid API key" errors</li>
                    <li><strong>Solution:</strong> Verify API key in Settings page and ensure it has correct permissions</li>
                  </ul>
                  
                  <h3>PDF Processing Issues</h3>
                  <ul>
                    <li><strong>Problem:</strong> PDF processing returns incorrect or incomplete data</li>
                    <li><strong>Solution:</strong> Check PDF format and structure. Complex tables may require custom extraction logic in your Gadget action.</li>
                  </ul>
                  
                  <h3>Batch Operation Timeouts</h3>
                  <ul>
                    <li><strong>Problem:</strong> Large batch operations time out</li>
                    <li><strong>Solution:</strong> Reduce batch size in application settings or implement progressive chunking with status feedback</li>
                  </ul>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {bookmarks.gadget.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Bookmarks:</span>
                    {bookmarks.gadget.map((bookmark, index) => (
                      <Button key={index} variant="ghost" size="sm">
                        {bookmark}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => handleDownload(gadgetIntegrationGuide, 'GadgetIntegrationGuide.md')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Guide
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
