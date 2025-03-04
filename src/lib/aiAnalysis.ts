
import type { PriceItem, PriceAnalysis, AnomalyStats } from "@/types/price";
import { getAnomalyStats } from "./excel";

export const generateAIAnalysis = async (items: PriceItem[]): Promise<PriceAnalysis> => {
  // In a real-world scenario, this would call an AI API like OpenAI
  // For demo purposes, we'll generate an analysis based on the price data
  
  // Calculate statistics for the analysis
  const total = items.length;
  const increased = items.filter(item => item.status === 'increased').length;
  const decreased = items.filter(item => item.status === 'decreased').length;
  const discontinued = items.filter(item => item.status === 'discontinued').length;
  const newItems = items.filter(item => item.status === 'new').length;
  
  const increasedPercentage = Math.round((increased / total) * 100) || 0;
  const averageIncrease = increased ? 
    items.filter(item => item.status === 'increased')
      .reduce((acc, item) => acc + item.difference, 0) / increased 
    : 0;
  
  const totalImpact = items.reduce((acc, item) => acc + (item.potentialImpact || 0), 0);
  const highImpactItems = items
    .filter(item => (item.potentialImpact || 0) > 1000)
    .sort((a, b) => (b.potentialImpact || 0) - (a.potentialImpact || 0))
    .slice(0, 3);
  
  // Get anomaly statistics
  const anomalyStats = getAnomalyStats(items);
  
  // Calculate margin impact
  const itemsWithMargins = items.filter(item => item.oldMargin !== undefined && item.newMargin !== undefined);
  const averageMarginChange = itemsWithMargins.length > 0 ? 
    itemsWithMargins.reduce((acc, item) => acc + (item.marginChange || 0), 0) / itemsWithMargins.length : 0;
  
  const marginImpactText = itemsWithMargins.length > 0 ? 
    `Average margin ${averageMarginChange > 0 ? 'increase' : 'decrease'} of ${Math.abs(averageMarginChange).toFixed(2)}% across ${itemsWithMargins.length} products.` : 
    "No margin data available for analysis.";
  
  // Generate analysis
  const analysis: PriceAnalysis = {
    summary: `This price update affects ${total} products, with ${increasedPercentage}% showing price increases averaging ${averageIncrease.toFixed(2)}%. ${newItems ? `${newItems} new items added.` : ''} The projected annual financial impact is $${Math.abs(totalImpact).toLocaleString()}.`,
    
    recommendations: [
      `Prioritize negotiation for ${highImpactItems.length} high-impact items that represent significant cost changes.`,
      `Consider bulk purchasing of the ${increased} items with price increases before the new pricing takes effect.`,
      `Evaluate alternative suppliers for the ${discontinued} discontinued items.`,
      anomalyStats.totalAnomalies > 0 ? 
        `Review ${anomalyStats.totalAnomalies} products with data anomalies to ensure alignment with supplier changes.` : 
        "All product data appears consistent with no anomalies detected.",
      increased > decreased ? 
        "Review product pricing strategy to potentially pass some cost increases to customers." : 
        "Consider passing the savings to customers to improve competitiveness.",
      averageMarginChange < -2 ? 
        "Margins are significantly compressed. Consider selective retail price increases." : 
        "Maintain current retail pricing to preserve competitive positioning."
    ],
    
    riskAssessment: discontinued > 0 ? 
      `The discontinuation of ${discontinued} items poses a moderate risk to your product portfolio. These items represent potential annual revenue loss of $${Math.abs(items.filter(item => item.status === 'discontinued').reduce((acc, item) => acc + (item.potentialImpact || 0), 0)).toLocaleString()}. ${anomalyStats.totalAnomalies > 0 ? `Additionally, ${anomalyStats.totalAnomalies} products show data anomalies that should be verified with suppliers.` : ''}` : 
      `No substantial risk detected in this price update, as no products have been discontinued. ${anomalyStats.totalAnomalies > 0 ? `However, ${anomalyStats.totalAnomalies} products show data anomalies that should be verified with suppliers.` : ''}`,
    
    opportunityInsights: decreased > 0 ? 
      `Take advantage of price decreases on ${decreased} items, potentially improving margins or competitive pricing. The total potential annual savings is $${Math.abs(items.filter(item => item.status === 'decreased').reduce((acc, item) => acc + (item.potentialImpact || 0), 0)).toLocaleString()}.` : 
      "Limited opportunities identified in this price update. Consider negotiating longer fixed-price contracts for stable items.",
    
    anomalies: {
      count: anomalyStats.totalAnomalies,
      types: [
        anomalyStats.nameChanges > 0 ? `${anomalyStats.nameChanges} name changes` : '',
        anomalyStats.supplierCodeChanges > 0 ? `${anomalyStats.supplierCodeChanges} supplier code changes` : '',
        anomalyStats.barcodeChanges > 0 ? `${anomalyStats.barcodeChanges} barcode changes` : '',
        anomalyStats.packSizeChanges > 0 ? `${anomalyStats.packSizeChanges} pack size changes` : '',
        anomalyStats.unmatched > 0 ? `${anomalyStats.unmatched} unmatched items` : ''
      ].filter(Boolean),
      description: anomalyStats.totalAnomalies > 0 ?
        `Detected ${anomalyStats.totalAnomalies} products with data inconsistencies. Most common: ${
          [
            anomalyStats.nameChanges > 0 ? 'product name changes' : '',
            anomalyStats.supplierCodeChanges > 0 ? 'supplier code changes' : '',
            anomalyStats.barcodeChanges > 0 ? 'barcode changes' : '',
            anomalyStats.packSizeChanges > 0 ? 'pack size changes' : ''
          ].filter(Boolean).join(', ') || 'various anomalies'
        }. Manual review recommended.` :
        "No data anomalies detected in the price update."
    },
    
    marginImpact: marginImpactText
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return analysis;
};
