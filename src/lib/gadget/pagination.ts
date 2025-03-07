
/**
 * Pagination utilities for Gadget operations
 */
import { logInfo, logDebug } from './logging';

/**
 * Interface for paginated results
 */
export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Create a paginated result from an array of items
 * @param items Full array of items
 * @param page Current page number (1-indexed)
 * @param pageSize Number of items per page
 * @returns Paginated result
 */
export const paginate = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 20
): PaginatedResult<T> => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    totalItems,
    currentPage,
    totalPages,
    pageSize,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};

/**
 * Extract pagination parameters from a URL query string
 * @param query URL query string or URLSearchParams
 * @param defaults Default pagination parameters
 * @returns Pagination parameters
 */
export const getPaginationParams = (
  query: string | URLSearchParams,
  defaults: { page?: number; pageSize?: number } = {}
): { page: number; pageSize: number } => {
  const params = typeof query === 'string' 
    ? new URLSearchParams(query) 
    : query;
  
  const page = Math.max(1, parseInt(params.get('page') || String(defaults.page || 1), 10));
  const pageSize = Math.max(1, parseInt(params.get('pageSize') || String(defaults.pageSize || 20), 10));
  
  return { page, pageSize };
};

/**
 * Generate pagination information for a URL-based API
 * @param baseUrl Base URL for pagination links
 * @param pagination Pagination parameters
 * @returns Pagination links
 */
export const generatePaginationLinks = (
  baseUrl: string,
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  }
): {
  self: string;
  first: string;
  last: string;
  next?: string;
  prev?: string;
} => {
  const { currentPage, totalPages, pageSize } = pagination;
  
  const createUrl = (page: number) => {
    const url = new URL(baseUrl);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());
    return url.toString();
  };
  
  const links = {
    self: createUrl(currentPage),
    first: createUrl(1),
    last: createUrl(totalPages)
  };
  
  if (currentPage < totalPages) {
    links['next'] = createUrl(currentPage + 1);
  }
  
  if (currentPage > 1) {
    links['prev'] = createUrl(currentPage - 1);
  }
  
  return links;
};

/**
 * Handle cursor-based pagination for Gadget APIs
 * @param fetchFn Function to fetch a page of data
 * @param options Pagination options
 * @returns Promise resolving to all items
 */
export const fetchAllWithCursorPagination = async <T>(
  fetchFn: (cursor?: string) => Promise<{
    items: T[];
    cursor?: string;
    hasMore: boolean;
  }>,
  options: {
    maxPages?: number;
    onProgress?: (items: T[], hasMore: boolean) => void;
  } = {}
): Promise<T[]> => {
  const { maxPages = 0, onProgress } = options;
  
  let cursor: string | undefined;
  let hasMore = true;
  let pageCount = 0;
  const allItems: T[] = [];
  
  logInfo('Starting cursor-based pagination', {
    maxPages: maxPages > 0 ? maxPages : 'unlimited'
  }, 'pagination');
  
  while (hasMore && (maxPages === 0 || pageCount < maxPages)) {
    pageCount++;
    
    logDebug(`Fetching page ${pageCount} with cursor: ${cursor || 'initial'}`, {}, 'pagination');
    
    const result = await fetchFn(cursor);
    
    allItems.push(...result.items);
    cursor = result.cursor;
    hasMore = result.hasMore && !!cursor;
    
    if (onProgress) {
      onProgress(result.items, hasMore);
    }
    
    logDebug(`Processed page ${pageCount}`, {
      itemsInPage: result.items.length,
      totalItemsProcessed: allItems.length,
      hasMore
    }, 'pagination');
  }
  
  logInfo('Pagination complete', {
    totalPages: pageCount,
    totalItems: allItems.length
  }, 'pagination');
  
  return allItems;
};
