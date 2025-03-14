
# API Documentation

## Overview

The Supplier Price Watch application integrates with several external APIs to provide its functionality. This document details these integrations, authentication requirements, and usage patterns.

## API Integrations

### 1. Shopify API

The application uses Shopify's REST and GraphQL APIs to interact with merchant stores.

#### Authentication

- **Method**: OAuth 2.0
- **Scopes Required**:
  - `read_products`
  - `write_products`
  - `read_inventory`
  - `write_inventory`
  - `read_price_rules` (for Shopify Plus)
  - `write_price_rules` (for Shopify Plus)

#### Endpoints Used

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/admin/api/2023-07/products.json` | GET | Retrieve products | 2 requests/second |
| `/admin/api/2023-07/products/{id}.json` | GET | Get product details | 2 requests/second |
| `/admin/api/2023-07/products/{id}.json` | PUT | Update product price | 2 requests/second |
| `/admin/api/2023-07/price_rules.json` | POST | Create price rules | 2 requests/second |

#### GraphQL Queries

For batch operations, the application uses GraphQL:

```graphql
mutation bulkPriceUpdate($input: ProductVariantsBulkInput!) {
  productVariantsBulkUpdate(input: $input) {
    productVariants {
      id
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

#### Error Handling

The application handles Shopify API errors with:
- Exponential backoff for rate limiting
- Specific error messaging for common issues
- Automatic retry for transient errors

### 2. Gadget.dev API

Used for enhanced functionality, particularly for PDF processing and batch operations.

#### Authentication

- **Method**: API Key
- **Header**: `Authorization: Bearer YOUR_API_KEY`

#### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/processPdf` | POST | Process PDF documents |
| `/api/enrichData` | POST | Enrich item data with market info |
| `/api/batchSync` | POST | Batch operations for Shopify |

#### Request/Response Examples

**PDF Processing Request:**
```json
{
  "file": "base64_encoded_file_data",
  "options": {
    "extractTables": true,
    "pageRanges": [1, 5],
    "enhanceResult": true
  }
}
```

**PDF Processing Response:**
```json
{
  "success": true,
  "data": {
    "tableData": [
      {
        "headers": ["SKU", "Description", "Price"],
        "rows": [
          ["ABC123", "Product Name", "19.99"],
          // Additional rows...
        ]
      }
    ],
    "processingTime": 1.2,
    "pageCount": 5
  }
}
```

### 3. Google APIs

Used for Google Workspace integration (Gmail, Calendar, Drive).

#### Authentication

- **Method**: OAuth 2.0
- **Scopes**:
  - `https://www.googleapis.com/auth/gmail.send`
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/drive.file`

#### Gmail API

Used for sending price increase notifications:

```javascript
// Example request to send an email
POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send
{
  "raw": "base64_encoded_email"
}
```

#### Calendar API

Used for scheduling price change effective dates:

```javascript
// Example request to create a calendar event
POST https://www.googleapis.com/calendar/v3/calendars/primary/events
{
  "summary": "Price Increase - Supplier ABC",
  "description": "Effective date for price changes from Supplier ABC",
  "start": {
    "dateTime": "2023-07-01T09:00:00-07:00"
  },
  "end": {
    "dateTime": "2023-07-01T10:00:00-07:00"
  },
  "reminders": {
    "useDefault": false,
    "overrides": [
      {"method": "email", "minutes": 1440},
      {"method": "popup", "minutes": 1440}
    ]
  }
}
```

## Internal API

The application also provides internal APIs for component communication.

### File Analysis API

```typescript
// Process file and return analysis results
const analyzeFile = async (
  file: File, 
  options?: AnalysisOptions
): Promise<AnalysisResult> => {
  // Implementation details...
};

// Get summary of price changes
const getAnalysisSummary = (
  items: PriceItem[]
): AnalysisSummary => {
  // Implementation details...
};
```

### Shopify Integration API

```typescript
// Connect to Shopify store
const connectToShopify = async (
  shop: string, 
  accessToken: string
): Promise<boolean> => {
  // Implementation details...
};

// Sync price updates to Shopify
const syncToShopify = async (
  items: PriceItem[]
): Promise<boolean> => {
  // Implementation details...
};
```

## API Versioning

- Shopify API: Currently using 2023-07 version
- Internal APIs follow semantic versioning
- Breaking changes are documented in CHANGELOG.md

## Rate Limiting

| API | Rate Limit | Handling Strategy |
|-----|------------|-------------------|
| Shopify | 2 req/sec | Leaky bucket algorithm with exponential backoff |
| Gadget.dev | 10 req/sec | Simple delay between requests |
| Google APIs | Varies by API | Token bucket algorithm |

## Error Codes

| Code | Description | Handling Strategy |
|------|-------------|-------------------|
| 401 | Unauthorized | Refresh authentication tokens |
| 403 | Forbidden | Check API permissions |
| 404 | Not Found | Validate resource identifiers |
| 429 | Too Many Requests | Implement exponential backoff |
| 500 | Server Error | Retry with backoff, then alert user |

## Webhook Integration

The application can receive webhooks from:

1. **Shopify**: For product updates and inventory changes
2. **Supplier Portals**: For automatic price list updates (if supported)

### Webhook Configuration

```json
{
  "webhook": {
    "address": "https://app.supplierpricewatchapp.com/api/webhooks/shopify",
    "topic": "products/update",
    "format": "json"
  }
}
```

## API Monitoring and Logging

All API calls are logged with:
- Timestamp
- Request method and endpoint
- Status code
- Response time
- Error details (if applicable)

Logs are accessible in the admin dashboard and can be exported for analysis.

## Security Best Practices

- All API calls use HTTPS
- Authentication tokens are stored securely
- API keys are never exposed in client-side code
- Requests include minimum required data
- Responses are validated before processing

