
/**
 * Batch operation utilities for processing large sets of data
 */
import { logInfo, logError } from '../logging';
import { trackPerformance } from '../telemetry';

/**
 * Perform batch operations on a large set of items
 * 
 * @param items Items to process
 * @param processFn Function to process each item
 * @param batchSize Size of each batch
 * @returns Results of processing all items
 */
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize: number = 50
): Promise<R[]> => {
  // Create batches
  const batches: T[][] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  logInfo(`Split ${items.length} items into ${batches.length} batches`, {
    batchSize,
    totalItems: items.length
  }, 'batch');
  
  // Track performance
  const completeTracking = trackPerformance('batchOperations', {
    totalItems: items.length,
    batchCount: batches.length,
    batchSize
  });
  
  // Process batches sequentially to avoid overwhelming the API
  const results: R[] = [];
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    logInfo(`Processing batch ${i + 1}/${batches.length}`, {
      batchSize: batch.length,
      batchIndex: i
    }, 'batch');
    
    try {
      // Process items in parallel within each batch
      const batchResults = await Promise.all(batch.map(processFn));
      results.push(...batchResults);
    } catch (error) {
      logError(`Error processing batch ${i + 1}`, { error, batchIndex: i }, 'batch');
      throw error;
    }
  }
  
  // Complete performance tracking
  await completeTracking();
  
  return results;
};
