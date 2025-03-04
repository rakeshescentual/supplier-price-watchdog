
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { PriceTable } from "@/components/PriceTable";
import { AIAnalysis } from "@/components/AIAnalysis";
import { processExcelFile, getAnomalyStats, mergeWithShopifyData, exportToShopifyFormat } from "@/lib/excel";
import { generateAIAnalysis } from "@/lib/aiAnalysis";
import { initializeShopifyApp, getShopifyProducts } from "@/lib/shopifyApi";
import { toast } from "sonner";
import type { PriceItem, PriceAnalysis, ShopifyContext } from "@/types/price";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shopifyContext, setShopifyContext] = useState<ShopifyContext | null>(null);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isLoadingShopifyData, setIsLoadingShopifyData] = useState(false);

  // Initialize Shopify App if in Shopify Admin
  useEffect(() => {
    const initApp = async () => {
      try {
        // This would initialize the Shopify App Bridge in a real implementation
        initializeShopifyApp();
        
        // For demo purposes - in real implementation, this would come from App Bridge
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        
        if (shop) {
          setShopifyContext({
            shop,
            token: 'demo-token',
            isOnline: true
          });
          setIsShopifyConnected(true);
          toast.success("Connected to Shopify", {
            description: `Shop: ${shop}`,
          });
        }
      } catch (error) {
        console.error("Error initializing Shopify app:", error);
      }
    };
    
    initApp();
  }, []);

  const loadShopifyData = async () => {
    if (!shopifyContext) return;
    
    setIsLoadingShopifyData(true);
    try {
      const shopifyProducts = await getShopifyProducts(shopifyContext);
      toast.success("Shopify data loaded", {
        description: `${shopifyProducts.length} products loaded`,
      });
      
      // If we already have items from Excel, merge them with Shopify data
      if (items.length > 0) {
        const mergedItems = mergeWithShopifyData(items, shopifyProducts);
        setItems(mergedItems);
        
        // Re-run analysis with merged data
        analyzeData(mergedItems);
      }
    } catch (error) {
      toast.error("Error loading Shopify data", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsLoadingShopifyData(false);
    }
  };

  const handleFileAccepted = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setIsProcessing(true);
    setAnalysis(null);
    
    try {
      const processedItems = await processExcelFile(acceptedFile);
      
      // If we're connected to Shopify, merge with Shopify data
      if (isShopifyConnected && shopifyContext) {
        setIsLoadingShopifyData(true);
        try {
          const shopifyProducts = await getShopifyProducts(shopifyContext);
          const mergedItems = mergeWithShopifyData(processedItems, shopifyProducts);
          setItems(mergedItems);
          
          toast.success("Analysis complete", {
            description: "Price changes have been processed and merged with Shopify data.",
          });
          
          // Automatically start AI analysis
          analyzeData(mergedItems);
        } catch (shopifyError) {
          toast.error("Error loading Shopify data", {
            description: "Using Excel data only for analysis.",
          });
          setItems(processedItems);
          analyzeData(processedItems);
        } finally {
          setIsLoadingShopifyData(false);
        }
      } else {
        setItems(processedItems);
        
        toast.success("Analysis complete", {
          description: "Price changes have been processed successfully.",
        });
        
        // Automatically start AI analysis
        analyzeData(processedItems);
      }
    } catch (error) {
      toast.error("Error processing file", {
        description: "Please check the file format and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeData = async (data: PriceItem[]) => {
    if (data.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const result = await generateAIAnalysis(data);
      setAnalysis(result);
      
      toast.success("AI analysis complete", {
        description: "Insights and recommendations are ready.",
      });
    } catch (error) {
      toast.error("Error generating AI analysis", {
        description: "Please try again later.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportForShopify = () => {
    if (items.length === 0) return;
    
    try {
      const shopifyData = exportToShopifyFormat(items);
      const blob = new Blob([shopifyData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'shopify_price_update.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export complete", {
        description: "Shopify-compatible price list has been downloaded.",
      });
    } catch (error) {
      toast.error("Error exporting data", {
        description: "Please try again later.",
      });
    }
  };

  const getAnalysisSummary = () => {
    const increased = items.filter(item => item.status === 'increased');
    const decreased = items.filter(item => item.status === 'decreased');
    const discontinued = items.filter(item => item.status === 'discontinued');
    const newItems = items.filter(item => item.status === 'new');
    const anomalies = items.filter(item => item.status === 'anomaly');

    return {
      increasedItems: increased.length,
      decreasedItems: decreased.length,
      discontinuedItems: discontinued.length,
      newItems: newItems.length,
      anomalyItems: anomalies.length,
      potentialSavings: increased.reduce((acc, item) => acc + (item.potentialImpact || 0), 0),
      potentialLoss: discontinued.reduce((acc, item) => acc + (item.potentialImpact || 0), 0),
    };
  };

  const summary = getAnalysisSummary();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4 animate-fade-up">
        <h1 className="text-4xl font-bold tracking-tight">Supplier Price Watch</h1>
        <p className="text-lg text-muted-foreground">
          Upload your supplier price list to analyze changes and potential impacts
        </p>
        {isShopifyConnected && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Connected to Shopify
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </div>

      {(isProcessing || isLoadingShopifyData) && (
        <div className="text-center text-muted-foreground">
          {isProcessing ? "Processing file..." : "Loading Shopify data..."}
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="flex justify-end">
            <Button 
              onClick={exportForShopify}
              className="bg-[#5E8E3E] hover:bg-[#4a7331]"
            >
              <Download className="mr-2 h-4 w-4" />
              Export for Shopify
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AnalysisSummary {...summary} />
            </div>
            <div className="md:col-span-1">
              <AIAnalysis analysis={analysis} isLoading={isAnalyzing} />
            </div>
          </div>
          <PriceTable items={items} />
        </>
      )}
    </div>
  );
};

export default Index;
