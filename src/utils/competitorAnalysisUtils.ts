import { CompetitorAnalysisData, CompetitorPriceItem, ScrapingSchedule, CompetitorInsight, HistoricalPriceData } from "@/types/price";
import { toast } from "sonner";

// This function would normally fetch data from your API, but for now it returns mock data
export const fetchCompetitorData = async (): Promise<CompetitorAnalysisData> => {
  console.log("Fetching competitor price data...");
  
  // In a real implementation, this would call your backend API
  // that integrates with a web scraping service
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data for demonstration
    return {
      items: getMockCompetitorPriceItems(),
      scrapingSchedules: getMockScrapingSchedules(),
      insights: getMockInsights(),
      historicalData: getMockHistoricalData(),
      averageDifference: 3.7,
      trackedProductsCount: 45,
      competitorCount: 7,
      lastUpdate: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours from now
    };
  } catch (error) {
    console.error("Error fetching competitor data:", error);
    toast.error("Error fetching competitor data", {
      description: "Could not retrieve the latest competitor prices."
    });
    throw error;
  }
};

// Function to manually trigger a scrape for a specific competitor
export const triggerCompetitorScrape = async (competitorId: string): Promise<boolean> => {
  console.log(`Triggering scrape for competitor ID: ${competitorId}`);
  
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call your backend
    // to initiate a scraping job
    
    return true;
  } catch (error) {
    console.error("Error triggering competitor scrape:", error);
    toast.error("Scraping failed", {
      description: "Could not initiate the scraping process. Please try again."
    });
    return false;
  }
};

// Function to create or update a scraping schedule
export const updateScrapingSchedule = async (
  schedule: Partial<ScrapingSchedule> & { id?: string }
): Promise<ScrapingSchedule> => {
  console.log("Updating scraping schedule:", schedule);
  
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call your backend API
    // to create or update a scraping schedule
    
    // Return a mock updated schedule
    return {
      id: schedule.id || `schedule-${Date.now()}`,
      name: schedule.name || "New Competitor",
      url: schedule.url || "https://example.com",
      times: schedule.times || ["09:00", "18:00"],
      active: schedule.active !== undefined ? schedule.active : true,
      lastRun: null,
      nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
    };
  } catch (error) {
    console.error("Error updating scraping schedule:", error);
    toast.error("Update failed", {
      description: "Could not update the scraping schedule. Please try again."
    });
    throw error;
  }
};

// Function to delete a scraping schedule
export const deleteScrapingSchedule = async (scheduleId: string): Promise<boolean> => {
  console.log(`Deleting scraping schedule ID: ${scheduleId}`);
  
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call your backend API
    // to delete a scraping schedule
    
    return true;
  } catch (error) {
    console.error("Error deleting scraping schedule:", error);
    toast.error("Deletion failed", {
      description: "Could not delete the scraping schedule. Please try again."
    });
    return false;
  }
};

