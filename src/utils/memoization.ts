
/**
 * Simple in-memory cache for memoizing expensive function results
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T, 
  options: { maxSize?: number, ttl?: number } = {}
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, { value: ReturnType<T>, timestamp: number }>();
  const maxSize = options.maxSize || 100;
  const ttl = options.ttl || 1000 * 60 * 5; // 5 minutes default
  
  return (...args: Parameters<T>): ReturnType<T> => {
    // Create a cache key from the arguments
    const key = JSON.stringify(args);
    const now = Date.now();
    
    // Check if the value is cached and not expired
    const cached = cache.get(key);
    if (cached && now - cached.timestamp < ttl) {
      return cached.value;
    }
    
    // Calculate the value
    const result = fn(...args);
    
    // If the cache is full, remove the oldest entry
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    // Cache the result
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

/**
 * Creates a version of the function that will only execute once within the specified window
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastResult: ReturnType<T> | undefined;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      lastResult = fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
