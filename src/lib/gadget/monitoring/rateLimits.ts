
import { toast } from 'sonner';
import { gadgetAnalytics } from '../analytics';

interface RateLimitInfo {
  remaining: number;
  limit: number;
  percentage: number;
  isWarning: boolean;
  isCritical: boolean;
  reset?: Date;
}

interface RateLimitOptions {
  showToasts?: boolean;
  trackMetrics?: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  showToasts: true,
  trackMetrics: true,
  warningThreshold: 20, // 20% remaining
  criticalThreshold: 10, // 10% remaining
};

/**
 * Monitors Shopify API rate limits from response headers
 */
export const monitorShopifyRateLimit = (
  response: Response,
  options: RateLimitOptions = {}
): RateLimitInfo => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Extract rate limit headers from Shopify response
    const limitHeader = response.headers.get('X-Shopify-Shop-Api-Call-Limit');
    
    if (!limitHeader) {
      console.warn('No rate limit header found in Shopify response');
      return {
        remaining: 40,
        limit: 40,
        percentage: 100,
        isWarning: false,
        isCritical: false
      };
    }
    
    const [usedStr, limitStr] = limitHeader.split('/');
    const used = parseInt(usedStr || '0');
    const limit = parseInt(limitStr || '40');
    const remaining = limit - used;
    const percentage = (remaining / limit) * 100;
    
    // Determine if we're approaching limits
    const isWarning = percentage <= mergedOptions.warningThreshold!;
    const isCritical = percentage <= mergedOptions.criticalThreshold!;
    
    // Extract retry-after header if present
    const retryAfter = response.headers.get('Retry-After');
    const reset = retryAfter ? new Date(Date.now() + parseInt(retryAfter) * 1000) : undefined;
    
    // Log rate limit usage
    console.log(`Shopify API Rate Limit: ${used}/${limit} (${percentage.toFixed(1)}% remaining)`);
    
    // Track as metric if enabled and usage is high
    if (mergedOptions.trackMetrics) {
      gadgetAnalytics.trackBusinessMetric('shopify_rate_limit', percentage, {
        used,
        remaining,
        limit,
        critical: isCritical,
        warning: isWarning,
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined
      });
    }
    
    // Show toast if enabled and usage is critical
    if (mergedOptions.showToasts) {
      if (isCritical) {
        console.warn('Critical Shopify API rate limit usage!');
        
        toast.warning('API Rate Limit Warning', {
          description: `Using ${used}/${limit} API calls. Operations may be delayed.${
            reset ? ` Rate limit resets at ${reset.toLocaleTimeString()}.` : ''
          }`
        });
      } else if (isWarning && percentage < 15) {
        // Only show warning toasts when it's getting quite low to avoid spam
        toast.info('API Rate Limit Notice', {
          description: `Approaching Shopify API rate limits (${percentage.toFixed(0)}% remaining)`
        });
      }
    }
    
    return { 
      remaining, 
      limit, 
      percentage, 
      isWarning,
      isCritical,
      reset
    };
  } catch (error) {
    console.error('Error monitoring rate limit:', error);
    return { 
      remaining: 40, 
      limit: 40, 
      percentage: 100,
      isWarning: false,
      isCritical: false
    };
  }
};

/**
 * Implements exponential backoff strategy for rate limited requests
 */
export const handleRateLimitBackoff = async (
  fn: () => Promise<Response>,
  maxRetries = 5
): Promise<Response> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fn();
      
      // Check if we hit a rate limit
      if (response.status === 429) {
        retries++;
        
        // Get retry-after header or use exponential backoff
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter 
          ? parseInt(retryAfter) * 1000
          : Math.min(1000 * Math.pow(2, retries), 30000); // Max 30 second wait
        
        console.warn(`Rate limited by Shopify. Retrying in ${waitTime/1000}s (Attempt ${retries}/${maxRetries})`);
        
        // Track rate limit event
        gadgetAnalytics.trackBusinessMetric('shopify_rate_limited', retries, {
          waitTime,
          retryAfter: retryAfter ? parseInt(retryAfter) : null
        });
        
        if (retries === 1) {
          // Only show toast on first rate limit to avoid spamming
          toast.warning('API Rate Limit Reached', {
            description: `Request was rate limited. Retrying automatically.`
          });
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If not rate limited, return the response
      return response;
    } catch (error) {
      // If it's a network error, retry with backoff
      retries++;
      const waitTime = Math.min(1000 * Math.pow(2, retries), 30000);
      
      console.error(`Error during request (Attempt ${retries}/${maxRetries}):`, error);
      
      if (retries < maxRetries) {
        console.warn(`Retrying in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error; // Max retries exceeded, propagate the error
      }
    }
  }
  
  throw new Error(`Max retries (${maxRetries}) exceeded for request`);
};

/**
 * Batch requests to ensure they don't exceed rate limits
 */
export const batchShopifyRequests = async <T>(
  requests: (() => Promise<T>)[],
  batchSize = 5,
  delayBetweenBatches = 1000
): Promise<T[]> => {
  const results: T[] = [];
  
  // Process in batches
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    
    // Track batch execution
    const batchStart = performance.now();
    
    // Execute current batch in parallel
    const batchResults = await Promise.all(batch.map(request => request()));
    results.push(...batchResults);
    
    const batchDuration = performance.now() - batchStart;
    
    // Track performance of batch
    gadgetAnalytics.trackPerformance('shopify_batch_request', batchDuration, {
      batchSize: batch.length,
      totalBatches: Math.ceil(requests.length / batchSize),
      currentBatch: Math.floor(i / batchSize) + 1
    });
    
    // If this isn't the last batch, wait before the next one
    if (i + batchSize < requests.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }
  
  return results;
};
