
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
