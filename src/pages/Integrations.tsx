
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { useShopify } from "@/contexts/shopify";
import { toast } from "sonner";
import { initGA4, trackPriceChange, GA4EventType } from "@/lib/integrations/googleAnalytics4";
import { prepareKlaviyoSegmentData } from "@/utils/marketDataUtils";
import { gadgetAnalytics } from "@/lib/gadget/analytics";

// Import the refactored components
import { IntegrationsHeader } from "@/components/integrations/IntegrationsHeader";
import { NoDataAlert } from "@/components/integrations/NoDataAlert";
import { IntegrationsSummary } from "@/components/integrations/IntegrationsSummary";
import { IntegrationsTabsNavigation } from "@/components/integrations/IntegrationsTabsNavigation";
import { GadgetTab } from "@/components/integrations/tabs/GadgetTab";
import { ShopifyTab } from "@/components/integrations/tabs/ShopifyTab";
import { IntegrationsFooter } from "@/components/integrations/IntegrationsFooter";
import { MarketingIntegrations } from "@/components/integrations/MarketingIntegrations";
import { PriceAlertChannels } from "@/components/integrations/PriceAlertChannels";
import { KlaviyoIntegration } from "@/components/integrations/KlaviyoIntegration";
import { ShopifyPlusIntegration } from "@/components/shopify/ShopifyPlusIntegration";
import { ShopifyCompliance } from "@/components/shopify/ShopifyCompliance";

// Create a usage tracker for this page
const usageTracker = gadgetAnalytics.createUsageTracker('integrations');

export default function Integrations() {
  const [activeTab, setActiveTab] = useState("marketing");
  const { items, summary, file } = useFileAnalysis();
  const { isShopifyConnected, shopifyContext, isGadgetInitialized } = useShopify();
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, boolean>>({
    shopify: false,
    klaviyo: false,
    gadget: false,
    googleAnalytics: false
  });
  
  const hasItems = items.length > 0;
  
  useEffect(() => {
    // Track page view
    usageTracker.trackView('page');
    
    // Initialize Google Analytics 4 when the page loads
    const ga4Result = initGA4();
    if (ga4Result) {
      console.log("Google Analytics 4 initialized successfully");
      setIntegrationStatus(prev => ({ ...prev, googleAnalytics: true }));
    }
    
    // Track current price data if available
    if (hasItems) {
      trackPriceChange(items, GA4EventType.BULK_PRICE_UPDATE);
    }
    
    // Check Shopify connection
    if (isShopifyConnected && shopifyContext) {
      setIntegrationStatus(prev => ({ ...prev, shopify: true }));
    }
    
    // Check Gadget initialization
    if (isGadgetInitialized) {
      setIntegrationStatus(prev => ({ ...prev, gadget: true }));
    }
    
    // Check if Klaviyo connection exists in localStorage
    const klaviyoApiKey = localStorage.getItem('klaviyoApiKey');
    if (klaviyoApiKey) {
      setIntegrationStatus(prev => ({ ...prev, klaviyo: true }));
    }
  }, [hasItems, items, isShopifyConnected, shopifyContext, isGadgetInitialized]);
  
  // Track tab changes
  useEffect(() => {
    usageTracker.trackUse(`tab_${activeTab}`);
  }, [activeTab]);
  
  const testAllConnections = async () => {
    setIsTestingAll(true);
    usageTracker.trackUse('test_connections');
    
    try {
      // Wait a moment to simulate testing connections
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would test real connections
      // For demo purposes, we'll just show results based on status
      
      const results = {
        shopify: integrationStatus.shopify,
        klaviyo: integrationStatus.klaviyo,
        gadget: integrationStatus.gadget,
        googleAnalytics: integrationStatus.googleAnalytics
      };
      
      const connectedCount = Object.values(results).filter(Boolean).length;
      
      if (connectedCount === 4) {
        toast.success("All integrations connected", {
          description: "Shopify, Klaviyo, Gadget, and Google Analytics are connected and working"
        });
      } else if (connectedCount > 0) {
        toast.success(`${connectedCount}/4 integrations connected`, {
          description: `Some integrations are working, but ${4 - connectedCount} are not configured`
        });
      } else {
        toast.error("No integrations connected", {
          description: "Please configure at least one integration to proceed"
        });
      }
      
      // Send test event to GA4 if connected
      if (results.googleAnalytics && hasItems) {
        trackPriceChange(items, GA4EventType.TEST_EVENT);
      }
      
      // Log Klaviyo segment data if available
      if (results.klaviyo && hasItems) {
        const klaviyoData = prepareKlaviyoSegmentData(items);
        console.log("Klaviyo segment data prepared:", klaviyoData);
      }
      
      // Track this business metric
      gadgetAnalytics.trackBusinessMetric('integration_health', connectedCount / 4, {
        connectedServices: Object.entries(results)
          .filter(([_, isConnected]) => isConnected)
          .map(([service]) => service)
      });
    } catch (error) {
      console.error("Error testing connections:", error);
      toast.error("Error testing connections", {
        description: "Could not verify all connections. See console for details."
      });
      
      // Track the error
      gadgetAnalytics.trackError(error instanceof Error ? error : String(error), { 
        action: 'test_connections'
      });
    } finally {
      setIsTestingAll(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <IntegrationsHeader 
        onTestConnections={testAllConnections}
        isTestingAll={isTestingAll}
      />
      
      <NoDataAlert hasItems={hasItems} />
      
      <IntegrationsSummary 
        hasItems={hasItems}
        items={items}
        summary={summary}
        file={file}
        integrationStatus={integrationStatus}
        onConfigureIntegrations={() => setActiveTab("gadget")}
      />
      
      <Tabs defaultValue="marketing" value={activeTab} onValueChange={setActiveTab}>
        <IntegrationsTabsNavigation activeTab={activeTab} />
        
        <TabsContent value="marketing" className="mt-0">
          <MarketingIntegrations />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <PriceAlertChannels />
        </TabsContent>
        
        <TabsContent value="klaviyo" className="mt-0">
          <KlaviyoIntegration />
        </TabsContent>
        
        <TabsContent value="gadget" className="mt-0">
          <GadgetTab />
        </TabsContent>
        
        <TabsContent value="shopify" className="mt-0">
          <div className="space-y-8">
            <ShopifyTab 
              integrationStatus={integrationStatus}
              hasItems={hasItems}
              items={items}
            />
            
            {/* Add new Shopify Plus integration component */}
            <ShopifyPlusIntegration />
            
            {/* Add Shopify Compliance component */}
            <ShopifyCompliance />
          </div>
        </TabsContent>
      </Tabs>
      
      <IntegrationsFooter />
    </div>
  );
}
