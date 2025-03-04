import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { PriceTable } from "@/components/PriceTable";
import { AIAnalysis } from "@/components/AIAnalysis";
import { ShareDialog } from "@/components/ShareDialog";
import { processFile, getAnomalyStats, mergeWithShopifyData, exportToShopifyFormat } from "@/lib/excel";
import { generateAIAnalysis } from "@/lib/aiAnalysis";
import { initializeShopifyApp, getShopifyProducts, syncWithShopify } from "@/lib/shopifyApi";
import { initializeGadget, authenticateWithShopify } from "@/lib/gadgetApi";
import { toast } from "sonner";
import type { PriceItem, PriceAnalysis, ShopifyContext } from "@/types/price";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, FileUp, FileText, Info } from "lucide-react";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shopifyContext, setShopifyContext] = useState<ShopifyContext | null>(null);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isLoadingShopifyData, setIsLoadingShopifyData] = useState(false);
  const [isGadgetInitialized, setIsGadgetInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize Shopify App and Gadget if in Shopify Admin
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize Shopify App Bridge
        initializeShopifyApp();
        
        // For demo purposes - in real implementation, this would come from App Bridge
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        
        if (shop) {
          // Initialize Gadget
          const gadgetConfig = {
            apiKey: 'demo-gadget-key',
            appId: 'supplier-price-watch',
            environment: 'development' as const
          };
          
          const gadgetClient = initializeGadget(gadgetConfig);
          setIsGadgetInitialized(gadgetClient.isConnected);
          
          // Authenticate with Shopify via Gadget
          const context = await authenticateWithShopify(shop);
          if (context) {
            setShopifyContext(context);
            setIsShopifyConnected(true);
            toast.success("Connected to Shopify via Gadget.dev", {
              description: `Shop: ${shop}`,
            });
          }
        }
      } catch (error) {
        console.error("Error initializing app:", error);
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
      
      // If we already have items from the uploaded file, merge them with Shopify data
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
      const processedItems = await processFile(acceptedFile);
      
      // If we're connected to Shopify, merge with Shopify data
      if (isShopifyConnected && shopifyContext) {
        setIsLoadingShopifyData(true);
        try {
          const shopifyProducts = await getShopifyProducts(shopifyContext);
          const mergedItems = mergeWithShopifyData(processedItems, shopifyProducts);
          setItems(mergedItems);
          
          const fileType = acceptedFile.type === 'application/pdf' ? 'PDF' : 'Excel';
          toast.success(`${fileType} analysis complete`, {
            description: "Price changes have been processed and merged with Shopify data.",
          });
          
          // Automatically start AI analysis
          analyzeData(mergedItems);
        } catch (shopifyError) {
          toast.error("Error loading Shopify data", {
            description: "Using uploaded data only for analysis.",
          });
          setItems(processedItems);
          analyzeData(processedItems);
        } finally {
          setIsLoadingShopifyData(false);
        }
      } else {
        setItems(processedItems);
        
        const fileType = acceptedFile.type === 'application/pdf' ? 'PDF' : 'Excel';
        toast.success(`${fileType} analysis complete`, {
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

  const syncToShopify = async () => {
    if (!shopifyContext || items.length === 0) return;
    
    setIsSyncing(true);
    try {
      const result = await syncWithShopify(shopifyContext, items);
      
      if (result) {
        toast.success("Sync complete", {
          description: "Price changes have been synchronized to Shopify.",
        });
      } else {
        toast.error("Sync incomplete", {
          description: "Some items could not be synchronized.",
        });
      }
    } catch (error) {
      toast.error("Error syncing with Shopify", {
        description: "Please try again later.",
      });
    } finally {
      setIsSyncing(false);
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
  const fileStats = items.length > 0 ? {
    totalItems: items.length,
    increasedItems: summary.increasedItems,
    decreasedItems: summary.decreasedItems
  } : undefined;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-fade-up">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Supplier Price Watch</h1>
          <p className="text-lg text-muted-foreground">
            Upload your supplier price list to analyze changes and impacts
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
          <div className="flex gap-2">
            {isShopifyConnected && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Shopify Connected
              </div>
            )}
            {isGadgetInitialized && (
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Gadget Enabled
              </div>
            )}
          </div>
          
          <ShareDialog fileStats={fileStats} onExport={items.length > 0 ? exportForShopify : undefined} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </div>

      {(isProcessing || isLoadingShopifyData) && (
        <div className="text-center text-muted-foreground">
          {isProcessing ? "Processing file..." : "Loading Shopify data..."}
        </div>
      )}

      {file && items.length > 0 && (
        <>
          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
            <div className="p-2 rounded-full bg-primary/10">
              {file.type === 'application/pdf' ? (
                <FileText className="w-5 h-5 text-primary" />
              ) : (
                <FileUp className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{items.length} items analyzed</p>
            </div>
            <div className="flex gap-2">
              {isShopifyConnected && (
                <Button 
                  onClick={syncToShopify}
                  disabled={isSyncing}
                  className="bg-[#5E8E3E] hover:bg-[#4a7331]"
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? "Syncing..." : "Sync to Shopify"}
                </Button>
              )}
              <Button 
                onClick={exportForShopify}
                className="bg-[#5E8E3E] hover:bg-[#4a7331]"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Export for Shopify
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AnalysisSummary {...summary} />
            </div>
            <div className="md:col-span-1">
              <AIAnalysis analysis={analysis} isLoading={isAnalyzing} />
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-500" />
            <p>
              {isShopifyConnected 
                ? "This analysis is integrated with your Shopify store data. You can sync price changes directly or export them."
                : "You can export this analysis in Shopify-compatible format for easy importing."}
            </p>
          </div>
          
          <PriceTable items={items} />
        </>
      )}
      
      {!file && (
        <div className="text-center mt-12 p-8 border rounded-lg bg-muted/30">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">How it works</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload your supplier price list (Excel or PDF) to compare old vs new prices. 
            Supplier Price Watch will analyze price changes, identify anomalies, and calculate the potential impact on your business.
            {isShopifyConnected && " It also integrates with your Shopify store to provide tailored insights."}
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Upload file</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">AI Analysis</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Sync to Shopify</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
