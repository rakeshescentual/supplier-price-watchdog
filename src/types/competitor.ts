
export interface CompetitorPriceItem {
  id: string;
  sku: string;
  name: string;
  retailPrice: number;  // This is equivalent to "newPrice" in other contexts
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
  priceHistory?: {
    date: Date;
    price: number;
  }[];
}

// Updating CompetitorInsight to ensure all used properties are properly typed
export interface CompetitorInsight {
  id: string;
  title: string;
  description: string;
  impactScore: number; // 1-10
  category: 'pricing' | 'trend' | 'opportunity' | 'threat';
  relatedProducts: string[]; // SKUs
  timestamp: Date;
  isRead?: boolean;
  
  // Additional fields used in AICompetitorInsights component
  type: 'opportunity' | 'risk' | 'trend' | 'alert';
  recommendations?: string[];
  metrics?: Record<string, string | number>;
  affectedProducts?: string[];
  date?: string; // Used in some places
}

export interface PriceOptimizationSuggestion {
  id: string;
  sku: string;
  productName: string;
  currentPrice: number;
  suggestedPrice: number;
  potentialRevenue: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  competitorContext: string;
  
  // Additional fields used in AICompetitorInsights component
  name: string; 
  change: number;
  recommendedPrice: number;
  reason: string;
}

// Update ScrapingSchedule to align frequency values between form and interface
export interface ScrapingSchedule {
  id: string;
  name: string; 
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'custom';
  startDate: Date;
  nextRun: Date;
  lastRun: Date | null;
  competitors: string[];
  status: 'active' | 'paused' | 'completed';
  productCategories?: string[];
  cronExpression?: string;
  
  // Additional fields used in components and services
  url?: string;
  times?: string[];
  active?: boolean;
  priority?: 'low' | 'medium' | 'high';
  selectors?: Record<string, string>;
  productCount?: number;
  lastSuccess?: boolean;
  errorRate?: number;
}

export interface CompetitorSelectors {
  name: string;
  priceSelector: string;
  stockSelector?: string;
  imageSelector?: string;
  descriptionSelector?: string;
  variationsSelector?: string;
}

export interface CompetitorScrapingJob {
  id: string;
  scheduleId?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date | null;
  itemsProcessed?: number;
  itemsTotal?: number;
  errorCount?: number;
  errors?: string[];
  
  // Additional fields used in services
  competitor?: string;
  url?: string;
  priority?: 'low' | 'medium' | 'high';
  productsFound?: number;
  productsScraped?: number;
}
