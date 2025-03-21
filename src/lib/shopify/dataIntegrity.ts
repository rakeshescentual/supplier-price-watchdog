
import { toast } from 'sonner';
import { PriceItem } from '@/types/price';
import { gadgetAnalytics } from '../gadget/analytics';

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  code: string;
  message: string;
  items: string[];
}

interface ValidationWarning {
  code: string;
  message: string;
  items: string[];
}

/**
 * Validate price data before sending to Shopify
 */
export const validatePriceData = (items: PriceItem[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Group items by validation issue
  const missingSkus: string[] = [];
  const invalidPrices: string[] = [];
  const largePriceIncreases: string[] = [];
  const duplicateSkus = new Map<string, string[]>();
  
  // Validate each item
  items.forEach(item => {
    const itemId = item.sku || item.id || 'unknown';
    
    // Check for missing SKUs
    if (!item.sku) {
      missingSkus.push(itemId);
    }
    
    // Check for invalid prices
    if (item.newPrice <= 0 || isNaN(item.newPrice)) {
      invalidPrices.push(itemId);
    }
    
    // Check for large price increases (> 50%)
    if (item.oldPrice > 0 && item.newPrice > item.oldPrice && 
        (item.newPrice / item.oldPrice - 1) > 0.5) {
      largePriceIncreases.push(itemId);
    }
    
    // Track duplicate SKUs
    if (item.sku) {
      const existing = duplicateSkus.get(item.sku) || [];
      existing.push(itemId);
      duplicateSkus.set(item.sku, existing);
    }
  });
  
  // Add validation errors
  if (missingSkus.length > 0) {
    errors.push({
      code: 'MISSING_SKU',
      message: 'Some items are missing SKUs',
      items: missingSkus
    });
  }
  
  if (invalidPrices.length > 0) {
    errors.push({
      code: 'INVALID_PRICE',
      message: 'Some items have invalid prices (must be greater than 0)',
      items: invalidPrices
    });
  }
  
  // Find duplicate SKUs (more than 1 item with the same SKU)
  const duplicates: string[] = [];
  duplicateSkus.forEach((itemIds, sku) => {
    if (itemIds.length > 1) {
      duplicates.push(sku);
    }
  });
  
  if (duplicates.length > 0) {
    errors.push({
      code: 'DUPLICATE_SKU',
      message: 'Duplicate SKUs found',
      items: duplicates
    });
  }
  
  // Add validation warnings
  if (largePriceIncreases.length > 0) {
    warnings.push({
      code: 'LARGE_PRICE_INCREASE',
      message: 'Some items have price increases greater than 50%',
      items: largePriceIncreases
    });
  }
  
  const isValid = errors.length === 0;
  
  // Track validation results
  gadgetAnalytics.trackBusinessMetric('shopify_data_validation', isValid ? 1 : 0, {
    itemCount: items.length,
    errorCount: errors.length,
    warningCount: warnings.length,
    errorCodes: errors.map(e => e.code),
    warningCodes: warnings.map(w => w.code)
  });
  
  return {
    isValid,
    errors,
    warnings
  };
};

/**
 * Validate and show user feedback for data validation issues
 */
export const validateAndNotify = (items: PriceItem[]): ValidationResult => {
  const result = validatePriceData(items);
  
  // Show error toast if validation failed
  if (!result.isValid) {
    toast.error('Validation Errors', {
      description: `Found ${result.errors.length} error(s) that must be fixed before syncing`
    });
  }
  
  // Show warning toast if there are warnings
  if (result.warnings.length > 0) {
    toast.warning('Validation Warnings', {
      description: `Found ${result.warnings.length} issue(s) that you may want to review`
    });
  }
  
  return result;
};

/**
 * Clean and normalize price data for Shopify
 */
export const cleanPriceData = (items: PriceItem[]): PriceItem[] => {
  return items.map(item => ({
    ...item,
    // Ensure prices are properly formatted for Shopify
    newPrice: Number(parseFloat(String(item.newPrice)).toFixed(2)),
    oldPrice: Number(parseFloat(String(item.oldPrice)).toFixed(2)),
    // Trim whitespace from strings
    sku: item.sku?.trim(),
    name: item.name?.trim(),
    // Ensure consistent status values
    status: item.status || 'unchanged'
  }));
};