// Update mock data generators to only include UK competitors
function getMockCompetitorPriceItems(): CompetitorPriceItem[] {
  const products = [
    { sku: "FR-1001", name: "Chanel No. 5 Eau de Parfum 100ml", retailPrice: 135.0 },
    { sku: "FR-1002", name: "Dior Sauvage Eau de Toilette 100ml", retailPrice: 94.0 },
    { sku: "FR-1003", name: "Yves Saint Laurent Black Opium 90ml", retailPrice: 115.0 },
    { sku: "FR-1004", name: "Jo Malone London Lime Basil & Mandarin 100ml", retailPrice: 105.0 },
    { sku: "FR-1005", name: "Tom Ford Tobacco Vanille 50ml", retailPrice: 195.0 },
    { sku: "SK-2001", name: "Estée Lauder Advanced Night Repair 50ml", retailPrice: 78.0 },
    { sku: "SK-2002", name: "La Mer Crème de la Mer 60ml", retailPrice: 320.0 },
    { sku: "SK-2003", name: "Clinique Dramatically Different Moisturizing Lotion+ 125ml", retailPrice: 30.0 },
    { sku: "SK-2004", name: "Kiehl's Ultra Facial Cream 50ml", retailPrice: 28.0 },
    { sku: "SK-2005", name: "Drunk Elephant Protini Polypeptide Cream 50ml", retailPrice: 68.0 }
  ];

  // Updated to only include UK competitors
  const competitors = [
    "Boots",
    "Harrods",
    "Harvey Nichols",
    "Frasers",
    "Fenwick",
    "Selfridges",
    "The Fragrance Shop"
  ];
  
  return products.map(product => {
    const competitorPrices: Record<string, number | null> = {};
    const competitorDiffs: Record<string, number> = {};
    let totalDiff = 0;
    let count = 0;
    
    competitors.forEach(competitor => {
      // Randomly decide if the competitor has this product (80% chance)
      if (Math.random() < 0.8) {
        // Generate a price that's within ±15% of our retail price
        const priceDiff = (Math.random() * 30) - 15; // -15% to +15%
        const price = product.retailPrice * (1 + priceDiff / 100);
        competitorPrices[competitor] = Number(price.toFixed(2));
        competitorDiffs[competitor] = Number(priceDiff.toFixed(1));
        totalDiff += priceDiff;
        count++;
      } else {
        competitorPrices[competitor] = null; // Product not available
        competitorDiffs[competitor] = 0;
      }
    });
    
    const averageDiff = count > 0 ? totalDiff / count : 0;
    
    return {
      id: product.sku,
      sku: product.sku,
      name: product.name,
      retailPrice: product.retailPrice,
      competitorPrices,
      competitorDiffs,
      averageDiff,
      lastUpdated: new Date().toISOString()
    };
  });
}

function getMockScrapingSchedules(): ScrapingSchedule[] {
  return [
    {
      id: "schedule-1",
      name: "Boots",
      url: "https://www.boots.com",
      times: ["09:00", "16:00"],
      active: true,
      lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "schedule-2",
      name: "Harrods",
      url: "https://www.harrods.com",
      times: ["08:30", "17:30"],
      active: true,
      lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "schedule-3",
      name: "Selfridges",
      url: "https://www.selfridges.com",
      times: ["10:00", "18:00"],
      active: true,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "schedule-4",
      name: "Harvey Nichols",
      url: "https://www.harveynichols.com",
      times: ["09:00", "17:00"],
      active: true,
      lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "schedule-5",
      name: "Frasers",
      url: "https://www.frasers.com",
      times: ["08:00", "16:00"],
      active: true,
      lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "schedule-6",
      name: "Fenwick",
      url: "https://www.fenwick.co.uk",
      times: ["09:30", "17:30"],
      active: true,
      lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "schedule-7",
      name: "The Fragrance Shop",
      url: "https://www.thefragranceshop.co.uk",
      times: ["08:30", "16:30"],
      active: true,
      lastRun: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString()
    }
  ];
}

