
/**
 * Competitor Analysis Types
 */

export interface CompetitorPriceItem {
  id: string;
  sku: string;
  name: string;
  retailPrice: number;
  competitorPrices: {
    [key: string]: number | null; // e.g., "Boots": 19.99, "Harrods": null (not available)
  };
  competitorDiffs: {
    [key: string]: number; // percentage difference vs. our price
  };
  averageDiff: number; // average percentage difference across all competitors
  lastUpdated: string;
  crawlId?: string;
  category?: string;
  brand?: string;
  imageUrl?: string;
  url?: string;
  inStock?: boolean;
}

export interface ScrapingSchedule {
  id: string;
  name: string;
  url: string;
  selectors?: CompetitorSelectors;
  times: string[]; // e.g., ["09:00", "18:00"]
  active: boolean;
  lastRun: string | null;
  nextRun: string | null;
  frequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  productCount?: number;
  lastSuccess?: boolean;
  errorRate?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface CompetitorSelectors {
  productContainer?: string;
  productName?: string;
  productPrice?: string;
  productImage?: string;
  productSku?: string;
  productBrand?: string;
  productCategory?: string;
  productAvailability?: string;
  pagination?: string;
}

export interface CompetitorInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'alert';
  title: string;
  description: string;
  metrics?: Record<string, string | number>;
  recommendations?: string[];
  affectedProducts?: string[];
  date: string;
  confidence?: 'low' | 'medium' | 'high';
  impact?: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

export interface HistoricalPriceData {
  id: string;
  name: string;
  sku: string;
  prices: Array<{
    date: string;
    our_price: number;
    [competitor: string]: number | string; // e.g., "Boots": 19.99
  }>;
}

export interface CompetitorAnalysisData {
  items: CompetitorPriceItem[];
  scrapingSchedules: ScrapingSchedule[];
  insights: CompetitorInsight[];
  historicalData: HistoricalPriceData[];
  averageDifference: number;
  trackedProductsCount: number;
  competitorCount: number;
  lastUpdate: string | null;
  nextUpdate: string | null;
}

export interface PriceOptimizationSuggestion {
  sku: string;
  name: string;
  currentPrice: number;
  recommendedPrice: number;
  change: number; // percentage
  confidence: 'low' | 'medium' | 'high';
  reason: string;
  potentialRevenue?: number;
  competitorReference?: {
    name: string;
    price: number;
  };
}

export interface MarketOpportunityReport {
  generated: string;
  categoryReports: {
    category: string;
    itemCount: number;
    avgPriceDifference: number;
    competitiveness: 'high' | 'medium' | 'low' | 'insufficient-data';
    opportunities: {
      sku: string;
      name: string;
      priceDifference: number;
      potentialIncrease: string;
    }[];
    threats: {
      sku: string;
      name: string;
      priceDifference: number;
      lowestCompetitorPrice: string;
      competitor: string;
    }[];
  }[];
  summary: {
    totalItems: number;
    categoriesAnalyzed: number;
    overallCompetitiveness: number;
    topOpportunities: string;
    highestThreats: string;
  };
}

export interface CompetitorScrapingJob {
  id: string;
  competitor: string;
  url: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  productsFound?: number;
  productsScraped?: number;
  errors?: { message: string; url?: string }[];
  crawlId?: string;
  priority?: 'low' | 'medium' | 'high';
}
