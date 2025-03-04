import { createContext, useContext, useState, ReactNode } from "react";
import { processFile, getAnomalyStats, mergeWithShopifyData, exportToShopifyFormat } from "@/lib/excel";
import { generateAIAnalysis } from "@/lib/aiAnalysis";
import { enrichDataWithSearch, getMarketTrends } from "@/lib/gadgetApi";
import { toast } from "sonner";
import type { PriceItem, PriceAnalysis } from "@/types/price";
import { useShopify } from "./ShopifyContext";

interface FileAnalysisProviderProps {
  children: ReactNode;
}

interface FileAnalysisContextValue {
  file: File | null;
  items: PriceItem[];
  isProcessing: boolean;
  analysis: PriceAnalysis | null;
  isAnalyzing: boolean;
  isEnrichingData: boolean;
  marketTrends: any | null;
  isFetchingTrends: boolean;
  summary: {
    totalItems: number;
    increasedItems: number;
    decreasedItems: number;
    discontinuedItems: number;
    newItems: number;
    anomalyItems: number;
    potentialSavings: number;
    potentialLoss: number;
  };
  handleFileAccepted: (file: File) => Promise<void>;
  analyzeData: (data: PriceItem[]) => Promise<void>;
  exportForShopify: () => void;
  setItems: (items: PriceItem[]) => void;
  enrichDataWithMarketInfo: () => Promise<void>;
  fetchCategoryTrends: (category: string) => Promise<void>;
}

const defaultSummary = {
  totalItems: 0,
  increasedItems: 0,
  decreasedItems: 0,
  discontinuedItems: 0,
  newItems: 0,
  anomalyItems: 0,
  potentialSavings: 0,
  potentialLoss: 0
};

const FileAnalysisContext = createContext<FileAnalysisContextValue | undefined>(undefined);

export const FileAnalysisProvider = ({ children }: FileAnalysisProviderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnrichingData, setIsEnrichingData] = useState(false);
  const [marketTrends, setMarketTrends] = useState<any | null>(null);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  
  const { isShopifyConnected, loadShopifyData } = useShopify();

  const handleFileAccepted = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setIsProcessing(true);
    setAnalysis(null);
    
    try {
      const processedItems = await processFile(acceptedFile);
      
      if (isShopifyConnected) {
        try {
          const shopifyProducts = await loadShopifyData();
          const mergedItems = mergeWithShopifyData(processedItems, shopifyProducts);
          setItems(mergedItems);
          
          const fileType = acceptedFile.type === 'application/pdf' ? 'PDF' : 'Excel';
          toast.success(`${fileType} analysis complete`, {
            description: "Price changes have been processed and merged with Shopify data.",
          });
          
          analyzeData(mergedItems);
        } catch (shopifyError) {
          toast.error("Error loading Shopify data", {
            description: "Using uploaded data only for analysis.",
          });
          setItems(processedItems);
          analyzeData(processedItems);
        }
      } else {
        setItems(processedItems);
        
        const fileType = acceptedFile.type === 'application/pdf' ? 'PDF' : 'Excel';
        toast.success(`${fileType} analysis complete`, {
          description: "Price changes have been processed successfully.",
        });
        
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

  const enrichDataWithMarketInfo = async () => {
    if (items.length === 0) return;
    
    setIsEnrichingData(true);
    try {
      const enrichedItems = await enrichDataWithSearch(items);
      setItems(enrichedItems);
      
      toast.success("Market data enrichment complete", {
        description: "Items have been enriched with market insights.",
      });
      
      // Update analysis with new data
      if (enrichedItems.length > 0) {
        analyzeData(enrichedItems);
      }
    } catch (error) {
      toast.error("Error enriching data", {
        description: "Could not fetch market data. Please try again later.",
      });
    } finally {
      setIsEnrichingData(false);
    }
  };

  const fetchCategoryTrends = async (category: string) => {
    setIsFetchingTrends(true);
    try {
      const trends = await getMarketTrends(category);
      setMarketTrends(trends);
      
      toast.success("Market trends fetched", {
        description: `Market trends for ${category} are now available.`,
      });
    } catch (error) {
      toast.error("Error fetching market trends", {
        description: "Could not fetch market trends. Please try again later.",
      });
    } finally {
      setIsFetchingTrends(false);
    }
  };

  const getAnalysisSummary = () => {
    if (items.length === 0) return defaultSummary;
    
    const increased = items.filter(item => item.status === 'increased');
    const decreased = items.filter(item => item.status === 'decreased');
    const discontinued = items.filter(item => item.status === 'discontinued');
    const newItems = items.filter(item => item.status === 'new');
    const anomalies = items.filter(item => item.status === 'anomaly');

    return {
      totalItems: items.length,
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

  const value = {
    file,
    items,
    isProcessing,
    analysis,
    isAnalyzing,
    isEnrichingData,
    marketTrends,
    isFetchingTrends,
    summary,
    handleFileAccepted,
    analyzeData,
    exportForShopify,
    setItems,
    enrichDataWithMarketInfo,
    fetchCategoryTrends
  };

  return (
    <FileAnalysisContext.Provider value={value}>
      {children}
    </FileAnalysisContext.Provider>
  );
};

export const useFileAnalysis = (): FileAnalysisContextValue => {
  const context = useContext(FileAnalysisContext);
  if (context === undefined) {
    throw new Error("useFileAnalysis must be used within a FileAnalysisProvider");
  }
  return context;
};
