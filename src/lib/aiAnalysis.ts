
import type { PriceItem, PriceAnalysis } from "@/types/price";

export const generateAIAnalysis = async (items: PriceItem[]): Promise<PriceAnalysis> => {
  // In a real-world scenario, this would call an AI API like OpenAI
  // For demo purposes, we'll generate an analysis based on the price data
  
  // Calculate statistics for the analysis
  const total = items.length;
  const increased = items.filter(item => item.status === 'increased').length;
  const decreased = items.filter(item => item.status === 'decreased').length;
  const discontinued = items.filter(item => item.status === 'discontinued').length;
  
  const increasedPercentage = Math.round((increased / total) * 100);
  const averageIncrease = items
    .filter(item => item.status === 'increased')
    .reduce((acc, item) => acc + item.difference, 0) / increased || 0;
  
  const totalImpact = items.reduce((acc, item) => acc + (item.potentialImpact || 0), 0);
  const highImpactItems = items
    .filter(item => (item.potentialImpact || 0) > 1000)
    .sort((a, b) => (b.potentialImpact || 0) - (a.potentialImpact || 0))
    .slice(0, 3);
  
  // Generate analysis
  const analysis: PriceAnalysis = {
    summary: `This price update affects ${total} products, with ${increasedPercentage}% showing price increases averaging ${averageIncrease.toFixed(2)}%. The projected annual financial impact is $${Math.abs(totalImpact).toLocaleString()}.`,
    
    recommendations: [
      `Prioritize negotiation for ${highImpactItems.length} high-impact items that represent significant cost changes.`,
      `Consider bulk purchasing of the ${increased} items with price increases before the new pricing takes effect.`,
      `Evaluate alternative suppliers for the ${discontinued} discontinued items.`,
      increased > decreased ? 
        "Review product pricing strategy to potentially pass some cost increases to customers." : 
        "Consider passing the savings to customers to improve competitiveness."
    ],
    
    riskAssessment: discontinued > 0 ? 
      `The discontinuation of ${discontinued} items poses a moderate risk to your product portfolio. These items represent potential annual revenue loss of $${Math.abs(items.filter(item => item.status === 'discontinued').reduce((acc, item) => acc + (item.potentialImpact || 0), 0)).toLocaleString()}.` : 
      "No substantial risk detected in this price update, as no products have been discontinued.",
    
    opportunityInsights: decreased > 0 ? 
      `Take advantage of price decreases on ${decreased} items, potentially improving margins or competitive pricing. The total potential annual savings is $${Math.abs(items.filter(item => item.status === 'decreased').reduce((acc, item) => acc + (item.potentialImpact || 0), 0)).toLocaleString()}.` : 
      "Limited opportunities identified in this price update. Consider negotiating longer fixed-price contracts for stable items."
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return analysis;
};
