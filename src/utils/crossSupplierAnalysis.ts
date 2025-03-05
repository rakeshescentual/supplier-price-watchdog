
import { PriceItem } from "@/types/price";

export const calculateCrossSupplierTrends = (items: PriceItem[]) => {
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
};

// Analyze price trends by category
export const analyzeCategories = (items: PriceItem[]) => {
  const categories = new Set<string>();
  items.forEach(item => {
    if (item.category) categories.add(item.category);
  });

  return Array.from(categories).map(category => {
    const categoryItems = items.filter(item => item.category === category);
    const increasedItems = categoryItems.filter(item => item.status === 'increased');
    const averageIncrease = increasedItems.length > 0 
      ? increasedItems.reduce((acc, item) => acc + item.difference, 0) / increasedItems.length
      : 0;
    
    return {
      category,
      totalItems: categoryItems.length,
      increasedItems: increasedItems.length,
      averageIncrease,
      percentIncreased: (increasedItems.length / categoryItems.length) * 100
    };
  }).sort((a, b) => b.averageIncrease - a.averageIncrease);
};

// Analyze supplier pricing strategies
export const analyzeSuppliers = (items: PriceItem[]) => {
  const suppliers = new Set<string>();
  items.forEach(item => {
    const supplier = item.newSupplierCode || item.vendor;
    if (supplier) suppliers.add(supplier);
  });

  return Array.from(suppliers).map(supplier => {
    const supplierItems = items.filter(item => 
      item.newSupplierCode === supplier || item.vendor === supplier
    );
    
    const increased = supplierItems.filter(item => item.status === 'increased');
    const decreased = supplierItems.filter(item => item.status === 'decreased');
    const discontinued = supplierItems.filter(item => item.status === 'discontinued');
    
    return {
      supplier,
      totalItems: supplierItems.length,
      increased: increased.length,
      decreased: decreased.length,
      discontinued: discontinued.length,
      averageIncrease: increased.length > 0 
        ? increased.reduce((acc, item) => acc + item.difference, 0) / increased.length
        : 0,
      percentageIncreased: (increased.length / supplierItems.length) * 100
    };
  }).sort((a, b) => b.percentageIncreased - a.percentageIncreased);
};

// New advanced analytics functions
export const identifyCorrelatedSuppliers = (items: PriceItem[]): { pair: string[], correlation: number }[] => {
  const suppliers = new Set<string>();
  items.forEach(item => {
    const supplier = item.newSupplierCode || item.vendor;
    if (supplier) suppliers.add(supplier);
  });
  
  const suppliersList = Array.from(suppliers);
  const results: { pair: string[], correlation: number }[] = [];
  
  // For each pair of suppliers
  for (let i = 0; i < suppliersList.length; i++) {
    for (let j = i + 1; j < suppliersList.length; j++) {
      const supplier1 = suppliersList[i];
      const supplier2 = suppliersList[j];
      
      // Get items from both suppliers
      const supplier1Items = items.filter(item => {
        const itemSupplier = item.newSupplierCode || item.vendor;
        return itemSupplier === supplier1;
      });
      
      const supplier2Items = items.filter(item => {
        const itemSupplier = item.newSupplierCode || item.vendor;
        return itemSupplier === supplier2;
      });
      
      // Check which categories they share
      const supplier1Categories = new Set(supplier1Items.map(item => item.category).filter(Boolean));
      const supplier2Categories = new Set(supplier2Items.map(item => item.category).filter(Boolean));
      
      const sharedCategories = Array.from(supplier1Categories).filter(category => 
        supplier2Categories.has(category as string)
      );
      
      if (sharedCategories.length === 0) continue;
      
      // Compare price change trends in shared categories
      let similarTrends = 0;
      
      sharedCategories.forEach(category => {
        const cat1Items = supplier1Items.filter(item => item.category === category);
        const cat2Items = supplier2Items.filter(item => item.category === category);
        
        const cat1Increased = cat1Items.filter(item => item.status === 'increased').length / cat1Items.length;
        const cat2Increased = cat2Items.filter(item => item.status === 'increased').length / cat2Items.length;
        
        // If price change trends are similar (within 15%)
        if (Math.abs(cat1Increased - cat2Increased) < 0.15) {
          similarTrends++;
        }
      });
      
      const correlation = similarTrends / sharedCategories.length;
      
      if (correlation > 0.5) {
        results.push({
          pair: [supplier1, supplier2],
          correlation
        });
      }
    }
  }
  
  return results.sort((a, b) => b.correlation - a.correlation);
};

export const identifyCompetitiveCategories = (items: PriceItem[]): { 
  category: string; 
  competitionScore: number;
  supplierCount: number;
  priceVariance: number;
}[] => {
  const categories = new Set<string>();
  items.forEach(item => {
    if (item.category) categories.add(item.category);
  });
  
  return Array.from(categories).map(category => {
    const categoryItems = items.filter(item => item.category === category);
    
    // Count unique suppliers in this category
    const suppliersInCategory = new Set<string>();
    categoryItems.forEach(item => {
      const supplier = item.newSupplierCode || item.vendor;
      if (supplier) suppliersInCategory.add(supplier);
    });
    
    // Calculate price variance in this category
    let priceSum = 0;
    let priceSquaredSum = 0;
    let count = 0;
    
    categoryItems.forEach(item => {
      if (item.newPrice) {
        priceSum += item.newPrice;
        priceSquaredSum += item.newPrice * item.newPrice;
        count++;
      }
    });
    
    const meanPrice = count > 0 ? priceSum / count : 0;
    const priceVariance = count > 0 ? (priceSquaredSum / count) - (meanPrice * meanPrice) : 0;
    
    // Higher competition score means more competitive category
    // Based on: number of suppliers, price variance, and pricing activity
    const pricingActivity = categoryItems.filter(item => 
      item.status === 'increased' || item.status === 'decreased'
    ).length / categoryItems.length;
    
    const competitionScore = (
      (suppliersInCategory.size * 0.5) + 
      (Math.sqrt(priceVariance) * 0.3) + 
      (pricingActivity * 0.2)
    );
    
    return {
      category,
      competitionScore,
      supplierCount: suppliersInCategory.size,
      priceVariance
    };
  }).sort((a, b) => b.competitionScore - a.competitionScore);
};

export const identifyProductSizeStrategies = (items: PriceItem[]): {
  sizeStrategies: { category: string; trend: 'smaller' | 'larger' | 'stable'; confidence: number }[];
} => {
  // In a real implementation, this would analyze actual size data
  // Here we're mocking it based on categories
  
  const categories = new Set<string>();
  items.forEach(item => {
    if (item.category) categories.add(item.category);
  });
  
  const sizeStrategies = Array.from(categories).map(category => {
    let trend: 'smaller' | 'larger' | 'stable';
    let confidence: number;
    
    // Mock data based on category
    if (category === 'Fragrance') {
      trend = 'smaller';
      confidence = 0.85;
    } else if (category === 'Skincare') {
      trend = 'larger';
      confidence = 0.72;
    } else {
      trend = 'stable';
      confidence = 0.65;
    }
    
    return { category, trend, confidence };
  });
  
  return { sizeStrategies };
};
