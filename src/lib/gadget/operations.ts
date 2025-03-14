
/**
 * Core operation utilities for Gadget
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { testGadgetConnection } from './client/connection';

/**
 * Check if Gadget is properly configured and available
 */
export const ensureGadgetAvailable = async (): Promise<boolean> => {
  const client = initGadgetClient();
  
  if (!client) {
    logError('Gadget client not initialized', {}, 'operations');
    return false;
  }
  
  const isConnected = await testGadgetConnection();
  
  if (!isConnected) {
    logError('Gadget API not available', {}, 'operations');
    return false;
  }
  
  return true;
};

/**
 * Modern error handling for Gadget API errors
 * @param error Error to process
 * @returns Processed error information
 */
export const processGadgetError = (error: unknown): {
  message: string;
  code: string;
  isRetryable: boolean;
  details?: any;
} => {
  // Default error info
  let message = 'Unknown error occurred';
  let code = 'UNKNOWN';
  let isRetryable = false;
  let details = undefined;
  
  // Handle Error objects
  if (error instanceof Error) {
    message = error.message;
    
    // In production with actual Gadget SDK:
    // 
    // if (error instanceof GadgetApiError) {
    //   code = error.code;
    //   isRetryable = error.isRetryable;
    //   details = error.details;
    // } else if (error instanceof GadgetConnectionError) {
    //   code = 'CONNECTION_ERROR';
    //   isRetryable = true;
    // } else if (error instanceof GadgetValidationError) {
    //   code = 'VALIDATION_ERROR';
    //   isRetryable = false;
    //   details = error.validationErrors;
    // } else if (error instanceof GadgetPermissionError) {
    //   code = 'PERMISSION_ERROR';
    //   isRetryable = false;
    // }
    
    // Mock for development - extract code if available
    code = (error as any).code || 'ERROR';
    isRetryable = ['NETWORK_ERROR', 'RATE_LIMITED', 'SERVICE_UNAVAILABLE'].includes(code);
  } else if (typeof error === 'string') {
    message = error;
  }
  
  return { message, code, isRetryable, details };
};

/**
 * Execute a Gadget operation with modern error handling patterns
 */
export const executeGadgetOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  options: {
    fallback?: T;
    retries?: number;
    retryDelay?: number;
    retryBackoff?: boolean;
  } = {}
): Promise<T | undefined> => {
  const { 
    fallback, 
    retries = 3, 
    retryDelay = 1000, 
    retryBackoff = true 
  } = options;
  
  const isAvailable = await ensureGadgetAvailable();
  
  if (!isAvailable) {
    if (fallback !== undefined) {
      return fallback;
    }
    return undefined;
  }
  
  let attempts = 0;
  
  while (attempts <= retries) {
    try {
      if (attempts > 0) {
        logInfo(`Retrying operation: ${operationName} (Attempt ${attempts + 1}/${retries + 1})`, {}, 'operations');
      } else {
        logInfo(`Executing operation: ${operationName}`, {}, 'operations');
      }
      
      return await operation();
    } catch (error) {
      attempts++;
      const processedError = processGadgetError(error);
      
      logError(`Error executing operation: ${operationName}`, { 
        ...processedError,
        attempt: attempts,
        maxAttempts: retries + 1
      }, 'operations');
      
      // If we have retries left and the error is retryable
      if (attempts <= retries && processedError.isRetryable) {
        // Calculate delay with exponential backoff if enabled
        const delay = retryBackoff 
          ? retryDelay * Math.pow(2, attempts - 1)
          : retryDelay;
          
        logInfo(`Waiting ${delay}ms before retry`, {}, 'operations');
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // No more retries or non-retryable error
      if (fallback !== undefined) {
        return fallback;
      }
      
      throw error;
    }
  }
  
  // This should never happen, but TypeScript needs it
  if (fallback !== undefined) {
    return fallback;
  }
  
  return undefined;
};

/**
 * Execute a batch operation using Gadget's Background Jobs
 * Updated to use modern Gadget background job patterns
 */
export const executeBatchOperationWithBackgroundJob = async <T, R>(
  operationName: string,
  items: T[],
  options: {
    batchSize?: number;
    timeoutMs?: number;
    priority?: 'high' | 'normal' | 'low';
    onProgress?: (processed: number, total: number) => void;
  } = {}
): Promise<{
  jobId: string;
  status: string;
  items?: R[];
}> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error('Gadget client not initialized');
  }
  
  const { 
    batchSize = 100, 
    timeoutMs = 300000, // 5 minutes
    priority = 'normal',
    onProgress
  } = options;
  
  try {
    logInfo(`Starting background job for ${operationName}`, {
      itemCount: items.length,
      batchSize,
      priority
    }, 'operations');
    
    // In production with actual Gadget SDK:
    //
    // const job = await client.backgroundJobs.create({
    //   action: operationName,
    //   params: {
    //     items,
    //     batchSize
    //   },
    //   options: {
    //     priority,
    //     timeoutMs
    //   }
    // });
    //
    // // Set up polling for job status if onProgress is provided
    // if (onProgress) {
    //   const pollInterval = setInterval(async () => {
    //     const status = await client.backgroundJobs.get(job.id);
    //     if (status.progress) {
    //       onProgress(status.progress.current, status.progress.total);
    //     }
    //     if (['completed', 'failed', 'cancelled'].includes(status.status)) {
    //       clearInterval(pollInterval);
    //     }
    //   }, 2000);
    // }
    //
    // return {
    //   jobId: job.id,
    //   status: job.status
    // };
    
    // Mock for development
    const mockJobId = `job-${Date.now()}`;
    
    // Simulate progress updates
    if (onProgress) {
      const totalItems = items.length;
      const updateInterval = Math.max(1000, Math.min(5000, totalItems / 10));
      
      let processed = 0;
      const interval = setInterval(() => {
        processed += Math.min(batchSize, totalItems - processed);
        onProgress(processed, totalItems);
        
        if (processed >= totalItems) {
          clearInterval(interval);
        }
      }, updateInterval);
    }
    
    // Return mock job info
    return {
      jobId: mockJobId,
      status: 'created'
    };
  } catch (error) {
    const processedError = processGadgetError(error);
    logError(`Error starting background job for ${operationName}`, processedError, 'operations');
    throw error;
  }
};
