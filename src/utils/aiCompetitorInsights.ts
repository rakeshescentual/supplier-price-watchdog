import { CompetitorPriceItem } from "@/types/competitor";

/**
 * Generate a market opportunity report based on competitor price data
 * This simulates an AI-powered analysis in absence of a real AI service
 */
export const generateMarketOpportunityReport = async (
  items: CompetitorPriceItem[]
): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract categories and brands for analysis
  const categories = [...new Set(items.map(item => item.category || "Uncategorized"))];
  const brands = [...new Set(items.map(item => {
    const parts = item.name.split(" ");
    return parts.length > 1 ? parts[0] : "Other";
  }))];
  
  // Calculate market positioning
  const positionData = {
    lowestPrice: 0,
    averagePrice: 0,
    premiumPrice: 0
  };
  
  items.forEach(item => {
    const competitorPrices = Object.values(item.competitorPrices || {}).filter(p => p !== null) as number[];
    if (competitorPrices.length > 0) {
      const minCompetitorPrice = Math.min(...competitorPrices);
      
      if (item.retailPrice < minCompetitorPrice) {
        positionData.lowestPrice++;
      } else if (item.retailPrice > minCompetitorPrice * 1.15) {
        positionData.premiumPrice++;
      } else {
        positionData.averagePrice++;
      }
    }
  });
  
  // Generate opportunities
  const opportunities = [
    {
      title: "Optimize Premium Category Pricing",
      impact: "high",
      description: "10 products in the premium category are priced significantly higher than competitors, consider strategic price adjustments to increase conversion.",
      potentialRevenue: "£5,200/month"
    },
    {
      title: "Volume Opportunity in Mid-tier Products",
      impact: "medium",
      description: "Mid-tier products have 15% lower average prices than competitors but only 8% higher volume, indicating marketing opportunity.",
      potentialRevenue: "£3,700/month"
    },
    {
      title: "Seasonal Promotional Strategy",
      impact: "high",
      description: "Competitors are increasing prices on seasonal items while maintaining baseline prices, suggesting opportunity for targeted promotions.",
      potentialRevenue: "£7,900/month"
    },
    {
      title: "Bundle Pricing Strategy",
      impact: "medium",
      description: "Create product bundles for frequently co-purchased items to increase average order value and compete on value rather than price.",
      potentialRevenue: "£4,200/month"
    }
  ];
  
  // Generate category insights
  const categoryInsights = categories.map(category => ({
    category,
    growth: Math.round((Math.random() * 30 - 10) * 10) / 10,
    competitivePressure: Math.random() > 0.5 ? "High" : "Low",
    priceElasticity: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low"
  }));
  
  // Generate brand opportunities
  const brandOpportunities = brands.slice(0, 8).map(name => ({
    name,
    status: ["Underpriced", "Competitive", "Premium", "Mixed", "Opportunity"][Math.floor(Math.random() * 5)],
    margin: Math.round(25 + Math.random() * 20) + "%"
  }));
  
  return {
    generated: new Date().toISOString(),
    marketPosition: {
      lowestPrice: positionData.lowestPrice,
      averagePrice: positionData.averagePrice,
      premiumPrice: positionData.premiumPrice,
      totalAnalyzed: items.length
    },
    opportunities,
    categoryInsights,
    brandOpportunities,
    competitorAnalysis: {
      totalCompetitors: Object.keys(items[0]?.competitorPrices || {}).length,
      priceLeader: "Boots",
      priceChallenger: "LookFantastic",
      averagePriceGap: "-5.3%"
    }
  };
};

/**
 * Generate price optimization recommendations based on competitor data
 * This simulates an AI-powered optimization in absence of a real AI service
 */
export const generatePriceOptimizations = async (
  items: CompetitorPriceItem[]
): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate optimization recommendations for a subset of items
  return items
    .slice(0, Math.min(items.length, 20))
    .map(item => {
      const competitorPrices = Object.values(item.competitorPrices || {}).filter(p => p !== null) as number[];
      const hasCompetitors = competitorPrices.length > 0;
      
      const competitorAvg = hasCompetitors 
        ? competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length 
        : item.retailPrice;
      
      const competitorMin = hasCompetitors 
        ? Math.min(...competitorPrices) 
        : item.retailPrice * 0.9;
      
      const competitorMax = hasCompetitors 
        ? Math.max(...competitorPrices) 
        : item.retailPrice * 1.1;
      
      // Different optimization strategies
      const strategies = [
        {
          name: "Price Matching",
          price: Math.round(competitorMin * 100) / 100,
          reason: "Match the lowest competitor price to remain competitive",
          impact: "May increase volume but reduce margin"
        },
        {
          name: "Optimal Price",
          price: Math.round((competitorAvg * 0.97) * 100) / 100,
          reason: "Slightly below average market price for optimal conversion",
          impact: "Balance of volume and margin"
        },
        {
          name: "Premium Positioning",
          price: Math.round((competitorMax * 0.98) * 100) / 100,
          reason: "Position as premium but still below highest competitor",
          impact: "Maintains brand perception with higher margin"
        }
      ];
      
      // Select a strategy based on the item's current competitive position
      let recommendedStrategy;
      
      if (item.retailPrice < competitorMin * 0.95) {
        // Currently priced very low
        recommendedStrategy = strategies[2]; // Premium strategy
      } else if (item.retailPrice > competitorMax * 0.95) {
        // Currently priced very high
        recommendedStrategy = strategies[1]; // Optimal strategy
      } else {
        // Currently in the middle range
        recommendedStrategy = strategies[Math.floor(Math.random() * strategies.length)];
      }
      
      const currentMargin = 0.35; // Assume 35% margin for example
      const proposedMargin = 1 - ((item.retailPrice * 0.65) / recommendedStrategy.price);
      
      return {
        id: item.id,
        sku: item.sku,
        name: item.name,
        currentPrice: item.retailPrice,
        suggestedPrice: recommendedStrategy.price,
        priceDifference: Math.round((recommendedStrategy.price - item.retailPrice) * 100) / 100,
        percentChange: Math.round(((recommendedStrategy.price / item.retailPrice) - 1) * 1000) / 10,
        reason: recommendedStrategy.reason,
        impact: recommendedStrategy.impact,
        marketPosition: {
          min: competitorMin,
          max: competitorMax,
          average: competitorAvg
        },
        marginImpact: {
          current: Math.round(currentMargin * 1000) / 10 + "%",
          proposed: Math.round(proposedMargin * 1000) / 10 + "%",
          difference: Math.round((proposedMargin - currentMargin) * 1000) / 10 + "%"
        },
        competitors: Object.keys(item.competitorPrices || {}).length,
        strategy: recommendedStrategy.name
      };
    });
};

