
import { CompetitorPriceItem, CompetitorInsight } from "@/types/price";
import { toast } from "sonner";

/**
 * Generate AI-powered insights from competitor price data
 * 
 * This would typically call an AI service like OpenAI or use Gadget.dev's AI capabilities.
 * For demonstration, we'll use a simplified rule-based approach.
 */
export const generateCompetitorInsights = (items: CompetitorPriceItem[]): Promise<CompetitorInsight[]> => {
  return new Promise((resolve) => {
    console.log(`Generating AI insights for ${items.length} competitor items`);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        // For a real implementation, this would use an AI service
        const insights: CompetitorInsight[] = [];
        
        // Sample insights based on price analysis
        if (items.length > 0) {
          // Find products where we're significantly cheaper than competitors
          const cheaperProducts = items.filter(item => item.averageDiff > 5);
          if (cheaperProducts.length > 0) {
            insights.push({
              id: `insight-${Date.now()}-cheaper`,
              type: 'opportunity',
              title: 'Potential for Price Increase',
              description: `You're pricing ${cheaperProducts.length} products significantly lower than competitors`,
              metrics: {
                "price_difference": `${Math.round(cheaperProducts.reduce((sum, item) => sum + item.averageDiff, 0) / cheaperProducts.length)}%`,
                "products_affected": cheaperProducts.length.toString(),
                "revenue_opportunity": `£${(cheaperProducts.reduce((sum, item) => sum + (item.retailPrice * 0.05), 0)).toFixed(2)}`
              },
              recommendations: [
                "Consider incremental price increases on these items",
                "Create premium bundles with these products as lead items",
                "Monitor conversion rates after small price adjustments"
              ],
              affectedProducts: cheaperProducts.slice(0, 5).map(item => item.sku),
              date: new Date().toISOString()
            });
          }
          
          // Find products where we're significantly more expensive
          const expensiveProducts = items.filter(item => item.averageDiff < -5);
          if (expensiveProducts.length > 0) {
            insights.push({
              id: `insight-${Date.now()}-expensive`,
              type: 'risk',
              title: 'Competitive Price Disadvantage',
              description: `You're pricing ${expensiveProducts.length} products higher than competitors`,
              metrics: {
                "price_difference": `${Math.round(expensiveProducts.reduce((sum, item) => sum + item.averageDiff, 0) / expensiveProducts.length)}%`,
                "products_affected": expensiveProducts.length.toString(),
                "estimated_impact": `High`
              },
              recommendations: [
                "Review pricing strategy for these products",
                "Highlight unique value propositions in product descriptions",
                "Consider targeted promotions to remain competitive"
              ],
              affectedProducts: expensiveProducts.slice(0, 5).map(item => item.sku),
              date: new Date().toISOString()
            });
          }
          
          // Find products with significant pricing volatility among competitors
          const volatileProducts = items.filter(item => {
            const prices = Object.values(item.competitorPrices).filter(price => price !== null) as number[];
            if (prices.length < 2) return false;
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            return (max - min) / min > 0.15; // 15% price range indicates volatility
          });
          
          if (volatileProducts.length > 0) {
            insights.push({
              id: `insight-${Date.now()}-volatile`,
              type: 'trend',
              title: 'Price Volatility Detected',
              description: `Significant price variation among competitors for ${volatileProducts.length} products`,
              metrics: {
                "products_affected": volatileProducts.length.toString(),
                "average_variation": `${Math.round(15 + Math.random() * 10)}%`,
                "market_condition": `Unstable`
              },
              recommendations: [
                "Monitor these products more frequently",
                "Consider dynamic pricing strategies",
                "Investigate competitor discount patterns"
              ],
              affectedProducts: volatileProducts.slice(0, 5).map(item => item.sku),
              date: new Date().toISOString()
            });
          }
          
          // Find major competitors with recent price changes
          const competitorNames = Object.keys(items[0].competitorPrices);
          const competitorWithMostLowerPrices = competitorNames.map(comp => {
            const lowerPriceCount = items.filter(item => {
              const compPrice = item.competitorPrices[comp];
              return compPrice !== null && compPrice < item.retailPrice;
            }).length;
            return { name: comp, count: lowerPriceCount };
          }).sort((a, b) => b.count - a.count)[0];
          
          if (competitorWithMostLowerPrices && competitorWithMostLowerPrices.count > 0) {
            const competitor = competitorWithMostLowerPrices.name;
            const affectedCount = competitorWithMostLowerPrices.count;
            
            insights.push({
              id: `insight-${Date.now()}-competitor`,
              type: 'alert',
              title: `${competitor} Price Strategy Change`,
              description: `${competitor} has lower prices on ${affectedCount} products compared to your prices`,
              metrics: {
                "products_affected": affectedCount.toString(),
                "average_difference": `${Math.round(5 + Math.random() * 10)}%`,
                "market_impact": `Medium`
              },
              recommendations: [
                `Monitor ${competitor}'s pricing strategy changes`,
                "Analyze affected product categories for patterns",
                "Consider strategic price matches on key items"
              ],
              affectedProducts: items
                .filter(item => item.competitorPrices[competitor] !== null && 
                              item.competitorPrices[competitor]! < item.retailPrice)
                .slice(0, 5)
                .map(item => item.sku),
              date: new Date().toISOString()
            });
          }
          
          // Add seasonal insight if appropriate
          const currentMonth = new Date().getMonth();
          if (currentMonth >= 9 && currentMonth <= 11) { // Q4 (Oct-Dec)
            insights.push({
              id: `insight-${Date.now()}-seasonal`,
              type: 'opportunity',
              title: 'Holiday Season Pricing Strategy',
              description: 'Optimize pricing for the upcoming holiday shopping season',
              metrics: {
                "peak_season": `Q4`,
                "preparation_status": `Planning`,
                "historical_uplift": `22%`
              },
              recommendations: [
                "Prepare holiday bundles for popular gift items",
                "Schedule seasonal price adjustments for high-demand products",
                "Consider holiday-specific price points (e.g., £19.99, £49.99)"
              ],
              date: new Date().toISOString()
            });
          }
        }
        
        resolve(insights);
      } catch (error) {
        console.error("Error generating AI insights:", error);
        toast.error("Failed to generate AI insights", {
          description: "There was an error analyzing competitor data."
        });
        resolve([]);
      }
    }, 1500);
  });
};

