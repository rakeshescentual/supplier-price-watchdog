
/**
 * Performance optimization utilities
 */

// Request animation frame based throttle
export const rafThrottle = <T extends (...args: any[]) => any>(callback: T): T => {
  let requestId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  const throttled = (...args: Parameters<T>): void => {
    lastArgs = args;
    
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        if (lastArgs) {
          callback(...lastArgs);
        }
        requestId = null;
      });
    }
  };
  
  return throttled as T;
};

// Debounce function with optional immediate execution
export const debounce = <T extends (...args: any[]) => any>(
  callback: T, 
  wait = 300, 
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const callNow = immediate && !timeout;
    
    const later = () => {
      timeout = null;
      if (!immediate) callback(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
    
    if (callNow) callback(...args);
  };
};

// Memoize results of expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  fn: T, 
  resolver?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Chunk processing for large arrays to prevent UI blocking
export const processInChunks = async <T, R>(
  items: T[],
  processFn: (chunk: T[]) => Promise<R[]>,
  chunkSize = 50
): Promise<R[]> => {
  const results: R[] = [];
  const chunks: T[][] = [];
  
  // Create chunks
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  
  // Process each chunk with a small delay between chunks
  for (const chunk of chunks) {
    const chunkResults = await processFn(chunk);
    results.push(...chunkResults);
    
    // Small delay to allow UI to breathe
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
};
