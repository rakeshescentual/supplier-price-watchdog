
/**
 * Pagination utilities for batch processing
 */
import { logInfo, logDebug } from '../logging';

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