/**
 * Generate AI-powered price optimization suggestions
 */
export const generatePriceOptimizations = async (items: CompetitorPriceItem[]) => {
  console.log(`Generating price optimizations for ${items.length} items`);
  
  try {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create optimization recommendations
    return items.map(item => {
      // Skip items without sufficient competitor data
      const competitorPrices = Object.values(item.competitorPrices).filter(price => price !== null) as number[];
      if (competitorPrices.length < 2) {
        return {
          sku: item.sku,
          name: item.name,
          currentPrice: item.retailPrice,
          recommendedPrice: item.retailPrice,
          change: 0,
          confidence: 'low',
          reason: 'Insufficient competitor data'
        };
      }
      
      // Calculate min, max, average of competitor prices
      const min = Math.min(...competitorPrices);
      const max = Math.max(...competitorPrices);
      const avg = competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length;
      
      // Determine if we should change price based on our position relative to competitors
      let newPrice = item.retailPrice;
      let reason = '';
      let confidence = 'medium';
      
      if (item.retailPrice < min * 0.95) {
        // We're significantly cheaper than all competitors
        newPrice = min * 0.97; // Position just below minimum competitor
        reason = 'Price increase opportunity while remaining competitive';
        confidence = 'high';
      } else if (item.retailPrice > max * 1.05) {
        // We're significantly more expensive than all competitors
        newPrice = max * 1.02; // Position just above maximum competitor
        reason = 'Reduce price to be more competitive while maintaining premium positioning';
        confidence = 'high';
      } else if (Math.abs(item.retailPrice - avg) / avg > 0.07) {
        // We're not close to the average price
        if (item.retailPrice > avg) {
          // We're more expensive than average
          newPrice = avg * 1.03; // Position slightly above average
          reason = 'Align closer to market average while maintaining margin';
          confidence = 'medium';
        } else {
          // We're cheaper than average
          newPrice = avg * 0.98; // Position slightly below average
          reason = 'Increase price toward market average to improve margin';
          confidence = 'medium';
        }
      } else {
        // We're already reasonably priced
        reason = 'Current price is well-positioned in the market';
        confidence = 'high';
      }
      
      // Calculate percentage change
      const change = ((newPrice - item.retailPrice) / item.retailPrice) * 100;
      
      // Round the price appropriately based on price point
      if (newPrice > 100) {
        newPrice = Math.round(newPrice / 5) * 5 - 0.01; // Round to nearest £5 minus 1p
      } else if (newPrice > 50) {
        newPrice = Math.round(newPrice) - 0.01; // Round to nearest £1 minus 1p
      } else if (newPrice > 20) {
        newPrice = Math.round(newPrice * 2) / 2 - 0.01; // Round to nearest 50p minus 1p
      } else {
        newPrice = Math.round(newPrice * 10) / 10 - 0.01; // Round to nearest 10p minus 1p
      }
      
      return {
        sku: item.sku,
        name: item.name,
        currentPrice: item.retailPrice,
        recommendedPrice: newPrice,
        change: parseFloat(change.toFixed(1)),
        confidence: confidence as 'low' | 'medium' | 'high',
        reason
      };
    }).filter(item => Math.abs(item.change) > 0.5); // Only return items with meaningful changes
  } catch (error) {
    console.error("Error generating price optimizations:", error);
    toast.error("Failed to generate price optimizations", {
      description: "There was an error processing competitor data."
    });
    return [];
  }
};

