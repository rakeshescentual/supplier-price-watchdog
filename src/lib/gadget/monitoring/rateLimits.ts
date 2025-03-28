/**
 * Shopify API rate limiting management
 * Handles rate limiting and usage tracking to prevent hitting Shopify's limits
 */

import { shopifyApiVersionManager } from '../../shopify/apiVersionManager';
import { gadgetAnalytics } from '../analytics';

// Shopify rate limit buckets (leaky bucket algorithm)
// Standard is 40 requests in flight, 2 req/sec steady state
interface RateLimitBucket {
  maxRequests: number;        // Maximum concurrent requests
  fillRate: number;           // Requests per second fill rate
  available: number;          // Currently available request slots
  lastUpdated: number;        // Last time the bucket was updated
  endpoint: string;           // API endpoint this bucket tracks
  queuedRequests: number;     // Number of requests waiting
  completedRequests: number;  // Number of completed requests
  failedRequests: number;     // Number of failed requests
  totalTime: number;          // Total request time in ms
  waitTime: number;           // Total wait time in ms
}

// Rate limit configuration per endpoint
interface RateLimitConfig {
  maxRequestsPerSecond: number;  // Requests allowed per second
  maxConcurrent: number;         // Maximum concurrent requests
  enforceLocally: boolean;       // Whether to enforce rate limits locally
  buffer: number;                // Buffer percentage (0-100)
}

// Create default rate limit config
const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequestsPerSecond: 2,
  maxConcurrent: 35, // Leave buffer of 5 from Shopify's 40
  enforceLocally: true,
  buffer: 10 // 10% buffer
};

// Rate limit buckets for different API endpoints
const rateLimitBuckets: Record<string, RateLimitBucket> = {};

// Last time we recorded analytics
let lastAnalyticsTime = 0;

// Initialization
export const initRateLimits = (): void => {
  // Reset all buckets
  Object.keys(rateLimitBuckets).forEach(key => {
    const bucket = rateLimitBuckets[key];
    bucket.available = bucket.maxRequests;
    bucket.lastUpdated = Date.now();
    bucket.queuedRequests = 0;
    bucket.completedRequests = 0;
    bucket.failedRequests = 0;
    bucket.totalTime = 0;
    bucket.waitTime = 0;
  });
  
  lastAnalyticsTime = Date.now();
};

// Get or create a rate limit bucket for an endpoint
const getBucket = (endpoint: string, config?: Partial<RateLimitConfig>): RateLimitBucket => {
  const endpointKey = normalizeEndpoint(endpoint);
  
  if (!rateLimitBuckets[endpointKey]) {
    const finalConfig = { ...DEFAULT_RATE_LIMIT_CONFIG, ...config };
    
    rateLimitBuckets[endpointKey] = {
      maxRequests: finalConfig.maxConcurrent,
      fillRate: finalConfig.maxRequestsPerSecond,
      available: finalConfig.maxConcurrent,
      lastUpdated: Date.now(),
      endpoint: endpointKey,
      queuedRequests: 0,
      completedRequests: 0,
      failedRequests: 0,
      totalTime: 0,
      waitTime: 0
    };
  }
  
  return rateLimitBuckets[endpointKey];
};

