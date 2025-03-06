
/**
 * Utility functions for batch processing with Gadget
 */

/**
 * Perform batch operations with retry logic
 * @param items Items to process
 * @param processFn Function to process each item
 * @param options Batch processing options
 * @returns Promise resolving to array of results
 */
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options = { 
    batchSize: 50,
    retryCount: 3,
    retryDelay: 1000,
    maxConcurrency: 5,
    onProgress: (processed: number, total: number) => void
  }
): Promise<R[]> => {
  const results: R[] = [];
  const errors: Record<number, string> = {};
  const batchSize = options.batchSize || 50;
  
  // Process in batches to avoid rate limiting
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(items.length / batchSize)}`);
    
    // Process batch items with concurrency limit
    const batchPromises = batch.map(async (item, batchIndex) => {
      const itemIndex = i + batchIndex;
      
      // Implement retry logic
      for (let attempt = 0; attempt < (options.retryCount || 3); attempt++) {
        try {
          const result = await processFn(item);
          
          // Report progress if callback provided
          if (options.onProgress) {
            options.onProgress(itemIndex + 1, items.length);
          }
          
          return result;
        } catch (error) {
          console.error(`Error processing item ${itemIndex} (attempt ${attempt + 1}/${options.retryCount}):`, error);
          
          // Last attempt failed, record error
          if (attempt === (options.retryCount || 3) - 1) {
            errors[itemIndex] = error instanceof Error ? error.message : "Unknown error";
            return {} as R; // Return placeholder value for failed items
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, options.retryDelay || 1000));
        }
      }
      
      // This is a fallback return to satisfy TypeScript
      // It should never be reached due to the return in the catch block above
      return {} as R;
    });
    
    // Process batch with limited concurrency
    const batchResults = await processBatchWithConcurrency(
      batchPromises, 
      options.maxConcurrency || 5
    );
    
    results.push(...batchResults);
  }
  
  // Log any errors that occurred
  const errorCount = Object.keys(errors).length;
  if (errorCount > 0) {
    console.warn(`${errorCount} items failed to process:`, errors);
  }
  
  return results;
};

/**
 * Process promises with concurrency limit
 * @param promises Array of promises to process
 * @param concurrency Maximum number of concurrent promises
 * @returns Promise resolving to array of results
 */
export async function processBatchWithConcurrency<R>(
  promises: Promise<R>[], 
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  
  // Process in chunks based on concurrency limit
  for (let i = 0; i < promises.length; i += concurrency) {
    const chunk = promises.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk);
    results.push(...chunkResults);
  }
  
  return results;
}
