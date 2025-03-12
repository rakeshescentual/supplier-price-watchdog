/**
 * Export utilities for Gadget data
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { startPerformanceTracking } from './telemetry';
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';

/**
 * Available export formats
 */
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf' | 'xml' | 'txt' | 'parquet' | 'avro';

/**
 * Export compression options
 */
export type CompressionType = 'gzip' | 'zip' | 'brotli' | 'none';

/**
 * Options for export operation
 */
export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  filename?: string;
  filterBy?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  compression?: CompressionType;
  expiresIn?: number; // File expiration in seconds
  accessControl?: {
    public?: boolean;
    allowedEmails?: string[];
    password?: string;
    requireSignin?: boolean;
  };
  transformFn?: (data: any) => any; // Function to transform data before export
  includeHeaders?: boolean; // For CSV exports
  templateId?: string; // For PDF exports
  maxRowsPerFile?: number; // For splitting large exports
  includeTimestamp?: boolean; // Add timestamp to filename
  delimiter?: string; // For CSV format, default is comma
  encryptOutput?: boolean; // Encrypt the exported data
  useIncrementalExport?: boolean; // Use incremental export for large datasets
  useCompression?: boolean; // Use compression for large files
}

/**
 * Result from export operation
 */
export interface ExportResult {
  success: boolean;
  fileUrl?: string;
  expiresAt?: Date;
  fileSize?: number;
  downloadCount?: number;
  fileParts?: number; // Number of files if split into multiple parts
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  jobId?: string; // For background export jobs
  status?: 'completed' | 'processing' | 'failed';
}

/**
 * Export data to a file with enhanced options
 * @param data Data to export
 * @param options Export options
 * @returns Promise resolving to export result
 */
