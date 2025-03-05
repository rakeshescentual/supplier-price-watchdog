import { PriceItem } from "@/types/price";
import { toast } from "sonner";

// Gadget-powered data enrichment function
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // This function would normally use the Gadget client to call a custom Gadget action
  // For mock implementation, we'll generate synthetic market data
  
  console.log(`Enriching ${items.length} items with market data via Gadget.dev`);
  
  try {
    // In production with Gadget:
    // const gadgetClient = initGadgetClient();
    // if (gadgetClient) {
    //   return await gadgetClient.mutate({
    //     enrichProductsWithMarketData: {
    //       input: { items },
    //       select: { result: true }
    //     }
    //   }).then(response => response.enrichProductsWithMarketData.result);
    // }
    
    // Mock implementation for demonstration
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
  } catch (error) {
    console.error("Error enriching data with Gadget:", error);
    toast.error("Data enrichment failed", {
      description: "Could not fetch market data. Falling back to basic analysis.",
    });
    
    // Return original items if Gadget enrichment fails
    return items;
  }
};

// Gadget-powered market trends retrieval
export const getMarketTrends = async (category: string): Promise<any> => {
  // In production, this would use the Gadget client to fetch real market trends
  console.log(`Fetching market trends for ${category} via Gadget.dev`);
  
  try {
    // In production with Gadget:
    // const gadgetClient = initGadgetClient();
    // if (gadgetClient) {
    //   return await gadgetClient.query({
    //     getCategoryMarketTrends: {
    //       input: { category },
    //       select: { trends: true }
    //     }
    //   }).then(response => response.getCategoryMarketTrends.trends);
    // }
    
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
  } catch (error) {
    console.error("Error fetching market trends with Gadget:", error);
    toast.error("Market trends retrieval failed", {
      description: "Could not fetch market trends. Please try again later.",
    });
    throw error;
  }
};

// Optimized batch operations via Gadget
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize = 50
): Promise<R[]> => {
  if (items.length === 0) return [];
  console.log(`Processing ${items.length} items in batches of ${batchSize}`);
  
  const results: R[] = [];
  const batches = [];
  const errors: any[] = [];
  
  // Split items into batches
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  // In production with Gadget, this might leverage Gadget's background jobs:
  // const gadgetClient = initGadgetClient();
  // if (gadgetClient && gadgetClient.config.featureFlags?.enableBackgroundJobs) {
  //   return await gadgetClient.mutate({
  //     processBatchOperations: {
  //       input: { items, operationType: "yourOperationType" },
  //       select: { results: true }
  //     }
  //   }).then(response => response.processBatchOperations.results);
  // }
  
  // Process batches sequentially to avoid rate limiting
  for (const [index, batch] of batches.entries()) {
    console.log(`Processing batch ${index + 1}/${batches.length}`);
    
    try {
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            return await processFn(item);
          } catch (itemError) {
            console.error(`Error processing item in batch ${index}:`, itemError);
            errors.push(itemError);
            // Return a placeholder or null for failed items
            return null as unknown as R;
          }
        })
      );
      
      // Filter out null results from errors
      const validResults = batchResults.filter(result => result !== null) as R[];
      results.push(...validResults);
      
      // Add small delay between batches to prevent rate limiting
      if (index < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (batchError) {
      console.error(`Error processing batch ${index}:`, batchError);
      errors.push(batchError);
    }
  }
  
  // Report any errors
  if (errors.length > 0) {
    console.warn(`Completed with ${errors.length} errors out of ${items.length} items`);
    if (errors.length < items.length) {
      toast.warning(`Processing completed with ${errors.length} errors`, {
        description: "Some items could not be processed. Check console for details.",
      });
    } else {
      toast.error("Processing failed", {
        description: "All items failed to process. Check console for details.",
      });
    }
  } else {
    console.log(`Successfully processed all ${items.length} items`);
  }
  
  return results.filter(Boolean) as R[];
};

// Price volatility analysis
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

// Pricing patterns identification
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

// Seasonal patterns detection
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

