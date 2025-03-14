# Error Handling Strategy

## Overview

The Supplier Price Watch application implements a comprehensive error handling strategy to ensure reliability, maintainability, and a good user experience. This document outlines the approach to error handling throughout the application.

## Tiered Severity Levels

The application categorizes errors into different severity levels:

### 1. Low Severity
- Non-critical issues that don't significantly impact functionality
- Logged but not reported to user
- Example: Non-essential data couldn't be loaded

### 2. Medium Severity
- Minor issues that might affect some functionality
- Reported to user with non-intrusive notifications
- Example: Market data enrichment failed but core price analysis succeeded

### 3. High Severity
- Significant issues that impact core functionality
- Reported to user with prominent notifications
- Example: File processing error preventing analysis

### 4. Critical Severity
- System-wide failures requiring immediate attention
- Reported with modal dialogs and detailed information
- Example: Authentication failure blocking access to key features

## Error Handling Implementation

### 1. React Error Boundaries

The application uses React Error Boundaries to catch errors in the component tree:

```typescript
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}
```

### 2. Centralized Error Handling

A custom `useErrorHandler` hook provides centralized error handling:

```typescript
const useErrorHandler = () => {
  const { toast } = useToast();
  
  const handleError = useCallback((
    error: Error,
    options?: {
      severity?: 'low' | 'medium' | 'high' | 'critical';
      context?: string;
      action?: () => void;
      actionLabel?: string;
    }
  ) => {
    // Log error
    console.error(`[${options?.context || 'General'}]`, error);
    
    // Report based on severity
    switch (options?.severity || 'medium') {
      case 'low':
        // Just log, don't display
        break;
      
      case 'medium':
        toast({
          title: 'Warning',
          description: error.message,
          variant: 'warning',
          action: options?.action && options?.actionLabel ? {
            label: options.actionLabel,
            onClick: options.action
          } : undefined
        });
        break;
      
      case 'high':
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
          action: options?.action && options?.actionLabel ? {
            label: options.actionLabel,
            onClick: options.action
          } : undefined
        });
        break;
      
      case 'critical':
        // Show modal dialog for critical errors
        showErrorDialog({
          title: 'Critical Error',
          description: error.message,
          action: options?.action,
          actionLabel: options?.actionLabel
        });
        break;
    }
  }, [toast]);
  
  return { handleError };
};
```

### 3. API Error Handling

API requests use structured error handling:

```typescript
const fetchWithErrorHandling = async <T>(
  url: string,
  options?: RequestInit,
  errorContext?: string
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Extract error information if available
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = { message: 'Unknown error occurred' };
      }
      
      // Create structured error
      const error = new Error(
        errorDetails.message || `Request failed with status ${response.status}`
      );
      
      // Add metadata to error
      (error as any).status = response.status;
      (error as any).statusText = response.statusText;
      (error as any).details = errorDetails;
      
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    // Add context to error
    (error as any).context = errorContext || 'API Request';
    
    // Re-throw for component-level handling
    throw error;
  }
};
```

## User-Friendly Error Messages

The application provides user-friendly error messages:

### 1. Message Guidelines
- Clear, concise, and actionable
- Non-technical language
- Suggesting next steps when possible
- Hiding technical details by default

### 2. Common Error Templates

```typescript
const errorMessages = {
  fileUpload: {
    invalidFormat: 'This file type is not supported. Please upload an Excel, CSV, or PDF file.',
    tooLarge: 'This file is too large. Please upload a file under {maxSize}MB.',
    processingFailed: 'We couldn\'t process this file. Please check the format and try again.'
  },
  shopify: {
    connectionFailed: 'Could not connect to your Shopify store. Please check your credentials and try again.',
    syncFailed: 'Some items could not be synced to Shopify. See details for more information.',
    rateLimitExceeded: 'Shopify rate limit reached. The operation will automatically retry in a moment.'
  },
  gadget: {
    notConfigured: 'Gadget.dev integration is not configured. Some advanced features are unavailable.',
    connectionFailed: 'Could not connect to Gadget.dev. Please check your configuration.',
    pdfProcessingFailed: 'PDF processing through Gadget.dev failed. Try an Excel or CSV file instead.'
  }
};
```

## Error Recovery

The application implements several error recovery mechanisms:

### 1. Automatic Retry

For transient failures, the application implements automatic retry:

```typescript
const fetchWithRetry = async <T>(
  url: string,
  options?: RequestInit,
  retryOptions?: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
  }
): Promise<T> => {
  const { maxRetries = 3, baseDelay = 300, maxDelay = 5000 } = retryOptions || {};
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(url, options).then(res => res.json());
    } catch (err) {
      lastError = err as Error;
      
      if (attempt < maxRetries) {
        // Calculate exponential backoff delay
        const delay = Math.min(
          maxDelay,
          baseDelay * Math.pow(2, attempt)
        );
        
        // Add jitter to prevent thundering herd
        const jitter = Math.random() * 0.3 * delay;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }
  
  throw lastError;
};
```

### 2. Graceful Degradation

The application implements graceful degradation when services are unavailable:

