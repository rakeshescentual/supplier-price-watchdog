
import { PriceItem } from "@/types/price";
import { toast } from "sonner";

// Mock implementations of functions missing from gadgetApi
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // Mock implementation
  return items.map(item => ({
    ...item,
    marketData: {
      pricePosition: ['low', 'average', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'average' | 'high',
      competitorPrices: [
        item.newPrice * 0.9,
        item.newPrice * 1.0,
        item.newPrice * 1.1,
      ],
      averagePrice: item.newPrice * 1.05,
      minPrice: item.newPrice * 0.9,
      maxPrice: item.newPrice * 1.2
    },
    category: item.category || ['Fragrance', 'Skincare', 'Makeup', 'Haircare'][Math.floor(Math.random() * 4)]
  }));
};

export const getMarketTrends = async (category: string): Promise<any> => {
  // Mock implementation
  return {
    category,
    trendData: {
      monthlyTrend: [10, 12, 15, 14, 17, 19],
      yearOverYear: 12.5,
      seasonality: 'high',
      marketShare: {
        yourBrand: 15,
        competitor1: 25,
        competitor2: 30,
        others: 30
      },
      priceIndexes: {
        average: 100,
        yourPosition: 95,
        recommendation: 102
      }
    },
    competitorAnalysis: {
      priceRanges: {
        low: [10, 15],
        medium: [15, 25],
        high: [25, 50]
      },
      leaders: ['Brand A', 'Brand B'],
      growingCompetitors: ['Brand C'],
      pricingStrategies: {
        premium: ['Brand A', 'Brand D'],
        value: ['Brand B', 'Brand E'],
        discount: ['Brand F']
      }
    },
    categoryTrends: {
      growing: category === 'Makeup' || category === 'Skincare',
      shrinking: category === 'Haircare',
      stable: category === 'Fragrance',
      innovations: ['Sustainable packaging', 'Natural ingredients'],
      seasonalFactors: ['Holiday promotions', 'Summer sales']
    }
  };
};

export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize = 50
): Promise<R[]> => {
  const results: R[] = [];
  const batches = [];
  
  // Split items into batches
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  // Process batches sequentially to avoid rate limiting
  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(processFn));
    results.push(...batchResults);
  }
  
  return results;
};

// New advanced analytics functions
export const analyzePriceVolatility = (items: PriceItem[]): { categoryVolatility: Record<string, number>, supplierVolatility: Record<string, number> } => {
  const categories = new Set<string>();
  const suppliers = new Set<string>();
  const categoryPriceChanges: Record<string, number[]> = {};
  const supplierPriceChanges: Record<string, number[]> = {};
  
  // Collect all categories and suppliers
  items.forEach(item => {
    if (item.category) categories.add(item.category);
    const supplier = item.newSupplierCode || item.vendor;
    if (supplier) suppliers.add(supplier);
  });
  
  // Initialize arrays
  Array.from(categories).forEach(category => {
    categoryPriceChanges[category] = [];
  });
  
  Array.from(suppliers).forEach(supplier => {
    supplierPriceChanges[supplier] = [];
  });
  
  // Calculate price changes
  items.forEach(item => {
    if (!item.oldPrice || !item.newPrice) return;
    
    const percentChange = ((item.newPrice - item.oldPrice) / item.oldPrice) * 100;
    
    if (item.category) {
      categoryPriceChanges[item.category].push(percentChange);
    }
    
    const supplier = item.newSupplierCode || item.vendor;
    if (supplier) {
      supplierPriceChanges[supplier].push(percentChange);
    }
  });
  
  // Calculate volatility (standard deviation of price changes)
  const calculateVolatility = (changes: number[]): number => {
    if (changes.length === 0) return 0;
    const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const squaredDiffs = changes.map(change => Math.pow(change - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / changes.length;
    return Math.sqrt(variance);
  };
  
  const categoryVolatility: Record<string, number> = {};
  const supplierVolatility: Record<string, number> = {};
  
  Array.from(categories).forEach(category => {
    categoryVolatility[category] = calculateVolatility(categoryPriceChanges[category]);
  });
  
  Array.from(suppliers).forEach(supplier => {
    supplierVolatility[supplier] = calculateVolatility(supplierPriceChanges[supplier]);
  });
  
  return { categoryVolatility, supplierVolatility };
};

export const identifyPricingPatterns = (items: PriceItem[]): { roundedPricing: number, psychologicalPricing: number } => {
  let roundedCount = 0;
  let psychologicalCount = 0;
  const totalPrices = items.filter(item => item.newPrice).length;
  
  items.forEach(item => {
    if (!item.newPrice) return;
    
    // Check for rounded prices (e.g., 10.00, 15.00)
    if (Math.round(item.newPrice) === item.newPrice) {
      roundedCount++;
    }
    
    // Check for psychological pricing (e.g., 9.99, 19.95)
    const cents = Math.round((item.newPrice % 1) * 100);
    if (cents === 99 || cents === 95 || cents === 98) {
      psychologicalCount++;
    }
  });
  
  const roundedPercentage = totalPrices > 0 ? (roundedCount / totalPrices) * 100 : 0;
  const psychologicalPercentage = totalPrices > 0 ? (psychologicalCount / totalPrices) * 100 : 0;
  
  return {
    roundedPricing: roundedPercentage,
    psychologicalPricing: psychologicalPercentage
  };
};

export const detectSeasonalPatterns = (items: PriceItem[]): { 
  categoriesWithSeasonalPricing: string[],
  highSeasonCategories: string[],
  lowSeasonCategories: string[]
} => {
  // In a real implementation, this would use historical data
  // For now, we'll use mock data based on categories
  
  const seasonalCategories = ['Fragrance', 'Skincare'];
  const highSeasonNow = ['Fragrance'];
  const lowSeasonNow = ['Haircare'];
  
  const categoriesWithSeasonalPricing = items
    .filter(item => item.category && seasonalCategories.includes(item.category))
    .map(item => item.category as string)
    .filter((category, index, self) => self.indexOf(category) === index);
  
  return {
    categoriesWithSeasonalPricing,
    highSeasonCategories: highSeasonNow,
    lowSeasonCategories: lowSeasonNow
  };
};