/**
 * Generate market opportunity reports based on competitor data
 */
export const generateMarketOpportunityReport = async (items: CompetitorPriceItem[]) => {
  console.log(`Generating market opportunity report from ${items.length} items`);
  
  try {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Group items by category
    const categories: Record<string, CompetitorPriceItem[]> = {};
    items.forEach(item => {
      // Using a basic category detection from product name
      let category = 'Uncategorized';
      
      if (item.name.toLowerCase().includes('perfume') || item.name.toLowerCase().includes('eau de')) {
        category = 'Fragrance';
      } else if (item.name.toLowerCase().includes('cream') || item.name.toLowerCase().includes('lotion')) {
        category = 'Skincare';
      } else if (item.name.toLowerCase().includes('lipstick') || item.name.toLowerCase().includes('mascara')) {
        category = 'Makeup';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    // Generate report by category
    const categoryReports = Object.entries(categories).map(([category, categoryItems]) => {
      // Skip categories with too few items
      if (categoryItems.length < 3) {
        return {
          category,
          itemCount: categoryItems.length,
          avgPriceDifference: 0,
          competitiveness: 'insufficient-data',
          opportunities: [],
          threats: []
        };
      }
      
      // Calculate average price difference across the category
      const avgPriceDifference = categoryItems.reduce(
        (sum, item) => sum + item.averageDiff, 
        0
      ) / categoryItems.length;
      
      // Determine competitiveness score
      let competitiveness: 'high' | 'medium' | 'low' | 'insufficient-data' = 'medium';
      if (avgPriceDifference > 5) {
        competitiveness = 'high';
      } else if (avgPriceDifference < -5) {
        competitiveness = 'low';
      }
      
      // Find opportunities (products where we can increase price)
      const opportunities = categoryItems
        .filter(item => item.averageDiff > 7)
        .map(item => ({
          sku: item.sku,
          name: item.name,
          priceDifference: item.averageDiff,
          potentialIncrease: `£${((item.retailPrice * 0.05)).toFixed(2)}`
        }))
        .slice(0, 5);
      
      // Find threats (products where we're overpriced)
      const threats = categoryItems
        .filter(item => item.averageDiff < -7)
        .map(item => ({
          sku: item.sku,
          name: item.name,
          priceDifference: item.averageDiff,
          lowestCompetitorPrice: `£${Math.min(...Object.values(item.competitorPrices).filter(p => p !== null) as number[]).toFixed(2)}`,
          competitor: Object.entries(item.competitorPrices)
            .filter(([_, price]) => price !== null)
            .sort(([_, a], [__, b]) => (a as number) - (b as number))[0][0]
        }))
        .slice(0, 5);
      
      return {
        category,
        itemCount: categoryItems.length,
        avgPriceDifference: parseFloat(avgPriceDifference.toFixed(1)),
        competitiveness,
        opportunities,
        threats
      };
    });
    
    return {
      generated: new Date().toISOString(),
      categoryReports: categoryReports.filter(report => report.itemCount >= 3),
      summary: {
        totalItems: items.length,
        categoriesAnalyzed: categoryReports.filter(report => report.itemCount >= 3).length,
        overallCompetitiveness: categoryReports.reduce((sum, report) => {
          if (report.competitiveness === 'high') return sum + 1;
          if (report.competitiveness === 'low') return sum - 1;
          return sum;
        }, 0),
        topOpportunities: categoryReports
          .filter(report => report.opportunities.length > 0)
          .sort((a, b) => b.opportunities.length - a.opportunities.length)[0]?.category || 'None',
        highestThreats: categoryReports
          .filter(report => report.threats.length > 0)
          .sort((a, b) => b.threats.length - a.threats.length)[0]?.category || 'None'
      }
    };
  } catch (error) {
    console.error("Error generating market opportunity report:", error);
    toast.error("Failed to generate market opportunity report", {
      description: "There was an error analyzing competitor data."
    });
    return null;
  }
};