```typescript
const fetchMarketData = async (items: PriceItem[]): Promise<EnrichedPriceItem[]> => {
  try {
    // Try to get market data from Gadget.dev
    if (isGadgetAvailable()) {
      return await enrichDataWithGadget(items);
    }
    
    // Fall back to basic enrichment if Gadget is unavailable
    return items.map(item => ({
      ...item,
      marketData: {
        available: false,
        reason: 'Gadget.dev integration unavailable'
      }
    }));
  } catch (error) {
    // Log error but don't fail the whole operation
    console.error('Market data enrichment failed:', error);
    
    // Return items without market data
    return items.map(item => ({
      ...item,
      marketData: {
        available: false,
        reason: 'Error fetching market data'
      }
    }));
  }
};
```

### 3. Data Preservation

Critical data is preserved during failures:

```typescript
const processFile = async (file: File): Promise<AnalysisResult> => {
  try {
    // Main processing logic
    return await processFileImpl(file);
  } catch (error) {
    // Attempt to preserve any partial results
    const partialResults = getPartialResults();
    
    // Save extraction state for recovery
    saveExtractionState(file, partialResults);
    
    // Report error
    handleError(error, {
      severity: 'high',
      context: 'File Processing',
      action: () => recoverFromSavedState(),
      actionLabel: 'Try Recovery'
    });
    
    // Return partial results with error flag
    return {
      items: partialResults || [],
      summary: getPartialSummary(partialResults),
      error: error.message,
      isPartial: true,
      timestamp: new Date()
    };
  }
};
```

## Error Reporting

The application includes comprehensive error reporting:

### 1. Detailed Logging

```typescript
const logger = {
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
  
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data);
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
  
  error: (message: string, error?: Error, context?: string) => {
    console.error(`[ERROR${context ? ` - ${context}` : ''}] ${message}`, error);
    
    // In production, send to monitoring service
    if (isProduction && error) {
      reportErrorToMonitoring(error, { message, context });
    }
  }
};
```

### 2. Error Aggregation

Errors are aggregated for pattern detection:

```typescript
// Simplified example of error aggregation
const errorCounts: Record<string, number> = {};

const trackError = (errorType: string) => {
  errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
  
  // Report if frequency exceeds threshold
  if (errorCounts[errorType] >= 5) {
    reportHighFrequencyError(errorType, errorCounts[errorType]);
    // Reset counter after reporting
    errorCounts[errorType] = 0;
  }
};
```

### 3. Performance Impact Tracking

Errors are tracked with performance impact data:

```typescript
const trackErrorWithPerformance = (
  error: Error,
  context: string,
  performanceData?: {
    startTime: number;
    endTime: number;
    resourceUsage?: any;
  }
) => {
  // Calculate duration if available
  const duration = performanceData
    ? performanceData.endTime - performanceData.startTime
    : undefined;
  
  // Report error with performance context
  reportError(error, {
    context,
    performance: {
      duration,
      resourceUsage: performanceData?.resourceUsage,
      timestamp: new Date()
    }
  });
};
```

## Error Prevention

The application implements several strategies to prevent errors:

### 1. Input Validation

Comprehensive validation of all user inputs and API data:

```typescript
const validatePriceItem = (item: any): item is PriceItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.sku === 'string' &&
    item.sku.length > 0 &&
    typeof item.price === 'number' &&
    item.price >= 0
  );
};

const validatePriceItems = (items: any[]): PriceItem[] => {
  // Filter out invalid items
  const validItems = items.filter(validatePriceItem);
  
  // Log warning if some items were invalid
  if (validItems.length !== items.length) {
    logger.warn(
      `Filtered out ${items.length - validItems.length} invalid items`
    );
  }
  
  return validItems;
};
```

### 2. Type Safety

The application uses TypeScript for type safety:

```typescript
interface PriceItem {
  sku: string;
  name: string;
  price: number;
  oldPrice?: number;
  change?: number;
  changePercent?: number;
  status?: 'increased' | 'decreased' | 'unchanged' | 'new' | 'discontinued';
}

// Type guard for runtime type checking
function isPriceItem(item: any): item is PriceItem {
  return (
    item &&
    typeof item.sku === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number'
  );
}
```

### 3. Defensive Programming

The application uses defensive programming practices:

```typescript
const getAnalysisSummary = (items: PriceItem[] | null | undefined): AnalysisSummary => {
  // Handle null or undefined input
  if (!items || items.length === 0) {
    return {
      total: 0,
      increased: 0,
      decreased: 0,
      unchanged: 0,
      new: 0,
      discontinued: 0,
      averageChange: 0,
      totalIncreaseValue: 0,
      totalDecreaseValue: 0
    };
  }
  
  // Safe calculations with fallbacks
  const increased = items.filter(item => item.status === 'increased').length || 0;
  const decreased = items.filter(item => item.status === 'decreased').length || 0;
  
  // Safe calculations for numeric values
  const increaseValues = items
    .filter(item => item.status === 'increased' && typeof item.change === 'number')
    .map(item => item.change as number);
  
  const totalIncreaseValue = increaseValues.length > 0
    ? increaseValues.reduce((sum, val) => sum + val, 0)
    : 0;
  
  // Return complete summary with all expected fields
  return {
    total: items.length,
    increased,
    decreased,
    // ... other calculated values
  };
};
```
