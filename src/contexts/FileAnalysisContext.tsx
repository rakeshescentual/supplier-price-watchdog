
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceItem, PriceAnalysis } from '@/types/price';
import { useMarketData } from '@/hooks/market-data';

interface FileAnalysisContextProps {
  file: File | null;
  items: PriceItem[];
  summary: any;
  analysis: PriceAnalysis | null;
  isProcessing: boolean;
  isAnalyzing: boolean;
  setItems: (items: PriceItem[]) => void;
  setSummary: (summary: any) => void;
  setAnalysis: (analysis: PriceAnalysis | null) => void;
  isEnrichingData: boolean;
  isFetchingTrends: boolean;
  isAnalyzingPatterns: boolean;
  marketTrends: any | null;
  lastError: string | null;
  crossSupplierTrends: any;
  categoryAnalysis: any;
  supplierAnalysis: any;
  advancedAnalysis: any;
  priceIncreaseEffectiveDate: Date;
  setPriceIncreaseEffectiveDate: (date: Date) => void;
  enrichDataWithMarketInfo: () => Promise<PriceItem[] | void>;
  fetchCategoryTrends: (category: string) => Promise<any | void>;
  analyzeAdvancedPatterns: () => Promise<void>;
  batchProcessItems: <T, R>(processFn: (item: T) => Promise<R>) => Promise<R[]>;
  clearError: () => void;
  handleFileAccepted: (file: File) => void;
  exportForShopify: () => void;
}

const FileAnalysisContext = createContext<FileAnalysisContextProps | undefined>(undefined);

export const FileAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceIncreaseEffectiveDate, setPriceIncreaseEffectiveDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  
  const handleFileAccepted = (acceptedFile: File) => {
    setFile(acceptedFile);
    setIsProcessing(true);
    // In a real implementation, this would process the file
    // For now, we'll just set isProcessing to false after a delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };
  
  const exportForShopify = () => {
    // In a real implementation, this would export data for Shopify
    console.log("Exporting data for Shopify...");
  };
  
  const {
    isEnrichingData,
    isFetchingTrends,
    isAnalyzingPatterns,
    marketTrends,
    lastError,
    crossSupplierTrends,
    categoryAnalysis,
    supplierAnalysis,
    advancedAnalysis,
    enrichDataWithMarketInfo,
    fetchCategoryTrends,
    analyzeAdvancedPatterns,
    batchProcessItems,
    clearError
  } = useMarketData(
    items, 
    setItems, 
    async (items: PriceItem[]) => {
      // Mock implementation for analysis
      setIsAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAnalysis = { insights: "Sample analysis" };
      setAnalysis(mockAnalysis as any);
      setIsAnalyzing(false);
      return mockAnalysis as any;
    }
  );

  useEffect(() => {
    console.log("FileAnalysisContext items updated:", items.length);
  }, [items]);

  const value: FileAnalysisContextProps = {
    file,
    items,
    summary,
    analysis,
    isProcessing,
    isAnalyzing,
    setItems,
    setSummary,
    setAnalysis,
    isEnrichingData,
    isFetchingTrends,
    isAnalyzingPatterns,
    marketTrends,
    lastError,
    crossSupplierTrends,
    categoryAnalysis,
    supplierAnalysis,
    advancedAnalysis,
    priceIncreaseEffectiveDate,
    setPriceIncreaseEffectiveDate,
    enrichDataWithMarketInfo,
    fetchCategoryTrends,
    analyzeAdvancedPatterns,
    batchProcessItems,
    clearError,
    handleFileAccepted,
    exportForShopify
  };

  return (
    <FileAnalysisContext.Provider value={value}>
      {children}
    </FileAnalysisContext.Provider>
  );
};

export const useFileAnalysis = () => {
  const context = useContext(FileAnalysisContext);
  if (!context) {
    throw new Error("useFileAnalysis must be used within a FileAnalysisProvider");
  }
  return context;
};
