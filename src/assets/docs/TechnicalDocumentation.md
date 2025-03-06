
# Supplier Price Watch - Technical Documentation

## Overview

Supplier Price Watch is a web application designed to help eCommerce businesses, particularly Shopify merchants, analyze and manage supplier price changes. The application facilitates the comparison of old and new price lists, identifies pricing anomalies, and provides actionable insights to make informed decisions about retail pricing strategies.

## Key Functionality

### Price Analysis
- Upload and process supplier price lists (Excel or PDF formats)
- Compare old vs new prices to identify increases, decreases, and anomalies
- Calculate potential financial impact of price changes
- Identify discontinued items and new products

### AI Analysis
- Generate insights and recommendations based on price changes
- Identify market trends and pricing anomalies
- Provide risk assessment and opportunity insights

### Market Data Integration
- Enrich product data with competitive market information
- Show price positioning relative to market (low, average, high)
- Provide category-specific market trends and insights

### Shopify Integration
- Connect to Shopify stores to pull product information
- Match supplier items to Shopify products
- Sync price updates directly to Shopify
- Save uploaded files to Shopify's file storage

### Gadget.dev Integration
- Authentication with Shopify via Gadget.dev
- Process PDF files for data extraction
- Perform batch operations efficiently
- Enrich data with web search results for market information

### Google Workspace Integration
- Send email notifications about price changes via Gmail
- Create calendar events for price increase effective dates
- Authentication with Google accounts

### Customer Notifications
- Generate price increase notifications for customers
- Create HTML snippets for display on product pages
- Configure notification timing and messaging

## Technical Architecture

```
┌─────────────────────────────────┐
│          React Frontend         │
│  (TypeScript, Tailwind, shadcn) │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│       Context Providers         │
│  ShopifyContext, FileAnalysis   │
└┬──────────────┬─────────────────┘
 │              │
 ▼              ▼
┌────────────┐ ┌────────────────────┐
│  Shopify   │ │    File Analysis   │
│   API      │ │    & Processing    │
└──────┬─────┘ └──────────┬─────────┘
       │                  │
       ▼                  ▼
┌────────────┐    ┌───────────────┐
│ Gadget.dev │◄───┤ AI Analysis   │
│ Integration│    │ & Enrichment  │
└──────┬─────┘    └───────────────┘
       │
       ▼
┌────────────────────────────────┐
│   Google Workspace Integration  │
│     (Gmail, Google Calendar)    │
└────────────────────────────────┘
```

## Application Flow

1. **Authentication & Setup**
   - User connects to Shopify store (optional)
   - User configures Gadget.dev integration (optional)
   - User authenticates with Google Workspace (optional)

2. **Data Upload & Processing**
   - User uploads supplier price list (Excel/PDF)
   - System processes the file to extract pricing data
   - If connected to Shopify, system matches items with Shopify products
   - File is saved to Shopify storage if connected

3. **Analysis & Enrichment**
   - System calculates price changes and identifies anomalies
   - AI generates insights and recommendations
   - If Gadget.dev is configured, data is enriched with market information

4. **User Decision Making**
   - User reviews price changes and insights
   - User can adjust pricing strategies based on recommendations
   - User can schedule notifications for price increases

5. **Synchronization & Communication**
   - User syncs approved price changes to Shopify
   - User exports data for other systems
   - User sends notifications about price changes to customers
   - User schedules follow-up activities using Google Calendar

## Key Files & Components

### Context Providers
- `ShopifyContext.tsx`: Manages Shopify authentication and data sync
- `FileAnalysisContext.tsx`: Manages file processing and analysis state

### API Integration
- `shopifyApi.ts`: Functions for interacting with Shopify API
- `gadget/*.ts`: Modular functions for Gadget.dev integration
  - `client.ts`: Client initialization and connection management
  - `sync.ts`: Shopify synchronization and price updates
  - `batch.ts`: Batch processing with retry logic and concurrency control
  - `export.ts`: Data export capabilities
  - `logging.ts`: Comprehensive logging system
  - `telemetry.ts`: Performance tracking and error reporting
  - `pagination.ts`: Efficient data pagination
  - `mocks.ts`: Development mock implementations
  - `operations.ts`: Re-exports all functions for backward compatibility
- `googleWorkspaceApi.ts`: Functions for Google Workspace integration

### UI Components
- `FileUpload.tsx`: File upload and processing
- `PriceTable.tsx`: Display and interaction with price data
- `AIAnalysis.tsx`: Display AI-generated insights
- `MarketInsights.tsx`: Display market data and trends
- `GoogleShopifyAuth.tsx`: Authentication with Google/Shopify
- `GadgetConfigForm.tsx`: Configuration for Gadget.dev integration

## Gadget.dev Integration Specifics

The application utilizes Gadget.dev for several key features:

1. **Authentication Bridge**
   - Authenticates with Shopify via Gadget.dev for secure API access
   - Manages access tokens and authentication flow