export const exportData = async <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): Promise<ExportResult> => {
  const finishTracking = startPerformanceTracking('exportData', { 
    format: options.format,
    itemCount: data.length,
    compressionType: options.compression || 'none',
    includeMetadata: !!options.includeMetadata
  });
  
  try {
    logInfo(`Exporting ${data.length} items to ${options.format}`, options, 'export');
    
    // Apply transformations if needed
    const processedData = options.transformFn ? data.map(options.transformFn) : data;
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, create a mock export
    let fileUrl = '';
    
    // In production with actual Gadget.dev SDK:
    // Use Gadget's FileManager API for more efficient file handling
    // const fileManager = client.files;
    // const result = await fileManager.createFromData({
    //   data: typeof processedData === 'string' ? processedData : JSON.stringify(processedData),
    //   mimeType: getMimeType(options.format),
    //   filename: getExportFilename(options),
    //   compression: options.compression || 'none',
    //   expiresIn: options.expiresIn || 3600 * 24, // 24 hours default
    //   accessControl: options.accessControl || { public: true },
    //   metadata: options.includeMetadata ? { exportDate: new Date().toISOString() } : undefined,
    //   encrypted: options.encryptOutput || false,
    //   partSize: options.maxRowsPerFile // For splitting large files
    // });
    // 
    // return {
    //   success: true, 
    //   fileUrl: result.signedUrl,
    //   expiresAt: result.expiresAt ? new Date(result.expiresAt) : undefined,
    //   fileSize: result.size,
    //   fileParts: result.parts?.length
    // };
    
    // For development, simulate file generation
    const filename = getExportFilename(options);
    
    // Generate file content based on format
    let content: string | Blob;
    
    switch (options.format) {
      case 'json':
        content = JSON.stringify(processedData, null, 2);
        break;
      case 'csv':
        // Simple CSV conversion - in production use a proper CSV library
        if (processedData.length === 0) return { 
          success: false,
          error: {
            code: 'EMPTY_DATA',
            message: 'No data to export'
          }
        };
        
        const headers = Object.keys(processedData[0]);
        const includeHeaders = options.includeHeaders !== false; // Default to true
        const delimiter = options.delimiter || ',';
        
        const csvRows = processedData.map(item => 
          headers.map(header => {
            const value = item[header];
            // Handle CSV escaping for strings
            if (typeof value === 'string') {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(delimiter)
        );
        
        content = includeHeaders 
          ? [headers.join(delimiter), ...csvRows].join('\n')
          : csvRows.join('\n');
        break;
      case 'xml':
        // Simple XML conversion
        const xmlItems = processedData.map(item => {
          const fields = Object.entries(item).map(([key, value]) => 
            `<${key}>${value}</${key}>`
          ).join('');
          return `<item>${fields}</item>`;
        }).join('');
        content = `<?xml version="1.0" encoding="UTF-8"?>\n<data>${xmlItems}</data>`;
        break;
      case 'xlsx':
      case 'pdf':
      case 'txt':
      case 'parquet':
      case 'avro':
        // These formats require specialized libraries
        // For development, we'll just use JSON as a fallback
        content = JSON.stringify(processedData, null, 2);
        break;
    }
    
    // Create a download link
    const blob = new Blob([content], { type: getMimeType(options.format) });
    fileUrl = URL.createObjectURL(blob);
    
    // Simulate downloading the file
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
    
    logInfo(`Export completed successfully: ${filename}`, { fileUrl }, 'export');
    finishTracking();
    
    return { 
      success: true, 
      fileUrl,
      fileSize: blob.size,
      expiresAt: options.expiresIn 
        ? new Date(Date.now() + (options.expiresIn * 1000)) 
        : undefined,
      status: 'completed'
    };
  } catch (error) {
    logError('Error exporting data', { error, options }, 'export');
    finishTracking();
    
    // Show error toast
    toast.error("Export failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return { 
      success: false,
      status: 'failed',
      error: {
        code: error instanceof Error ? 'EXPORT_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};

/**
 * Generate appropriate filename for export
 * @param options Export options
 * @returns Formatted filename
 */
const getExportFilename = (options: ExportOptions): string => {
  if (options.filename) {
    return options.filename;
  }
  
  const timestamp = options.includeTimestamp 
    ? `-${new Date().toISOString().replace(/[:.]/g, '-')}` 
    : '';
  
  return `export${timestamp}.${options.format}`;
};

/**
 * Export price items to Shopify-compatible format
 * @param items Price items to export
 * @returns Promise resolving to export result
 */
export const exportPriceItemsToShopify = async (
  items: PriceItem[]
): Promise<ExportResult> => {
  // Filter only the relevant fields for Shopify
  const shopifyData = items.map(item => ({
    handle: item.sku.toLowerCase().replace(/\s+/g, '-'), // Create handle from SKU
    sku: item.sku,
    title: item.name,
    price: item.newPrice || item.oldPrice, // Use newPrice, fallback to oldPrice
    compare_at_price: item.oldPrice, // Use oldPrice as the original price
    status: item.status === 'discontinued' ? 'draft' : 'active'
  }));
  
  return exportData(shopifyData, {
    format: 'csv',
    filename: 'shopify-price-update.csv',
    includeMetadata: false,
    compression: 'gzip', // Enable compression for larger files
    expiresIn: 3600 * 24 * 7, // 7 days expiration
    includeHeaders: true
  });
};

/**
 * Get MIME type for export format
 * @param format Export format
 * @returns MIME type string
 */
const getMimeType = (format: ExportFormat): string => {
  switch (format) {
    case 'csv': return 'text/csv';
    case 'json': return 'application/json';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'pdf': return 'application/pdf';
    case 'xml': return 'application/xml';
    case 'txt': return 'text/plain';
    case 'parquet': return 'application/vnd.apache.parquet';
    case 'avro': return 'application/avro';
    default: return 'text/plain';
  }
};

/**
 * Stream large datasets from Gadget.dev
 * Leverages Gadget's streaming capabilities for improved performance
 * @param query Query parameters for data retrieval
 * @param options Export options
 * @returns Promise resolving to export result
 */
export const streamExportData = async <T extends Record<string, any>>(
  query: Record<string, any>,
  options: ExportOptions & {
    batchSize?: number;
    maxConcurrency?: number;
    onProgress?: (processed: number, total: number) => void;
  }
): Promise<ExportResult> => {
  const finishTracking = startPerformanceTracking('streamExportData', { 
    format: options.format,
    query,
    batchSize: options.batchSize || 1000
  });
  
  try {
    logInfo(`Streaming export with format ${options.format}`, { query, options }, 'export');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, fallback to standard export with mock data
    const mockData: T[] = Array(10).fill({}) as T[]; // Mock data for development
    
    // In production with Gadget.dev:
    // const stream = await client.query.streamData({
    //   query,
    //   format: options.format,
    //   batchSize: options.batchSize || 1000,
    //   maxConcurrency: options.maxConcurrency || 3,
    //   onProgress: options.onProgress
    // });
    //
    // const fileManager = client.files;
    // const result = await fileManager.createFromStream({
    //   stream,
    //   mimeType: getMimeType(options.format),
    //   filename: options.filename || `export-${Date.now()}.${options.format}`,
    //   compression: options.compression || 'none',
    //   expiresIn: options.expiresIn || 3600 * 24,
    //   accessControl: options.accessControl || { public: true }
    // });
    // 
    // return { 
    //   success: true, 
    //   fileUrl: result.signedUrl,
    //   expiresAt: result.expiresAt ? new Date(result.expiresAt) : undefined,
    //   fileSize: result.size
    // };
    
    // Mock progress updates if provided
    if (options.onProgress) {
      const mockTotal = 100;
      let processed = 0;
      
      const interval = setInterval(() => {
        processed += 10;
        options.onProgress!(processed, mockTotal);
        
        if (processed >= mockTotal) {
          clearInterval(interval);
        }
      }, 500);
    }
    
    // Fallback for development
    return exportData(mockData, options);
    
  } catch (error) {
    logError('Error streaming export data', { error, query, options }, 'export');
    finishTracking();
    
    toast.error("Export streaming failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return { 
      success: false,
      error: {
        code: error instanceof Error ? 'STREAM_EXPORT_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};

/**
 * Schedule an export job to run in the background
 * Uses Gadget's background job system for processing large exports
 * @param query Query to retrieve data
 * @param options Export options
 * @returns Promise resolving to job information
 */
export const scheduleExportJob = async (
  query: Record<string, any>,
  options: ExportOptions & {
    notifyEmail?: string;
    priority?: 'high' | 'normal' | 'low';
    runAt?: Date;
  }
): Promise<{
  success: boolean;
  jobId?: string;
  estimatedCompletion?: Date;
  error?: {
    code: string;
    message: string;
  };
}> => {
  try {
    logInfo('Scheduling export job', { query, options }, 'export');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // In production with Gadget.dev:
    // const job = await client.jobs.schedule({
    //   type: 'export',
    //   payload: {
    //     query,
    //     options
    //   },
    //   priority: options.priority || 'normal',
    //   runAt: options.runAt,
    //   notification: options.notifyEmail ? { email: options.notifyEmail } : undefined
    // });
    // 
    // return {
    //   success: true,
    //   jobId: job.id,
    //   estimatedCompletion: job.estimatedCompletion
    // };
    
    // Mock for development
    toast.success("Export scheduled", {
      description: "Your export will be processed in the background"
    });
    
    return {
      success: true,
      jobId: `export_${Date.now()}`,
      estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    };
  } catch (error) {
    logError('Error scheduling export job', { error, query, options }, 'export');
    
    toast.error("Export scheduling failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return {
      success: false,
      error: {
        code: error instanceof Error ? 'SCHEDULE_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};
