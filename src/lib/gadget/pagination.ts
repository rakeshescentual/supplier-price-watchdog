
import { toast } from 'sonner';
import { logInfo, logError } from './logging';

export interface PaginationOptions {
  pageSize: number;
  maxPages?: number;
  startPage?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic function to fetch paginated data from Gadget
 * @param fetchFn Function to fetch a single page of data
 * @param options Pagination options
 * @returns Promise resolving to paginated result
 */
export const fetchPaginatedData = async <T>(
  fetchFn: (page: number, pageSize: number) => Promise<{
    items: T[];
    totalItems?: number;
    hasMore?: boolean;
  }>,
  options: PaginationOptions = { pageSize: 50, startPage: 1 }
): Promise<PaginatedResult<T>> => {
  const pageSize = options.pageSize;
  const startPage = options.startPage || 1;
  const maxPages = options.maxPages;
  
  try {
    logInfo('Fetching paginated data', { pageSize, startPage, maxPages }, 'pagination');
    
    // Fetch first page to get total items or determine if there's more
    const firstPageResult = await fetchFn(startPage, pageSize);
    const items = [...firstPageResult.items];
    let totalItems = firstPageResult.totalItems;
    let hasMore = firstPageResult.hasMore;
    
    // If total items is not provided but hasMore is true, we need to fetch more pages
    let currentPage = startPage;
    if (!totalItems && hasMore && (!maxPages || currentPage < maxPages)) {
      logInfo('Total items unknown, fetching additional pages', {}, 'pagination');
      
      // Continue fetching pages until we either run out of data or hit maxPages
      while (hasMore && (!maxPages || currentPage < maxPages)) {
        currentPage++;
        const nextPageResult = await fetchFn(currentPage, pageSize);
        
        items.push(...nextPageResult.items);
        hasMore = nextPageResult.hasMore;
        
        if (nextPageResult.totalItems) {
          totalItems = nextPageResult.totalItems;
        }
      }
    }
    
    // If we still don't have totalItems, use the number of items we've fetched
    if (!totalItems) {
      totalItems = items.length;
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    
    const result: PaginatedResult<T> = {
      items,
      totalItems,
      totalPages,
      currentPage: startPage,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: startPage > 1
    };
    
    logInfo('Paginated data fetched successfully', { 
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      itemsFetched: result.items.length
    }, 'pagination');
    
    return result;
  } catch (error) {
    logError('Error fetching paginated data', { error }, 'pagination');
    
    toast.error("Pagination error", {
      description: "Failed to fetch paginated data. Please try again."
    });
    
    // Return an empty result with error information
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: startPage,
      pageSize,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
};

/**
 * Fetch specific page from a paginated data source
 * @param fetchFn Function to fetch a single page of data
 * @param page Page number to fetch
 * @param pageSize Number of items per page
 * @returns Promise resolving to paginated result
 */
export const fetchPage = async <T>(
  fetchFn: (page: number, pageSize: number) => Promise<{
    items: T[];
    totalItems?: number;
    hasMore?: boolean;
  }>,
  page: number,
  pageSize: number
): Promise<PaginatedResult<T>> => {
  return fetchPaginatedData(fetchFn, {
    pageSize,
    startPage: page
  });
};

/**
 * Create a paginated fetch function for a specific Gadget endpoint
 * @param endpointFn Function to call Gadget endpoint with pagination parameters
 * @returns Function to fetch paginated data
 */
export const createPaginatedFetcher = <T>(
  endpointFn: (params: { page: number; pageSize: number }) => Promise<{
    data: T[];
    meta?: { total?: number; hasMore?: boolean };
  }>
) => {
  return async (page: number, pageSize: number) => {
    const response = await endpointFn({ page, pageSize });
    
    return {
      items: response.data,
      totalItems: response.meta?.total,
      hasMore: response.meta?.hasMore
    };
  };
};