2. **PDF Processing**
   - Uses Gadget.dev's capabilities to extract structured data from PDF price lists
   - Processes document contents into usable data format

3. **Batch Operations**
   - Efficiently processes large datasets through Gadget.dev's batch capabilities
   - Prevents rate limiting issues with Shopify API

4. **Web Search & Data Enrichment**
   - Leverages Gadget.dev to perform web searches for competitive pricing
   - Enriches product data with market information

5. **Data Synchronization**
   - Provides an alternative path for syncing data to Shopify
   - Handles bulk operations with better error handling and reporting

6. **Telemetry & Logging**
   - Comprehensive error reporting system
   - Performance tracking for operations
   - Structured logging for debugging

7. **Pagination**
   - Efficient handling of large datasets
   - Smart fetching of data with automatic continuation

### Configuration

The application configures Gadget.dev through the `GadgetConfigForm` component, which allows the user to set:
- App ID
- API Key
- Environment (development/production)
- Feature flags for optional capabilities

Configuration is stored in localStorage for persistence between sessions.

## Module Structure & Responsibilities

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

### 8. Mocks Module (`mocks.ts`)
- Provide realistic mock implementations for development
- Simulate network delays and errors for testing
- Generate placeholder data that mimics production
- Enable offline development workflow

## Advanced Integration Features

### Health Monitoring

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

### Intelligent Fallbacks

The application implements intelligent fallbacks if Gadget services are unavailable:

```typescript
if (!isGadgetInitialized() || !(await checkGadgetHealth()).healthy) {
  // Switch to direct API access
  // Use local processing capabilities
  // Notify user of degraded functionality
}
```

### Feature Flags

The integration supports feature flags to enable/disable specific capabilities:

```typescript
const config = getGadgetConfig();
if (config?.featureFlags?.enableAdvancedAnalytics) {
  // Enable advanced analytics features
}
```

## Technical Limitations

1. **Shopify Integration**
   - Currently simulates API calls for demo purposes
   - In production would need real Shopify API credentials and OAuth flow

2. **PDF Processing**
   - Limited PDF processing capabilities without Gadget.dev
   - Complex table structures in PDFs might not be accurately parsed

3. **Data Security**
   - Credentials stored in localStorage (would need server-side storage in production)
   - No encryption for sensitive data

4. **Offline Support**
   - Application requires internet connectivity
   - No offline processing capabilities

5. **Scalability**
   - Large datasets might cause performance issues in the browser
   - Bulk operations depend on Gadget.dev for efficiency

## Future Development Opportunities

1. **Enhanced AI Analysis**
   - More sophisticated AI models for better recommendations
   - Historical trend analysis and prediction

2. **Advanced PDF Processing**
   - Improved extraction from complex PDF layouts
   - Support for image-based PDFs with OCR

3. **Deeper Shopify Integration**
   - Integration with Shopify flow for automated workflows
   - Support for Shopify Plus features like price lists and B2B

4. **Extended Gadget.dev Utilization**
   - Custom Gadget.dev actions for specific business processes
   - Background processing for large datasets

5. **Multi-channel Support**
   - Extend beyond Shopify to other eCommerce platforms
   - Support for marketplaces like Amazon, eBay

## Error Handling Strategy

The application implements a comprehensive error handling strategy:

1. **Tiered Severity Levels**
   - Low: Non-critical issues, logged but not reported to user
   - Medium: Minor issues that might affect functionality
   - High: Significant issues that impact core functionality
   - Critical: System-wide failures requiring immediate attention

2. **User-friendly Error Messages**
   - Technical details hidden from user
   - Actionable error messages with suggestions
   - Visual indicators of error states

3. **Error Recovery**
   - Automatic retry for transient failures
   - Graceful degradation when services unavailable
   - Data preservation during failures

4. **Error Reporting**
   - Detailed error logs for debugging
   - Error aggregation for pattern detection
   - Performance impact tracking

## Installation & Setup Instructions

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure Shopify connection (requires Shopify Partner account or store)
4. Set up Gadget.dev app and configure in the application
5. Authenticate with Google if using Gmail/Calendar features
6. Run with `npm run dev` for development or deploy to production

## Migrating to Gadget.dev

For detailed instructions on migrating to Gadget.dev:

1. See the [Migration Guide](GadgetMigrationGuide.md)
2. Create the required models in Gadget.dev
3. Set up authentication and API connections
4. Implement the custom actions for PDF processing and data enrichment
5. Update client code to use production endpoints

## Conclusion

Supplier Price Watch provides a comprehensive solution for managing supplier price changes, with particular strengths in analysis, integration with Shopify, and leveraging Gadget.dev for enhanced functionality. The modular architecture allows for flexible use of features based on available integrations.

The Gadget.dev integration enhances core capabilities while maintaining graceful fallbacks for operation without Gadget services. This hybrid approach provides flexibility for users at different stages of technical integration.
