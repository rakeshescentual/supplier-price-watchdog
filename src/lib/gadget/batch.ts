/**
 * Batch processing utilities for Gadget operations
 */
import { toast } from 'sonner';
import { logInfo, logError, logDebug } from './logging';
import { reportError, trackPerformance } from './telemetry';

/**
 * Performs batch operations with configurable batch size, concurrency, and retry logic
 * @param items Array of items to process
 * @param processFn Function to process each item
 * @param options Configuration options for batch processing
 * @returns Promise resolving to array of results
 */
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options: { 
    batchSize?: number;
    maxConcurrency?: number;
    retryCount?: number;
    retryDelay?: number;
    onProgress?: (processed: number, total: number) => void;
  } = {}
): Promise<R[]> => {
  // Default options
  const {
    batchSize = 50,
    maxConcurrency = 5,
    retryCount = 3,
    retryDelay = 1000,
    onProgress
  } = options;

  if (items.length === 0) {
    return [];
  }

  logInfo(`Starting batch operation for ${items.length} items`, {
    batchSize,
    maxConcurrency,
    retryCount
  }, 'batch');

  // Track performance
  const performanceData = {
    startTime: Date.now(),
    itemCount: items.length,
    batchCount: Math.ceil(items.length / batchSize),
    successCount: 0,
    errorCount: 0,
    retryCount: 0
  };

  // Create batches
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  logDebug(`Created ${batches.length} batches`, {}, 'batch');

  const results: R[] = [];
  let processedItems = 0;

  // Helper function to process an item with retries
  const processWithRetry = async (item: T, attempt = 0): Promise<R | null> => {
    try {
      const result = await processFn(item);
      performanceData.successCount++;
      return result;
    } catch (error) {
      performanceData.errorCount++;
      
      if (attempt < retryCount) {
        performanceData.retryCount++;
        
        logDebug(`Retrying item (attempt ${attempt + 1}/${retryCount})`, {
          error: error instanceof Error ? error.message : String(error)
        }, 'batch');
        
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return processWithRetry(item, attempt + 1);
      }
      
      // Report the error after all retries have failed
      await reportError(error instanceof Error ? error : new Error(String(error)), {
        component: 'batchProcessing',
        severity: 'medium',
        metadata: { item }
      });
      
      logError(`Failed to process item after ${retryCount} retries`, {
        error: error instanceof Error ? error.message : String(error),
        item
      }, 'batch');
      
      return null;
    }
  };

  // Process batches with limited concurrency
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    logDebug(`Processing batch ${i + 1}/${batches.length} (${batch.length} items)`, {}, 'batch');
    
    // Process items in batch with limited concurrency
    const batchPromises = batch.map(item => processWithRetry(item));
    const batchResults = await Promise.all(batchPromises);
    
    // Filter out nulls (failed items) and add successful results
    const successfulResults = batchResults.filter((r): r is R => r !== null);
    results.push(...successfulResults);
    
    // Update progress
    processedItems += batch.length;
    if (onProgress) {
      onProgress(processedItems, items.length);
    }
    
    logDebug(`Completed batch ${i + 1}/${batches.length}`, {
      successCount: successfulResults.length,
      failCount: batch.length - successfulResults.length
    }, 'batch');
  }

  // Calculate performance metrics
  const totalTime = Date.now() - performanceData.startTime;
  const itemsPerSecond = items.length / (totalTime / 1000);
  
  // Report performance
  await trackPerformance('batchProcessing', {
    totalItems: performanceData.itemCount,
    successfulItems: performanceData.successCount,
    failedItems: performanceData.errorCount,
    retryCount: performanceData.retryCount,
    totalTimeMs: totalTime,
    itemsPerSecond
  });
  
  logInfo(`Batch operation completed in ${totalTime}ms`, {
    success: performanceData.successCount,
    errors: performanceData.errorCount,
    retries: performanceData.retryCount,
    itemsPerSecond: itemsPerSecond.toFixed(2)
  }, 'batch');
  
  return results;
};

/**
 * Processes paginated data using a fetch function
 * @param fetchFn Function to fetch a page of data
 * @param options Pagination options
 * @returns Promise resolving to all items
 */
export const processPaginatedData = async <T>(
  fetchFn: (page: number, pageSize: number) => Promise<{
    items: T[];
    totalItems: number;
    hasMore: boolean;
  }>,
  options: {
    pageSize?: number;
    maxPages?: number;
    onProgress?: (page: number, totalPages: number | null) => void;
  } = {}
): Promise<{
  items: T[];
  totalItems: number;
  pageCount: number;
}> => {
  const { pageSize = 50, maxPages = 0, onProgress } = options;
  
  let page = 1;
  let hasMore = true;
  let totalItems = 0;
  let estimatedTotalPages = null;
  const allItems: T[] = [];
  
  logInfo(`Starting paginated data processing`, {
    pageSize,
    maxPages: maxPages > 0 ? maxPages : 'unlimited'
  }, 'batch');
  
  while (hasMore && (maxPages === 0 || page <= maxPages)) {
    logDebug(`Fetching page ${page}`, { pageSize }, 'batch');
    
    const result = await fetchFn(page, pageSize);
    allItems.push(...result.items);
    
    totalItems = result.totalItems;
    hasMore = result.hasMore;
    
    // Calculate estimated total pages on first response
    if (page === 1) {
      estimatedTotalPages = Math.ceil(totalItems / pageSize);
      logDebug(`Estimated total pages: ${estimatedTotalPages}`, {
        totalItems
      }, 'batch');
    }
    
    if (onProgress) {
      onProgress(page, estimatedTotalPages);
    }
    
    logDebug(`Processed page ${page}`, {
      itemsInPage: result.items.length,
      totalItemsProcessed: allItems.length,
      totalItems,
      hasMore
    }, 'batch');
    
    page++;
  }
  
  logInfo(`Paginated data processing complete`, {
    totalPages: page - 1,
    totalItems: allItems.length
  }, 'batch');
  
  return {
    items: allItems,
    totalItems,
    pageCount: page - 1
  };
};
