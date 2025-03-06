
# Supplier Price Watch - Gadget.dev Integration Guide

## Purpose & Overview

Supplier Price Watch is a specialized application that helps eCommerce businesses analyze supplier price changes, particularly for Shopify merchants. The application leverages Gadget.dev for critical functionality including enhanced Shopify integration, PDF processing, and market data enrichment.

This document highlights how Gadget.dev is integrated into the application architecture and workflow.

## Key Gadget.dev Integration Points

### 1. Configuration & Authentication

The application uses a configuration component (`GadgetConfigForm.tsx`) to set up the Gadget.dev connection:

```typescript
// Configuration parameters
{
  apiKey: string;      // Gadget.dev API key
  appId: string;       // Your Gadget application ID
  environment: 'development' | 'production';
  featureFlags?: {     // Optional feature flags
    enableAdvancedAnalytics?: boolean;
    enablePdfProcessing?: boolean;
    enableBackgroundJobs?: boolean;
    enableShopifySync?: boolean;
  }
}
```

This configuration is stored in `localStorage` and used by the `initGadgetClient()` function in `client.ts`.

### 2. Shopify Authentication Bridge

Gadget.dev serves as an authentication bridge to Shopify, simplifying the OAuth flow:

```typescript
// Authentication flow
export const authenticateShopify = async (context: ShopifyContext) => {
  const client = initGadgetClient();
  if (!client) return false;
  
  // Gadget handles the OAuth handshake with Shopify
  // This avoids direct management of Shopify authentication tokens
  return true;
}
```

### 3. PDF Processing

The application processes supplier PDF price lists using Gadget.dev's document processing capabilities:

```typescript
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  // Upload PDF to Gadget
  // Trigger PDF processing action using OCR and structured data extraction
  // Return normalized structured data ready for price analysis
}
```

### 4. Data Enrichment with Market Information

Gadget.dev enriches product data with market information through its proxy and data aggregation services:

```typescript
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // Send items to Gadget for web search and competitor price research
  // Extract competitive pricing information while respecting rate limits
  // Return enhanced items with market context and competitive positioning
}
```

### 5. Efficient Batch Operations

When syncing with Shopify, Gadget.dev handles batch operations to prevent rate limiting:

```typescript
export const syncToShopifyViaGadget = async (
  context: ShopifyContext, 
  items: PriceItem[]
): Promise<{success: boolean}> => {
  // Use Gadget's transaction and batching capabilities
  // Optimize Shopify API usage to stay within rate limits
  // Provide detailed error handling and retries
}
```

## Integration Architecture

```
┌───────────────┐     ┌────────────────┐
│ User Interface│     │  Shopify Store  │
└───────┬───────┘     └────────┬───────┘
        │                      │
┌───────▼───────┐     ┌────────▼───────┐
│    Context    │     │   Shopify API   │
│   Providers   ├────►│                 │
└───────┬───────┘     └────────▲───────┘
        │                      │
┌───────▼───────┐              │
│     File      │              │
│  Processing   │              │
└───────┬───────┘              │
        │                      │
┌───────▼───────────────────┐  │
│      Gadget.dev           │  │
│      Integration          ├──┘
│                           │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Auth │ │PDF  │ │Data │  │
│  └─────┘ └─────┘ └─────┘  │
│                           │
│  ┌─────────┐ ┌─────────┐  │
│  │Batching │ │Analytics│  │
│  └─────────┘ └─────────┘  │
└───────────┬───────────────┘
            │
      ┌─────▼─────┐
      │    AI     │
      │  Analysis │
      └───────────┘
```

## Module Structure

The Gadget integration is organized into a modular structure:

- **client.ts**: Initialization, connection testing, and health checks
- **sync.ts**: Shopify synchronization and price updates
- **batch.ts**: Batch processing with retry logic and concurrency control
- **export.ts**: Data export capabilities
- **logging.ts**: Comprehensive logging system
- **telemetry.ts**: Performance tracking and error reporting
- **pagination.ts**: Efficient data pagination
- **mocks.ts**: Development mock implementations

This modular approach improves maintainability and makes it easier to understand each component's responsibility.

## Implementation Details

### 1. Client Initialization

```typescript
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) return null;

  // In production: use Gadget SDK
  // import { createClient } from '@gadget-client/your-app-id';
  // return createClient({ 
  //   apiKey: config.apiKey,
  //   environment: config.environment,
  //   enableNetworkLogs: config.environment === 'development'
  // });
  
  return { config, ready: true };
};
```

### 2. Batch Processing Helper

```typescript
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options = { 
    batchSize: 50,
    maxConcurrency: 5,
    retryCount: 3,
    retryDelay: 1000,
    onProgress?: (processed: number, total: number) => void
  }
): Promise<R[]> => {
  // Split items into batches for parallel processing
  // Process batches sequentially to avoid rate limiting
  // Handle errors gracefully with retries and detailed logging
  // Return combined results
};
```

### 3. Telemetry and Monitoring

```typescript
export const reportError = async (
  error: Error | string,
  options: ErrorReportOptions = {}
): Promise<void> => {
  // Send error details to telemetry system
  // Log error information locally
  // Display user-friendly error message if needed
};

export const startPerformanceTracking = (
  operation: string,
  metadata: Record<string, any> = {}
): () => Promise<void> => {
  // Start timing an operation
  // Return function to complete timing and report results
};
```

### 4. Fallback Mechanisms

The application is designed to work even without Gadget.dev, with graceful fallbacks:

```typescript
const syncToShopify = async (items: PriceItem[]): Promise<boolean> => {
  // First try via Gadget for enhanced capabilities
  if (isGadgetInitialized) {
    const result = await syncToShopifyViaGadget(shopifyContext, items);
    if (result.success) return true;
  }
  
  // Fall back to direct Shopify API if Gadget is unavailable
  return await syncWithShopify(shopifyContext, items);
};
```

## Integration with Klaviyo

Gadget.dev facilitates the connection between Shopify product data and Klaviyo for personalized email marketing:

1. Customer purchase history is extracted from Shopify via Gadget
2. Price changes are processed and analyzed
3. Customer segments are created in Klaviyo based on purchase patterns
4. Email templates for price increases and discontinued products are prepared
5. Automated campaigns are scheduled based on price change effective dates

## Advanced Features

### 1. Historical Price Trend Analysis

```typescript
export const analyzeHistoricalPricing = async (
  items: PriceItem[],
  timeframe: 'month' | 'quarter' | 'year' = 'quarter'
): Promise<PriceItem[]> => {
  // Fetch historical pricing data from Gadget
  // Calculate trends, volatility and seasonality
  // Return items with enriched historical context
};
```

### 2. Competitive Pricing Intelligence

Gadget.dev can automate the collection and analysis of competitor pricing data:

```typescript
export const scheduleCompetitorScraping = async (
  items: PriceItem[],
  competitors: string[]
): Promise<{jobId: string}> => {
  // Schedule regular competitor price checks
  // Run via Gadget's background job system
  // Store results for trend analysis
};
```

### 3. AI-Powered Pricing Recommendations

Using Gadget.dev's AI capabilities:

```typescript
export const generatePricingRecommendations = async (
  items: PriceItem[]
): Promise<PriceItem[]> => {
  // Analyze market position, trends, and elasticity
  // Generate optimal pricing recommendations
  // Provide rationale for each recommendation
};
```

## Shopify Plus Enhanced Features

For Shopify Plus merchants, Gadget.dev provides additional enterprise capabilities:

1. **Multi-location inventory** synchronization and analysis
2. **B2B price management** for wholesale customer segments
3. **Script automation** for personalized pricing rules
4. **Flow enhancements** for automated inventory and price change workflows
5. **Enhanced metafield support** for rich product data

## Error Handling Best Practices

The Gadget integration includes robust error handling:

1. **Configuration Validation**: All operations validate that Gadget is properly configured
2. **Connection Testing**: Connection health checks before critical operations
3. **Detailed Error Messages**: Specific error messages for different failure scenarios
4. **Retry Logic**: Automatic retries with exponential backoff for transient failures
5. **Fallback Mechanisms**: Graceful degradation to direct API calls when Gadget is unavailable

## Development and Production Mode

The integration supports both development and production modes:

1. **Development Mode**:
   - Mock implementations for testing without real Gadget infrastructure
   - Detailed logging and console output
   - Feature flags for enabling/disabling capabilities

2. **Production Mode**:
   - Real Gadget API calls
   - Optimized performance
   - Enhanced security with proper authentication
   - Minimized logging output

## Future Enhancements

1. **Custom Gadget Actions**: Create specialized Gadget actions for price analysis and recommendations

2. **Enhanced PDF Processing**: Improve extraction from complex supplier price lists with custom Gadget actions

3. **Background Processing**: Use Gadget's background job capabilities for processing large datasets

4. **Webhooks**: Implement Gadget webhooks to trigger actions when supplier files are uploaded

5. **Multi-tenant Support**: Extend to support multiple Shopify stores through Gadget's multi-tenant capabilities

6. **Automated AI Analysis**: Schedule regular market data enrichment and analysis jobs via Gadget's cron functionality

7. **Enhanced Klaviyo Integration**: Use Gadget as middleware to create advanced segmentation logic

## Technical Requirements

- Gadget.dev account
- Gadget application with appropriate models and actions
- Gadget API key with appropriate permissions
- Configuration of CORS for your Gadget application

## Integration Sequence

1. User configures Gadget.dev in the application
2. Application initializes Gadget client
3. When user uploads a file:
   - If PDF, processes via Gadget's document capabilities
   - If connected to Shopify, authenticates via Gadget
4. For processing price changes:
   - Enriches data with market information via Gadget
   - Uses Gadget for batch operations when syncing to Shopify
5. For customer communications:
   - Gadget prepares segmented customer data
   - Klaviyo integration receives segment data for email campaigns

## Performance Considerations

1. **Batch Size Optimization**: Adjust batch sizes based on operation type and rate limits
2. **Caching Strategy**: Cache frequently accessed data to reduce API calls
3. **Connection Pooling**: Reuse connections to improve performance
4. **Background Processing**: Move intensive operations to background jobs
5. **Pagination Optimization**: Implement efficient pagination for large datasets

## Security Best Practices

1. **API Key Management**: Secure storage of API keys
2. **CORS Configuration**: Proper CORS setup to prevent unauthorized access
3. **Data Validation**: Validate all input before sending to Gadget
4. **Minimal Permissions**: Use least privilege principle for API keys
5. **Encrypted Storage**: Encrypt sensitive data in localStorage

## Conclusion

The integration with Gadget.dev significantly enhances the Supplier Price Watch application's capabilities, particularly for PDF processing, Shopify integration, and market data enrichment. The modular design allows for flexible use of Gadget features while maintaining core functionality even without Gadget.

By leveraging Gadget.dev, the application achieves:
- Improved scalability and performance
- Enhanced data processing capabilities
- Simplified Shopify integration
- Reduced maintenance overhead
- Greater flexibility for future enhancements
