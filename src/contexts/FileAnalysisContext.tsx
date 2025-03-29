import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceItem, PriceAnalysis } from '@/types/price';
import { useMarketData } from '@/hooks/market-data';

interface FileAnalysisContextProps {
  items: PriceItem[];
  summary: any;
  analysis: PriceAnalysis | null;
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
  enrichDataWithMarketInfo: () => Promise<PriceItem[] | void>;
  fetchCategoryTrends: (category: string) => Promise<any | void>;
  analyzeAdvancedPatterns: () => Promise<void>;
  batchProcessItems: <T, R>(processFn: (item: T) => Promise<R>) => Promise<R[]>;
  clearError: () => void;
}

const FileAnalysisContext = createContext<FileAnalysisContextProps | undefined>(undefined);

export const FileAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  
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
  } = useMarketData(items, setItems, setAnalysis);

  useEffect(() => {
    console.log("FileAnalysisContext items updated:", items.length);
  }, [items]);

  const value: FileAnalysisContextProps = {
    items,
    summary,
    analysis,
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
    enrichDataWithMarketInfo,
    fetchCategoryTrends,
    analyzeAdvancedPatterns,
    batchProcessItems,
    clearError
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
