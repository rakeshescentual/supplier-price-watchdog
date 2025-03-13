
/**
 * Batch operation utilities for Gadget integration
 */
import { logInfo, logError } from './logging';

/**
 * Process an array of items in batches
 * @param items Array of items to process
 * @param processFn Function to process each item
 * @param batchSize Size of each batch
 * @returns Array of processing results
 */
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize = 50
): Promise<R[]> => {
  const results: R[] = [];
  
  // Process items in batches to avoid rate limiting
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    logInfo(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(items.length / batchSize)}`, {
      batchSize,
      totalItems: items.length,
      progress: `${i + batch.length}/${items.length}`
    }, 'batch');
    
    // Process items in current batch concurrently
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        try {
          return await processFn(item);
        } catch (error) {
          logError('Error processing batch item', { error }, 'batch');
          throw error;
        }
      })
    );
    
    results.push(...batchResults);
    
    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
};

/**
 * Process paginated data from an API
 * @param fetchFn Function to fetch a page of data
 * @param startPage Starting page number
 * @param pageSize Size of each page
 * @returns Combined array of all pages of data
 */
export const processPaginatedData = async <T>(
  fetchFn: (page: number, pageSize: number) => Promise<{
    data: T[];
    hasMore: boolean;
    totalPages?: number;
  }>,
  startPage = 1,
  pageSize = 50
): Promise<T[]> => {
  let currentPage = startPage;
  let hasMore = true;
  const allData: T[] = [];
  
  while (hasMore) {
    logInfo(`Fetching page ${currentPage}`, { pageSize }, 'pagination');
    
    const { data, hasMore: moreData, totalPages } = await fetchFn(currentPage, pageSize);
    
    allData.push(...data);
    hasMore = moreData;
    
    logInfo(`Fetched page ${currentPage}${totalPages ? ` of ${totalPages}` : ''}`, {
      itemCount: data.length,
      totalFetched: allData.length
    }, 'pagination');
    
    currentPage++;
    
    // Add a small delay between pages to avoid rate limiting
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  return allData;
};
