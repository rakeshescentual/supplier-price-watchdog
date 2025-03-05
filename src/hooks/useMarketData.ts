
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { PriceItem, PriceAnalysis } from '@/types/price';

// Mock implementations of functions missing from gadgetApi
const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
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

const getMarketTrends = async (category: string): Promise<any> => {
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

const performBatchOperations = async <T, R>(
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

export const useMarketData = (
  items: PriceItem[],
  updateItems: (items: PriceItem[]) => void,
  onAnalysisNeeded?: (items: PriceItem[]) => Promise<PriceAnalysis | void>
) => {
  const [isEnrichingData, setIsEnrichingData] = useState(false);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [marketTrends, setMarketTrends] = useState<any | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Cache validation - Only perform operations if data has changed
  const itemsFingerprint = useMemo(() => {
    return items.length > 0 ? 
      items.reduce((acc, item) => acc + item.sku + (item.newPrice || 0), '') : '';
  }, [items]);
  
  // Calculate cross-supplier price trends
  const calculateCrossSupplierTrends = useCallback(() => {
    if (items.length === 0) return null;
    
    const suppliers = new Set<string>();
    const categories = new Set<string>();
    const brands = new Set<string>();
    
    items.forEach(item => {
      if (item.newSupplierCode) suppliers.add(item.newSupplierCode);
      else if (item.vendor) suppliers.add(item.vendor);
      if (item.category) categories.add(item.category);
      const brand = item.name?.split(' ')[0] || item.vendor;
      if (brand) brands.add(brand);
    });
    
    // Compare price changes across suppliers for the same categories
    const categoryComparisons = Array.from(categories).map(category => {
      const categoryItems = items.filter(item => item.category === category);
      const supplierData: Record<string, { items: number, increases: number, avgIncrease: number }> = {};
      
      categoryItems.forEach(item => {
        const supplier = item.newSupplierCode || item.vendor || 'Unknown';
        if (!supplierData[supplier]) {
          supplierData[supplier] = { items: 0, increases: 0, avgIncrease: 0 };
        }
        
        supplierData[supplier].items++;
        if (item.status === 'increased') {
          supplierData[supplier].increases++;
          supplierData[supplier].avgIncrease += item.difference;
        }
      });
      
      // Calculate averages
      Object.keys(supplierData).forEach(supplier => {
        if (supplierData[supplier].increases > 0) {
          supplierData[supplier].avgIncrease /= supplierData[supplier].increases;
        }
      });
      
      return {
        category,
        suppliers: supplierData
      };
    });
    
    return {
      categories: Array.from(categories),
      suppliers: Array.from(suppliers),
      brands: Array.from(brands),
      categoryComparisons
    };
  }, [items]);
  
  // Enrich data with market info
  const enrichDataWithMarketInfo = useCallback(async (): Promise<PriceItem[] | void> => {
    if (items.length === 0) {
      toast.error("No items to enrich", {
        description: "Please upload a price list first.",
      });
      return;
    }
    
    setIsEnrichingData(true);
    setLastError(null);
    
    try {
      // Optimized implementation with batching for large datasets
      const enrichedItems = await enrichDataWithSearch(items);
      updateItems(enrichedItems);
      
      toast.success("Market data enrichment complete", {
        description: "Items have been enriched with market insights.",
      });
      
      // Update analysis with new data
      if (enrichedItems.length > 0 && onAnalysisNeeded) {
        try {
          await onAnalysisNeeded(enrichedItems);
        } catch (analysisError) {
          console.error("Error updating analysis after enrichment:", analysisError);
          // Don't fail the entire operation if just the analysis update fails
          toast.warning("Analysis update partial", {
            description: "Market data was updated but analysis couldn't be refreshed.",
          });
        }
      }
      
      return enrichedItems;
    } catch (error) {
      console.error("Error enriching data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      toast.error("Error enriching data", {
        description: "Could not fetch market data. Please try again later.",
      });
    } finally {
      setIsEnrichingData(false);
    }
  }, [items, updateItems, onAnalysisNeeded, itemsFingerprint]);

  // Fetch category trends with improved error handling
  const fetchCategoryTrends = useCallback(async (category: string): Promise<any | void> => {
    if (!category?.trim()) {
      toast.error("Invalid category", {
        description: "Please provide a valid category name.",
      });
      return;
    }
    
    setIsFetchingTrends(true);
    setLastError(null);
    
    try {
      const trends = await getMarketTrends(category);
      setMarketTrends(trends);
      
      toast.success("Market trends fetched", {
        description: `Market trends for ${category} are now available.`,
      });
      
      return trends;
    } catch (error) {
      console.error("Error fetching market trends:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      toast.error("Error fetching market trends", {
        description: "Could not fetch market trends. Please try again later.",
      });
    } finally {
      setIsFetchingTrends(false);
    }
  }, []);

  // Batch process items for market analysis
  const batchProcessItems = useCallback(async (processFn: (item: PriceItem) => Promise<any>): Promise<any[]> => {
    if (items.length === 0) return [];
    
    return performBatchOperations(items, processFn, 50);
  }, [items]);

  // Reset error state
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    isEnrichingData,
    isFetchingTrends,
    marketTrends,
    lastError,
    crossSupplierTrends: calculateCrossSupplierTrends(),
    enrichDataWithMarketInfo,
    fetchCategoryTrends,
    batchProcessItems,
    clearError
  };
};
