
import { toast } from 'sonner';
import type { PriceItem, GadgetConfig } from '@/types/price';
import { getGadgetConfig, validateGadgetConfig } from './gadget-helpers';
import { initGadgetClient, isGadgetInitialized } from '@/lib/gadgetApi';

/**
 * Type for Gadget API response
 */
interface GadgetResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Safe API call wrapper for Gadget API
 */
export async function gadgetApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  errorMessage = "API request failed"
): Promise<GadgetResponse<T>> {
  const config = getGadgetConfig();
  if (!config) {
    return {
      success: false,
      error: "Gadget configuration missing",
      statusCode: 400
    };
  }

  const { isValid, errors } = validateGadgetConfig(config);
  if (!isValid) {
    return {
      success: false,
      error: `Invalid Gadget configuration: ${errors.join(", ")}`,
      statusCode: 400
    };
  }

  const appId = config.environment === 'production'
    ? config.appId
    : `${config.appId}--development`;

  const url = `https://${appId}.gadget.app/api/${endpoint}`;

  // Prepare headers
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Authorization', `Bearer ${config.apiKey}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || AbortSignal.timeout(30000) // 30 second timeout
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      return {
        success: false,
        error: `Rate limit exceeded. Retry after ${retryAfter || 'some time'}.`,
        statusCode: 429
      };
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        error: "Authentication failed. Please check your API key.",
        statusCode: response.status
      };
    }

    // Parse response
    let data;
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return {
        success: false,
        error: typeof data === 'object' && data.message ? data.message : `${errorMessage}: ${response.statusText}`,
        data,
        statusCode: response.status
      };
    }

    return {
      success: true,
      data: data as T,
      statusCode: response.status
    };
  } catch (error) {
    console.error(`Gadget API error (${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      statusCode: 0 // Network error or timeout
    };
  }
}

/**
 * Upload a file to Gadget storage
 */
export async function uploadFileToGadget(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  if (!isGadgetInitialized()) {
    return { success: false, error: "Gadget is not initialized" };
  }

  const config = getGadgetConfig();
  if (!config) {
    return { success: false, error: "Gadget configuration missing" };
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Use XMLHttpRequest for upload progress
    if (onProgress) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({ success: true, fileId: response.fileId });
            } catch (error) {
              resolve({ 
                success: false, 
                error: "Error parsing response" 
              });
            }
          } else {
            resolve({ 
              success: false, 
              error: `Upload failed with status ${xhr.status}` 
            });
          }
        });

        xhr.addEventListener('error', () => {
          resolve({ 
            success: false, 
            error: "Network error during upload" 
          });
        });

        xhr.addEventListener('abort', () => {
          resolve({ 
            success: false, 
            error: "Upload aborted" 
          });
        });

        // Open and send the request
        const appId = config.environment === 'production'
          ? config.appId
          : `${config.appId}--development`;
          
        xhr.open('POST', `https://${appId}.gadget.app/api/files/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${config.apiKey}`);
        xhr.send(formData);
      });
    } else {
      // Use fetch when progress tracking isn't needed
      const response = await gadgetApiCall<{ fileId: string }>(
        'files/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type here, it will be set by the browser
          }
        },
        "File upload failed"
      );

      if (!response.success) {
        return { 
          success: false, 
          error: response.error 
        };
      }

      return { 
        success: true, 
        fileId: response.data?.fileId 
      };
    }
  } catch (error) {
    console.error("Error uploading file to Gadget:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown upload error" 
    };
  }
}

/**
 * Process a PDF document with Gadget
 */
export async function processPdfDocumentWithGadget(
  fileId: string,
  options = { waitForCompletion: true, pollingInterval: 2000, timeout: 60000 }
): Promise<{ success: boolean; items?: PriceItem[]; error?: string }> {
  // Start processing
  const processingResponse = await gadgetApiCall<{ jobId: string }>(
    'actions/processPdfDocument',
    {
      method: 'POST',
      body: JSON.stringify({ fileId })
    },
    "PDF processing failed"
  );

  if (!processingResponse.success) {
    return { 
      success: false, 
      error: processingResponse.error 
    };
  }

  const jobId = processingResponse.data?.jobId;
  if (!jobId) {
    return { 
      success: false, 
      error: "No job ID returned from processing request" 
    };
  }

  // If we don't need to wait for completion, return immediately
  if (!options.waitForCompletion) {
    toast.success("PDF processing started", {
      description: "Processing has been initiated. Check back later for results."
    });
    return { success: true };
  }

  // Poll for job completion
  const startTime = Date.now();
  let items: PriceItem[] = [];

  while (Date.now() - startTime < options.timeout) {
    await new Promise(resolve => setTimeout(resolve, options.pollingInterval));

    const statusResponse = await gadgetApiCall<{
      status: 'pending' | 'processing' | 'complete' | 'error';
      result?: { items: PriceItem[] };
      error?: string;
    }>(
      `jobs/${jobId}`,
      {},
      "Job status check failed"
    );

    if (!statusResponse.success) {
      console.warn("Error checking job status:", statusResponse.error);
      continue;
    }

    const status = statusResponse.data?.status;

    if (status === 'complete' && statusResponse.data?.result?.items) {
      items = statusResponse.data.result.items;
      break;
    } else if (status === 'error') {
      return { 
        success: false, 
        error: statusResponse.data?.error || "Processing job failed" 
      };
    } else if (status === 'pending' || status === 'processing') {
      // Continue polling
      continue;
    }
  }

  if (items.length === 0) {
    return { 
      success: false, 
      error: "Processing timed out or returned no items" 
    };
  }

  return { success: true, items };
}

/**
 * Enrich product data with market information
 */
export async function enrichProductsWithMarketData(
  items: PriceItem[],
  options = { batchSize: 20 }
): Promise<{ success: boolean; items?: PriceItem[]; error?: string }> {
  if (items.length === 0) {
    return { success: true, items: [] };
  }

  try {
    // Process in batches to avoid timeouts
    const enrichedItems: PriceItem[] = [];
    const batches: PriceItem[][] = [];

    // Split into batches
    for (let i = 0; i < items.length; i += options.batchSize) {
      batches.push(items.slice(i, i + options.batchSize));
    }

    // Process each batch
    for (const [index, batch] of batches.entries()) {
      toast.info(`Processing batch ${index + 1}/${batches.length}`, {
        description: "Enriching products with market data..."
      });

      const response = await gadgetApiCall<{ products: PriceItem[] }>(
        'actions/enrichMarketData',
        {
          method: 'POST',
          body: JSON.stringify({ products: batch })
        },
        "Market data enrichment failed"
      );

      if (!response.success) {
        console.error("Batch enrichment failed:", response.error);
        // Continue with other batches even if one fails
        continue;
      }

      if (response.data?.products) {
        enrichedItems.push(...response.data.products);
      }
    }

    if (enrichedItems.length === 0) {
      return { 
        success: false, 
        error: "No products were successfully enriched" 
      };
    }

    if (enrichedItems.length < items.length) {
      toast.warning("Partial enrichment", {
        description: `Only ${enrichedItems.length} of ${items.length} products were enriched.`
      });
    }

    return { success: true, items: enrichedItems };
  } catch (error) {
    console.error("Error enriching products:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown enrichment error" 
    };
  }
}