// Normalize an endpoint to a key for rate limiting
// e.g. /admin/api/2023-01/products.json -> products
const normalizeEndpoint = (endpoint: string): string => {
  // Extract API version from the endpoint
  const versionMatch = endpoint.match(/\/admin\/api\/(\d{4}-\d{2})\//);
  const version = versionMatch ? versionMatch[1] : shopifyApiVersionManager.getCurrent();
  
  // Extract the main resource type
  let resource = "unknown";
  
  if (endpoint.includes("graphql")) {
    resource = "graphql";
  } else if (endpoint.includes("products")) {
    resource = "products";
  } else if (endpoint.includes("orders")) {
    resource = "orders";
  } else if (endpoint.includes("customers")) {
    resource = "customers";
  } else if (endpoint.includes("inventory")) {
    resource = "inventory";
  } else if (endpoint.includes("metafields")) {
    resource = "metafields";
  } else if (endpoint.includes("price_rules")) {
    resource = "price_rules";
  } else {
    // Extract the last part of the path before any query params
    const pathParts = endpoint.split("?")[0].split("/");
    const lastPart = pathParts[pathParts.length - 1];
    resource = lastPart.split(".")[0] || "api";
  }
  
  return `${version}/${resource}`;
};

// Update a bucket based on elapsed time
const updateBucket = (bucket: RateLimitBucket): void => {
  const now = Date.now();
  const elapsedSeconds = (now - bucket.lastUpdated) / 1000;
  
  // Add requests back to the bucket based on fill rate and elapsed time
  const newRequests = elapsedSeconds * bucket.fillRate;
  bucket.available = Math.min(bucket.maxRequests, bucket.available + newRequests);
  bucket.lastUpdated = now;
};

// Wait for capacity in a rate limit bucket
export const waitForCapacity = async (
  endpoint: string, 
  config?: Partial<RateLimitConfig>
): Promise<void> => {
  const bucket = getBucket(endpoint, config);
  updateBucket(bucket);
  
  // If we have capacity, return immediately
  if (bucket.available >= 1) {
    bucket.available -= 1;
    return;
  }
  
  // Otherwise, calculate wait time
  const requestsNeeded = 1 - bucket.available;
  const waitTimeMs = (requestsNeeded / bucket.fillRate) * 1000;
  bucket.queuedRequests += 1;
  bucket.waitTime += waitTimeMs;
  
  // Wait for capacity
  await new Promise(resolve => setTimeout(resolve, waitTimeMs));
  
  // Update again after waiting
  updateBucket(bucket);
  bucket.available -= 1;
  bucket.queuedRequests -= 1;
};

// Track a completed request
export const trackCompletedRequest = (
  endpoint: string, 
  durationMs: number, 
  success: boolean
): void => {
  const bucket = getBucket(endpoint);
  
  if (success) {
    bucket.completedRequests += 1;
    bucket.totalTime += durationMs;
  } else {
    bucket.failedRequests += 1;
  }
  
  // Record analytics occasionally
  const now = Date.now();
  if (now - lastAnalyticsTime > 60000) { // Every minute
    recordAnalytics();
    lastAnalyticsTime = now;
  }
};

// Record analytics about rate limiting
const recordAnalytics = (): void => {
  // For each bucket with activity
  Object.values(rateLimitBuckets)
    .filter(bucket => bucket.completedRequests > 0 || bucket.failedRequests > 0)
    .forEach(bucket => {
      const totalRequests = bucket.completedRequests + bucket.failedRequests;
      if (totalRequests === 0) return;
      
      const avgTime = bucket.completedRequests > 0
        ? bucket.totalTime / bucket.completedRequests
        : 0;
      
      const stats = {
        endpoint: bucket.endpoint,
        completedRequests: bucket.completedRequests,
        failedRequests: bucket.failedRequests,
        avgRequestTime: Math.round(avgTime),
        avgWaitTime: bucket.queuedRequests > 0
          ? Math.round(bucket.waitTime / bucket.queuedRequests)
          : 0,
        usagePercentage: Math.round((1 - (bucket.available / bucket.maxRequests)) * 100)
      };
      
      // Track performance
      gadgetAnalytics.trackPerformance(`shopify_api:${bucket.endpoint}`, avgTime);
    });
};

// Get rate limit usage for all buckets
export const getRateLimitUsage = (): Record<string, {
  used: number;
  available: number;
  percentUsed: number;
}> => {
  const usage: Record<string, {
    used: number;
    available: number;
    percentUsed: number;
  }> = {};
  
  Object.entries(rateLimitBuckets).forEach(([key, bucket]) => {
    updateBucket(bucket);
    
    const used = bucket.maxRequests - bucket.available;
    usage[key] = {
      used,
      available: bucket.available,
      percentUsed: Math.round((used / bucket.maxRequests) * 100)
    };
  });
  
  return usage;
};