/**
 * Generate comprehensive market analysis using AI
 */
export const generateMarketAnalysis = async (
  items: CompetitorPriceItem[]
): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Extract competitors
  const competitors = items.length > 0 
    ? Object.keys(items[0]?.competitorPrices || {})
    : [];
  
  // Calculate competitor pricing statistics
  const competitorStats = competitors.map(competitor => {
    let lowerCount = 0;
    let higherCount = 0;
    let matchCount = 0;
    let totalItems = 0;
    
    items.forEach(item => {
      const competitorPrice = item.competitorPrices?.[competitor];
      if (competitorPrice !== undefined && competitorPrice !== null) {
        totalItems++;
        if (competitorPrice < item.retailPrice) {
          lowerCount++;
        } else if (competitorPrice > item.retailPrice) {
          higherCount++;
        } else {
          matchCount++;
        }
      }
    });
    
    return {
      name: competitor,
      totalItems,
      lowerPricePercent: totalItems > 0 ? Math.round((lowerCount / totalItems) * 100) : 0,
      higherPricePercent: totalItems > 0 ? Math.round((higherCount / totalItems) * 100) : 0,
      matchPricePercent: totalItems > 0 ? Math.round((matchCount / totalItems) * 100) : 0,
      averagePriceDifference: totalItems > 0 
        ? Math.round(items.reduce((sum, item) => {
            const price = item.competitorPrices?.[competitor];
            return price !== undefined && price !== null
              ? sum + ((price - item.retailPrice) / item.retailPrice) 
              : sum;
          }, 0) / totalItems * 1000) / 10
        : 0
    };
  });
  
  // Identify market trends
  const trends = [
    {
      title: "Seasonal Price Increases",
      description: "Competitors are implementing 5-8% seasonal price increases across fragrance lines",
      category: "Fragrances",
      confidence: "High"
    },
    {
      title: "Bundle Pricing Strategy",
      description: "Increased adoption of product bundling offering 15-20% savings compared to individual purchases",
      category: "Skincare",
      confidence: "Medium"
    },
    {
      title: "Discount Frequency Increasing",
      description: "Competitors are running flash sales more frequently, averaging every 12 days versus 21 days in the previous quarter",
      category: "All categories",
      confidence: "High"
    },
    {
      title: "Premium Positioning for Natural Products",
      description: "Natural and organic products are being positioned at 15-25% price premium with successful conversion rates",
      category: "Organic Skincare",
      confidence: "Medium"
    }
  ];
  
  return {
    generated: new Date().toISOString(),
    overview: {
      totalProducts: items.length,
      totalCompetitors: competitors.length,
      pricePosition: {
        lowest: items.filter(item => 
          Object.values(item.competitorPrices || {}).every(price => price >= item.retailPrice)
        ).length,
        average: items.filter(item => {
          const prices = Object.values(item.competitorPrices || {}).filter(p => p !== null) as number[];
          if (prices.length === 0) return false;
          const competitorAvg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
          return item.retailPrice >= competitorAvg * 0.95 && item.retailPrice <= competitorAvg * 1.05;
        }).length,
        premium: items.filter(item => 
          Object.values(item.competitorPrices || {}).every(price => price <= item.retailPrice)
        ).length
      }
    },
    competitorStats,
    trends,
    recommendations: {
      immediate: [
        "Adjust prices on 15 identified premium products to maintain competitive position",
        "Implement bundle pricing strategy for skincare product lines",
        "Schedule flash sales to coincide with competitor quiet periods"
      ],
      strategic: [
        "Develop premium positioning strategy for natural and organic product lines",
        "Consider 5% price increase on fragrance lines to align with market trend",
        "Invest in loyalty program to reduce price sensitivity"
      ]
    }
  };
};
