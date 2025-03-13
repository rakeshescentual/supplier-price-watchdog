
import type { PriceItem, PriceAnalysis } from "@/types/price";

export interface AnalysisSummary {
  totalItems: number;
  increasedItems: number;
  decreasedItems: number;
  discontinuedItems: number;
  newItems: number;
  anomalyItems: number;
  unchangedItems: number;
  potentialSavings: number;
  potentialLoss: number;
}

export interface FileProcessingState {
  file: File | null;
  items: PriceItem[];
  isProcessing: boolean;
  setItems: (items: PriceItem[]) => void;
  handleFileAccepted: (file: File) => Promise<void>;
}

export interface AnalysisState {
  analysis: PriceAnalysis | null;
  isAnalyzing: boolean;
  isEnrichingData: boolean;
  marketTrends: any | null;
  isFetchingTrends: boolean;
  priceIncreaseEffectiveDate: Date;
  setPriceIncreaseEffectiveDate: (date: Date) => void;
  analyzeData: (data: PriceItem[]) => Promise<PriceAnalysis | void>;
  enrichDataWithMarketInfo: () => Promise<PriceItem[] | void>;
  fetchCategoryTrends: (category: string) => Promise<any | void>;
}

export interface ExportState {
  exportForShopify: () => void;
}

export interface FileAnalysisContextValue extends
  FileProcessingState,
  AnalysisState,
  ExportState {
  summary: AnalysisSummary;
}
