
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
  - `auth.ts`: Authentication handlers
  - `processing.ts`: Document and data processing
  - `operations.ts`: Batch operations and sync functions
  - `diagnostics.ts`: Health checks and diagnostics
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

### Configuration

The application configures Gadget.dev through the `GadgetConfigForm` component, which allows the user to set:
- App ID
- API Key
- Environment (development/production)
- Feature flags for optional capabilities

Configuration is stored in localStorage for persistence between sessions.

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

## Installation & Setup Instructions

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure Shopify connection (requires Shopify Partner account or store)
4. Set up Gadget.dev app and configure in the application
5. Authenticate with Google if using Gmail/Calendar features
6. Run with `npm run dev` for development or deploy to production

## Conclusion

Supplier Price Watch provides a comprehensive solution for managing supplier price changes, with particular strengths in analysis, integration with Shopify, and leveraging Gadget.dev for enhanced functionality. The modular architecture allows for flexible use of features based on available integrations.
