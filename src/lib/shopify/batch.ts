
import { ShopifyContext } from '@/types/price';

// Batch operations for better performance
export const batchShopifyOperations = async <T, R>(
  shopifyContext: ShopifyContext,
  items: T[],
  operationFn: (item: T) => Promise<R>,
  options = { batchSize: 10, concurrency: 1 }
): Promise<R[]> => {
  if (!items.length) return [];
  
  console.log(`Processing ${items.length} items in batches of ${options.batchSize}`);
  
  // In a real implementation, this would use Shopify's bulk operations API
  // But for now we'll implement a simple batching mechanism
  
  const results: R[] = [];
  const batches: T[][] = [];
  
  // Split items into batches
  for (let i = 0; i < items.length; i += options.batchSize) {
    batches.push(items.slice(i, i + options.batchSize));
  }
  
  // Process batches
  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing batch ${i + 1}/${batches.length}`);
    
    // Process batch with configured concurrency
    if (options.concurrency === 1) {
      // Serial processing
      for (const item of batches[i]) {
        const result = await operationFn(item);
        results.push(result);
      }
    } else {
      // Parallel processing with limited concurrency
      const batchResults = await Promise.all(batches[i].map(operationFn));
      results.push(...batchResults);
    }
    
    // Add a small delay between batches to prevent rate limiting
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};