// Shopify Plus specific market data analysis
export const analyzeShopifyPlusMarketData = (items: PriceItem[]): {
  b2bPricingStrategy: string,
  multiLocationRecommendations: Record<string, any>[],
  scriptSuggestions: Record<string, any>[],
  flowSuggestions: Record<string, any>[]
} => {
  // This function would be powered by Gadget in production
  
  // Default implementation for demonstration
  const recommendedB2BStrategy = items.some(item => item.marketData?.pricePosition === 'high') 
    ? 'premium' 
    : items.some(item => item.marketData?.pricePosition === 'low') 
      ? 'value' 
      : 'mixed';
  
  return {
    b2bPricingStrategy: recommendedB2BStrategy,
    multiLocationRecommendations: [
      {
        locationName: "Main Warehouse",
        strategy: "Full catalog, standard pricing"
      },
      {
        locationName: "City Stores",
        strategy: "Premium positioning, +5% on trend items"
      },
      {
        locationName: "Outlet Locations",
        strategy: "Focus on discontinued items, -10% discount"
      }
    ],
    scriptSuggestions: [
      {
        title: "Tiered B2B Pricing",
        description: "Apply volume discounts based on order quantity",
        trigger: "order_create",
        complexity: "medium"
      },
      {
        title: "Competitive Price Matching",
        description: "Match prices for items marked as 'high' in market position",
        trigger: "product_view",
        complexity: "high"
      }
    ],
    flowSuggestions: [
      {
        title: "Price Increase Notification",
        description: "Auto-tag customers when products they purchased have price increases",
        trigger: "product_update",
        actions: ["tag_customer", "create_email_campaign"]
      },
      {
        title: "Discontinued Product Alert",
        description: "Notify staff when discontinued products reach low inventory",
        trigger: "inventory_update",
        actions: ["notify_staff", "update_metafields"]
      }
    ]
  };
};

// Klaviyo integration data preparation
export const prepareKlaviyoSegmentData = (items: PriceItem[]): {
  priceIncreaseSegment: Record<string, any>,
  discontinuedItemsSegment: Record<string, any>,
  recommendedCampaigns: Record<string, any>[]
} => {
  // This function would interact with Gadget to prepare data for Klaviyo
  
  // Count items by status
  const increasedItems = items.filter(item => item.status === 'increased');
  const discontinuedItems = items.filter(item => item.status === 'discontinued');
  
  // Calculate average price changes
  const averagePriceIncrease = increasedItems.length > 0
    ? increasedItems.reduce((sum, item) => sum + (item.difference / item.oldPrice) * 100, 0) / increasedItems.length
    : 0;
  
  return {
    priceIncreaseSegment: {
      name: "Price Increase Alert",
      description: `Customers who purchased products with price increases (avg. ${averagePriceIncrease.toFixed(1)}%)`,
      itemCount: increasedItems.length,
      productIds: increasedItems.map(item => item.sku),
      estimatedCustomers: Math.floor(increasedItems.length * 2.5), // Estimate
      recommendedTiming: "14 days before price change",
      urgencyLevel: averagePriceIncrease > 10 ? "high" : averagePriceIncrease > 5 ? "medium" : "low",
    },
    discontinuedItemsSegment: {
      name: "Discontinued Products Alert",
      description: "Customers who purchased products being discontinued",
      itemCount: discontinuedItems.length,
      productIds: discontinuedItems.map(item => item.sku),
      estimatedCustomers: Math.floor(discontinuedItems.length * 2.1), // Estimate
      recommendedTiming: "When inventory falls below threshold",
      urgencyLevel: "medium"
    },
    recommendedCampaigns: [
      {
        name: "Price Increase Notification",
        segmentId: "price-increase-segment",
        template: "price-increase-template",
        subject: "Price change notice for products you love",
        recommendedSendTime: "Morning, 2 weeks before change"
      },
      {
        name: "Last Chance: Discontinued Products",
        segmentId: "discontinued-items-segment",
        template: "discontinued-product-template",
        subject: "Last chance to purchase products being discontinued",
        recommendedSendTime: "Weekend morning"
      }
    ]
  };
};
