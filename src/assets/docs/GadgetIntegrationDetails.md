
# Gadget.dev Integration Details

## Overview

Supplier Price Watch integrates with Gadget.dev to enhance several key capabilities. This integration is optional but provides significant benefits, particularly for PDF processing, batch operations, and data enrichment.

## Integration Architecture

The Gadget.dev integration is modular and falls back gracefully when not available:

```
User Interface
      │
      ▼
Context Providers
      │
      ├──────────────►  Shopify API  ◄─────┐
      │                                    │
      ▼                                    │
File Processing                            │
      │                                    │
      ▼                                    │
┌─────────────────┐                        │
│  Gadget.dev     │                        │
│  Integration    ├────────────────────────┘
│                 │
│  - Auth         │
│  - PDF          │
│  - Data         │
│  - Batching     │
└────────┬────────┘
         │
         ▼
   AI Analysis &
   User Actions
```

## Module Structure

The Gadget.dev integration is organized into focused modules:

### 1. Client Module (`client.ts`)
- Initialize Gadget client
- Check connection health
- Manage client caching for performance
- Handle environment-specific configuration

### 2. Sync Module (`sync.ts`)
- Synchronize price updates to Shopify
- Validate items before sync
- Process sync results and handle errors
- Track performance of sync operations

### 3. Batch Module (`batch.ts`)
- Process items in batches to avoid rate limits
- Implement retry logic for transient failures
- Control concurrency for optimal performance
- Report progress during batch operations

### 4. Export Module (`export.ts`)
- Export data to CSV or JSON formats
- Track usage of export functionality
- Handle export errors gracefully
- Provide progress feedback during export

### 5. Logging Module (`logging.ts`)
- Structured logging with levels (debug, info, warn, error)
- Context-aware logging for better debugging
- Memory-based log storage for development
- Remote logging capability for production

### 6. Telemetry Module (`telemetry.ts`)
- Track performance metrics for operations
- Report errors to telemetry system
- Track feature usage for analytics
- Health reporting for system status

### 7. Pagination Module (`pagination.ts`)
- Fetch paginated data efficiently
- Handle continuation tokens for large datasets
- Provide consistent interface for all paginated operations
- Error handling for pagination failures

### 8. PDF Processing Module (`pdf.ts`)
- Process PDF documents to extract structured data
- Handle various PDF layouts and formats
- Extract tabular data from complex documents
- Transform unstructured data into usable format

## Configuration

The application configures Gadget.dev through the `GadgetConfigForm` component:

```typescript
interface GadgetConfig {
  apiKey: string;
  appId: string;
  environment: 'development' | 'production';
  featureFlags: {
    enableAdvancedAnalytics: boolean;
    enablePdfProcessing: boolean;
    enableMarketData: boolean;
  };
}
```

Configuration is stored in localStorage for persistence between sessions.

## Health Monitoring

The Gadget integration includes a health monitoring system:

```typescript
export const checkGadgetHealth = async (): Promise<{
  healthy: boolean;
  statusCode?: number;
  message?: string;
}> => {
  // Check Gadget connection health
  // Report health status to telemetry
  // Return health information
};
```

## Fallback Mechanisms

The application implements intelligent fallbacks if Gadget services are unavailable:

```typescript
if (!isGadgetInitialized() || !(await checkGadgetHealth()).healthy) {
  // Switch to direct API access
  // Use local processing capabilities
  // Notify user of degraded functionality
}
```

## Feature Flags

The integration supports feature flags to enable/disable specific capabilities:

```typescript
const config = getGadgetConfig();
if (config?.featureFlags?.enableAdvancedAnalytics) {
  // Enable advanced analytics features
}
```

## Key Integration Points

### 1. PDF Processing

```typescript
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  // Upload PDF to Gadget
  // Trigger PDF processing action
  // Return structured data
};
```

### 2. Data Enrichment

```typescript
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // Send items to Gadget for web search
  // Extract competitive pricing information
  // Return enhanced items with market context
};
```

### 3. Batch Operations

```typescript
export const syncToShopifyViaGadget = async (
  items: PriceItem[]
): Promise<{success: boolean}> => {
  // Use Gadget to efficiently batch update Shopify products
};
```

### 4. Authentication Bridge

```typescript
export const authenticateShopify = async (): Promise<boolean> => {
  // Use Gadget as authentication bridge to Shopify
};
```

## Limitations & Considerations

1. **Dependency**: Requires active Gadget.dev account and configured application
2. **Rate Limits**: Subject to Gadget.dev rate limits and quotas
3. **Authentication**: Requires secure management of API keys
4. **Versioning**: May require updates when Gadget.dev API changes
5. **Connectivity**: Requires network access to Gadget.dev services
