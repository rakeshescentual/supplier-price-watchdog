
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import technicalDocumentation from '../assets/docs/TechnicalDocumentation.md?raw';
import gadgetIntegrationGuide from '../assets/docs/Gadget_Integration_Guide.md?raw';
import { DocumentationHeader } from "@/components/documentation/DocumentationHeader";
import { DocumentationTabContent } from "@/components/documentation/DocumentationTabContent";

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

  // Additional content for Technical Documentation
  const technicalAdditionalContent = (
    <>
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
    </>
  );

  // Additional content for Gadget Documentation
  const gadgetAdditionalContent = (
    <>
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
    </>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <DocumentationHeader 
        onToggleSearch={() => setShowSearch(!showSearch)} 
        onToggleQuickRef={() => setQuickRefOpen(!quickRefOpen)}
        showSearch={showSearch}
      />
      
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
          <DocumentationTabContent 
            activeTab="technical"
            title="Technical Documentation"
            description="Complete technical overview of the Supplier Price Watch application"
            content={technicalDocumentation}
            bookmarks={bookmarks.technical}
            showSearch={showSearch}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchResults={searchResults}
            quickRefOpen={quickRefOpen}
            onQuickRefClose={() => setQuickRefOpen(false)}
            onBookmark={toggleBookmark}
            onDownload={handleDownload}
            additionalContent={technicalAdditionalContent}
            otherDocumentation={gadgetIntegrationGuide}
          />
        </TabsContent>
        
        <TabsContent value="gadget" className="mt-6">
          <DocumentationTabContent 
            activeTab="gadget"
            title="Gadget.dev Integration Guide"
            description="Detailed guide on how Gadget.dev is integrated into the application"
            content={gadgetIntegrationGuide}
            bookmarks={bookmarks.gadget}
            showSearch={showSearch}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchResults={searchResults}
            quickRefOpen={quickRefOpen}
            onQuickRefClose={() => setQuickRefOpen(false)}
            onBookmark={toggleBookmark}
            onDownload={handleDownload}
            additionalContent={gadgetAdditionalContent}
            otherDocumentation={technicalDocumentation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
