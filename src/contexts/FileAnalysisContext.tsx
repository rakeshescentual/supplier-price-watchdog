import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { processFile, getAnomalyStats, mergeWithShopifyData, exportToShopifyFormat } from "@/lib/excel";
import { generateAIAnalysis } from "@/lib/aiAnalysis";
import { toast } from "sonner";
import type { PriceItem, PriceAnalysis } from "@/types/price";
import { useShopify } from "./ShopifyContext";
import { useMarketData } from "@/hooks/useMarketData";

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
  priceIncreaseEffectiveDate: Date;
  setPriceIncreaseEffectiveDate: (date: Date) => void;
  summary: {
    totalItems: number;
    increasedItems: number;
    decreasedItems: number;
    discontinuedItems: number;
    newItems: number;
    anomalyItems: number;
    unchangedItems: number;
    potentialSavings: number;
    potentialLoss: number;
  };
  handleFileAccepted: (file: File) => Promise<void>;
  analyzeData: (data: PriceItem[]) => Promise<PriceAnalysis | void>;
  exportForShopify: () => void;
  setItems: (items: PriceItem[]) => void;
  enrichDataWithMarketInfo: () => Promise<PriceItem[] | void>;
  fetchCategoryTrends: (category: string) => Promise<any | void>;
}

const defaultSummary = {
  totalItems: 0,
  increasedItems: 0,
  decreasedItems: 0,
  discontinuedItems: 0,
  newItems: 0,
  anomalyItems: 0,
  unchangedItems: 0,
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
  const [priceIncreaseEffectiveDate, setPriceIncreaseEffectiveDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  
  const { isShopifyConnected, loadShopifyData } = useShopify();

  const analyzeData = useCallback(async (data: PriceItem[]): Promise<PriceAnalysis | void> => {
    if (data.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const result = await generateAIAnalysis(data);
      setAnalysis(result);
      
      toast.success("AI analysis complete", {
        description: "Insights and recommendations are ready.",
      });
      
      return result;
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Error generating AI analysis", {
        description: "Please try again later.",
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const { 
    isEnrichingData, 
    isFetchingTrends, 
    marketTrends,
    enrichDataWithMarketInfo,
    fetchCategoryTrends
  } = useMarketData(items, setItems, analyzeData);

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
          console.error("Shopify data loading error:", shopifyError);
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
      console.error("File processing error:", error);
      toast.error("Error processing file", {
        description: "Please check the file format and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportForShopify = useCallback(() => {
    if (items.length === 0) {
      toast.error("No data to export", {
        description: "Please upload and process a price list first.",
      });
      return;
    }
    
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
      URL.revokeObjectURL(url); // Clean up
      
      toast.success("Export complete", {
        description: "Shopify-compatible price list has been downloaded.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error exporting data", {
        description: "Please try again later.",
      });
    }
  }, [items]);

  const getAnalysisSummary = useCallback(() => {
    if (items.length === 0) return defaultSummary;
    
    const increased = items.filter(item => item.status === 'increased');
    const decreased = items.filter(item => item.status === 'decreased');
    const discontinued = items.filter(item => item.status === 'discontinued');
    const newItems = items.filter(item => item.status === 'new');
    const anomalies = items.filter(item => item.status === 'anomaly');
    const unchanged = items.filter(item => item.status === 'unchanged');

    return {
      totalItems: items.length,
      increasedItems: increased.length,
      decreasedItems: decreased.length,
      discontinuedItems: discontinued.length,
      newItems: newItems.length,
      anomalyItems: anomalies.length,
      unchangedItems: unchanged.length,
      potentialSavings: Math.abs(decreased.reduce((acc, item) => acc + (item.potentialImpact || 0), 0)),
      potentialLoss: Math.abs(increased.reduce((acc, item) => acc + (item.potentialImpact || 0), 0)),
    };
  }, [items]);

  const summary = getAnalysisSummary();

  const value: FileAnalysisContextValue = {
    file,
    items,
    isProcessing,
    analysis,
    isAnalyzing,
    isEnrichingData,
    marketTrends,
    isFetchingTrends,
    priceIncreaseEffectiveDate,
    setPriceIncreaseEffectiveDate,
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