function getMockInsights(): CompetitorInsight[] {
  return [
    {
      id: "insight-1",
      type: "opportunity",
      title: "Competitive Advantage on Premium Fragrances",
      description: "Your prices for premium fragrances are lower than competitors by 7.2% on average",
      metrics: {
        "average_difference": "-7.2%",
        "products_affected": "12",
        "potential_revenue": "$2,450"
      },
      recommendations: [
        "Consider a small price increase while maintaining competitive edge",
        "Create bundle offers to increase average order value"
      ],
      affectedProducts: ["FR-1001", "FR-1005", "FR-1009", "FR-1012"],
      date: new Date().toISOString()
    },
    {
      id: "insight-2",
      type: "risk",
      title: "Price Disadvantage on Skincare",
      description: "Your skincare products are priced 5.8% higher than market average",
      metrics: {
        "average_difference": "+5.8%",
        "products_affected": "8",
        "potential_loss": "$1,850"
      },
      recommendations: [
        "Review pricing strategy for key skincare lines",
        "Focus marketing on unique selling points beyond price"
      ],
      affectedProducts: ["SK-2001", "SK-2002", "SK-2005"],
      date: new Date().toISOString()
    },
    {
      id: "insight-3",
      type: "trend",
      title: "Increasing Competition in Luxury Segment",
      description: "Price fluctuations increasing for luxury products across all competitors",
      metrics: {
        "price_volatility": "High",
        "average_changes": "3.2/month",
        "market_trend": "Downward"
      },
      recommendations: [
        "Monitor luxury segment more frequently",
        "Develop flexible pricing strategy for rapid adjustments"
      ],
      date: new Date().toISOString()
    },
    {
      id: "insight-4",
      type: "alert",
      title: "Significant Price Drop at Boots",
      description: "Boots has reduced prices on competing products by 12% on average",
      metrics: {
        "average_reduction": "12.4%",
        "promotion_type": "Sale Event",
        "end_date": "In 5 days"
      },
      recommendations: [
        "Monitor impact on sales volumes",
        "Consider temporary price match for key products"
      ],
      affectedProducts: ["FR-1002", "FR-1003", "SK-2003", "SK-2004"],
      date: new Date().toISOString()
    }
  ];
}

function getMockHistoricalData(): HistoricalPriceData[] {
  // Generate 30 days of historical data for a few products
  const products = [
    { id: "FR-1001", name: "Chanel No. 5 Eau de Parfum 100ml", sku: "FR-1001", basePrice: 135.0 },
    { id: "FR-1002", name: "Dior Sauvage Eau de Toilette 100ml", sku: "FR-1002", basePrice: 94.0 },
    { id: "SK-2001", name: "Estée Lauder Advanced Night Repair 50ml", sku: "SK-2001", basePrice: 78.0 }
  ];
  
  const competitors = ["Boots", "Harrods", "Selfridges", "Harvey Nichols"];
  const days = 90; // 90 days of data
  
  return products.map(product => {
    const prices = [];
    const today = new Date();
    
    // Initial price variations
    const competitorBasePrices: Record<string, number> = {};
    competitors.forEach(competitor => {
      // Set initial competitor price to be within ±10% of our base price
      const initialDiff = (Math.random() * 20) - 10; // -10% to +10%
      competitorBasePrices[competitor] = product.basePrice * (1 + initialDiff / 100);
    });
    
    // Generate price data for each day
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - i));
      
      // Our price with small random fluctuations over time
      const ourPriceChange = (Math.sin(i / 15) * 3) + ((Math.random() * 2) - 1); // Gentle sine wave + small noise
      const ourPrice = Number((product.basePrice * (1 + ourPriceChange / 100)).toFixed(2));
      
      const dayData: Record<string, number | string> = {
        date: date.toISOString(),
        our_price: ourPrice
      };
      
      // Add competitor prices with their own fluctuations
      competitors.forEach(competitor => {
        const basePrice = competitorBasePrices[competitor];
        
        // Add competitor-specific trends and randomness
        const competitorTrend = Math.sin((i + competitors.indexOf(competitor) * 5) / 20) * 4; // Phase-shifted sine waves
        const randomNoise = (Math.random() * 5) - 2.5; // Random noise ±2.5%
        
        // Occasional price changes (sales, etc)
        const hasPriceEvent = Math.random() < 0.05; // 5% chance of price event
        const priceEventImpact = hasPriceEvent ? -1 * (Math.random() * 15 + 5) : 0; // 5-20% discount
        
        const totalChange = competitorTrend + randomNoise + priceEventImpact;
        const price = Number((basePrice * (1 + totalChange / 100)).toFixed(2));
        
        dayData[competitor] = price;
      });
      
      prices.push(dayData);
    }
    
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      prices
    };
  });
}
