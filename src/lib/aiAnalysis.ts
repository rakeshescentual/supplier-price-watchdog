
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
  
  // Additional Shopify-specific analysis
  const shopifyItems = items.filter(item => item.productId);
  const itemsWithSales = shopifyItems.filter(item => item.historicalSales && item.historicalSales > 0);
  
  // Calculate inventory impact
  const inventoryImpactText = shopifyItems.length > 0 ? 
    `Analysis covers ${shopifyItems.length} products with inventory data. Consider prioritizing price adjustments for ${
      shopifyItems.filter(item => (item.inventoryLevel || 0) > 10).length
    } products with significant stock levels.` : 
    "No Shopify inventory data available for analysis.";
  
  // Calculate sales trend impact
  const salesTrendImpactText = itemsWithSales.length > 0 ?
    `Price changes will impact ${itemsWithSales.length} products with recent sales history. ${
      itemsWithSales.filter(item => item.status === 'increased').length
    } products with price increases have active sales, which may affect conversion rates.` :
    "No sales history available to assess impact on current selling products.";
  
  // Vendor analysis
  const vendors = new Set(shopifyItems.map(item => item.vendor).filter(Boolean));
  const vendorAnalysisText = vendors.size > 0 ?
    `Price changes affect products from ${vendors.size} vendors. Consider reviewing vendor relationships and negotiating terms for frequent price changers.` :
    "No vendor data available for analysis.";

  // NEW: Cross-supplier analysis
  const categories = new Set<string>();
  items.forEach(item => {
    if (item.category) categories.add(item.category);
  });

  // Analyze price changes by category
  const categoryAnalysis = Array.from(categories).map(category => {
    const categoryItems = items.filter(item => item.category === category);
    const categoryIncreased = categoryItems.filter(item => item.status === 'increased');
    const averageIncrease = categoryIncreased.length > 0 
      ? categoryIncreased.reduce((acc, item) => acc + item.difference, 0) / categoryIncreased.length
      : 0;
    const increasePercentage = (categoryIncreased.length / categoryItems.length) * 100;
    
    return {
      category,
      averageChangePercent: averageIncrease,
      description: `${category}: ${increasePercentage.toFixed(1)}% of items increased by an average of ${averageIncrease.toFixed(2)}%`
    };
  }).sort((a, b) => b.averageChangePercent - a.averageChangePercent);

  // Analyze supplier/vendor price strategies
  const suppliers = new Set<string>();
  items.forEach(item => {
    if (item.newSupplierCode) suppliers.add(item.newSupplierCode);
    else if (item.vendor) suppliers.add(item.vendor);
  });

  const supplierAnalysis = Array.from(suppliers).map(supplier => {
    const supplierItems = items.filter(item => 
      item.newSupplierCode === supplier || item.vendor === supplier
    );
    
    const supplierIncreased = supplierItems.filter(item => item.status === 'increased');
    const avgIncrease = supplierIncreased.length > 0
      ? supplierIncreased.reduce((acc, item) => acc + item.difference, 0) / supplierIncreased.length
      : 0;
    
    // Identify supplier's focus categories (categories with most increases)
    const catCounts: Record<string, number> = {};
    supplierItems
      .filter(item => item.status === 'increased' && item.category)
      .forEach(item => {
        if (item.category) catCounts[item.category] = (catCounts[item.category] || 0) + 1;
      });
    
    const focusCategories = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat);
    
    return {
      supplierName: supplier,
      averageIncrease: avgIncrease,
      focusCategories
    };
  }).sort((a, b) => b.averageIncrease - a.averageIncrease);

  // NEW: Discontinued items analysis
  const discontinuedCategories = new Set<string>();
  items
    .filter(item => item.status === 'discontinued' && item.category)
    .forEach(item => {
      if (item.category) discontinuedCategories.add(item.category);
    });

  // NEW: Size/packaging trend analysis
  const packSizeChanges = items.filter(
    item => item.oldPackSize && item.newPackSize && item.oldPackSize !== item.newPackSize
  );
  
  let packagingTrend: 'smaller' | 'larger' | 'mixed' | 'no change' = 'no change';
  let packagingDetails = "No significant packaging size changes detected.";
  
  if (packSizeChanges.length > 0) {
    // Basic parsing of pack sizes to detect trends
    // This is simplified and would need more robust parsing in production
    const trendToLarger = packSizeChanges.filter(item => {
      const oldSize = parseFloat(item.oldPackSize?.replace(/[^\d.]/g, '') || '0');
      const newSize = parseFloat(item.newPackSize?.replace(/[^\d.]/g, '') || '0');
      return newSize > oldSize;
    }).length;
    
    const trendToSmaller = packSizeChanges.filter(item => {
      const oldSize = parseFloat(item.oldPackSize?.replace(/[^\d.]/g, '') || '0');
      const newSize = parseFloat(item.newPackSize?.replace(/[^\d.]/g, '') || '0');
      return newSize < oldSize;
    }).length;
    
    if (trendToLarger > trendToSmaller * 1.5) {
      packagingTrend = 'larger';
      packagingDetails = `Trend toward larger sizes detected in ${trendToLarger} products, possibly to offer better value.`;
    } else if (trendToSmaller > trendToLarger * 1.5) {
      packagingTrend = 'smaller';
      packagingDetails = `Trend toward smaller sizes detected in ${trendToSmaller} products, possibly to maintain price points.`;
    } else {
      packagingTrend = 'mixed';
      packagingDetails = `Mixed packaging size changes: ${trendToLarger} increased, ${trendToSmaller} decreased.`;
    }
  }

  // Package up the affected categories for size changes
  const packagingAffectedCategories = Array.from(
    new Set(
      packSizeChanges
        .map(item => item.category)
        .filter(Boolean) as string[]
    )
  );

  // NEW: Brand focus areas
  const brands = new Set<string>();
  items.forEach(item => {
    // Extract brand from product name or use vendor as fallback
    const brand = item.name?.split(' ')[0] || item.vendor;
    if (brand) brands.add(brand);
  });

  const brandAnalysis = Array.from(brands).map(brand => {
    const brandItems = items.filter(item => 
      item.name?.startsWith(brand) || item.vendor === brand
    );
    
    const increasedItems = brandItems.filter(item => item.status === 'increased');
    const brandCatCounts: Record<string, number> = {};
    
    brandItems
      .filter(item => item.category)
      .forEach(item => {
        if (item.category) brandCatCounts[item.category] = (brandCatCounts[item.category] || 0) + 1;
      });
    
    const focusCategories = Object.entries(brandCatCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat);
    
    const priceStrategy = increasedItems.length > brandItems.length * 0.6
      ? "Premium/upmarket positioning"
      : increasedItems.length < brandItems.length * 0.3
        ? "Value/competitive positioning"
        : "Balanced pricing approach";
    
    return {
      brand,
      focusCategories,
      priceStrategy
    };
  });
  
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
    
    marginImpact: marginImpactText,
    inventoryImpact: inventoryImpactText,
    salesTrendImpact: salesTrendImpactText,
    vendorAnalysis: vendorAnalysisText,

    // NEW: Enhanced AI insights
    crossSupplierTrends: {
      categoryTrends: categoryAnalysis,
      supplierComparison: supplierAnalysis
    },
    
    discontinuedItemsInsights: {
      categories: Array.from(discontinuedCategories),
      possibleReasons: [
        "Supplier portfolio rationalization",
        "Poor sales performance",
        "Replacement with newer versions",
        "Production/ingredient challenges",
        "Shifting consumer preferences"
      ],
      recommendation: discontinued > 0 
        ? `Focus on finding alternatives for discontinued items in ${Array.from(discontinuedCategories).slice(0, 3).join(', ')} categories.`
        : "No action needed regarding discontinued items."
    },
    
    packagingTrends: {
      trendToward: packagingTrend,
      details: packagingDetails,
      affectedCategories: packagingAffectedCategories
    },
    
    brandFocusAreas: brandAnalysis.slice(0, 5)
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return analysis;
};
