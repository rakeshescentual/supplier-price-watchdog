
# Component Reference

This document provides a detailed reference for all major components in the Supplier Price Watch application.

## UI Components

These components are part of the shadcn/ui library and provide the basic building blocks for the application interface.

### Button

```tsx
import { Button } from "@/components/ui/button";

<Button 
  variant="default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size="default" | "sm" | "lg" | "icon"
  onClick={handleClick}
  disabled={isDisabled}
>
  Button Text
</Button>
```

### Input

```tsx
import { Input } from "@/components/ui/input";

<Input 
  type="text" | "email" | "password" | "number"
  placeholder="Enter value"
  value={value}
  onChange={handleChange}
  disabled={isDisabled}
/>
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select onValueChange={handleValueChange} defaultValue={defaultValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Card

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter>
    {/* Card footer */}
  </CardFooter>
</Card>
```

## Feature Components

These components provide specific functionality within the application.

### FileUpload

Allows users to upload supplier price lists for analysis.

```tsx
import { FileUpload } from "@/components/FileUpload";

<FileUpload 
  onUploadComplete={handleUploadComplete}
  acceptedFileTypes={['.xlsx', '.pdf', '.csv']}
  maxFileSizeMB={10}
/>
```

Props:
- `onUploadComplete`: Function called when upload is complete with analysis result
- `acceptedFileTypes`: Array of accepted file extensions
- `maxFileSizeMB`: Maximum file size in megabytes

### PriceTable

Displays analyzed price items with sorting, filtering, and selection.

```tsx
import { PriceTable } from "@/components/PriceTable";

<PriceTable 
  items={priceItems}
  onSelectionChange={handleSelectionChange}
  onSortChange={handleSortChange}
  onFilterChange={handleFilterChange}
/>
```

Props:
- `items`: Array of price items to display
- `onSelectionChange`: Function called when selection changes
- `onSortChange`: Function called when sort changes
- `onFilterChange`: Function called when filter changes

### ShopifyConnectionStatus

Displays the current Shopify connection status and allows reconnection.

```tsx
import { ShopifyConnectionStatus } from "@/components/ShopifyConnectionStatus";

<ShopifyConnectionStatus />
```

### AIAnalysis

Displays AI-generated insights based on price analysis.

```tsx
import { AIAnalysis } from "@/components/AIAnalysis";

<AIAnalysis 
  items={priceItems}
  showDetailedInsights={true}
/>
```

Props:
- `items`: Array of price items to analyze
- `showDetailedInsights`: Whether to show detailed insights

### MarketInsights

Displays market insights and competitive analysis.

```tsx
import { MarketInsights } from "@/components/MarketInsights";

<MarketInsights 
  items={priceItems}
  marketPosition="average" | "low" | "high"
/>
```

Props:
- `items`: Array of price items to analyze
- `marketPosition`: Overall market position

## Context Providers

These components provide global state and functionality throughout the application.

### ShopifyProvider

Provides Shopify connection state and methods.

```tsx
import { ShopifyProvider } from "@/contexts/shopify";

<ShopifyProvider>
  <App />
</ShopifyProvider>
```

Available context:
- `isShopifyConnected`: Boolean indicating if connected to Shopify
- `isShopifyHealthy`: Boolean indicating connection health
- `connectToShopify`: Function to connect to Shopify
- `disconnectShopify`: Function to disconnect from Shopify
- `syncToShopify`: Function to sync items to Shopify

### FileAnalysisProvider

Provides file analysis state and methods.

```tsx
import { FileAnalysisProvider } from "@/contexts/fileAnalysis";

<FileAnalysisProvider>
  <App />
</FileAnalysisProvider>
```

Available context:
- `analysisResult`: Current analysis result
- `isAnalyzing`: Boolean indicating if analysis is in progress
- `analyzeFile`: Function to analyze a file
- `resetAnalysis`: Function to reset analysis state
- `exportAnalysis`: Function to export analysis

## Hooks

These custom hooks provide reusable logic throughout the application.

### useShopify

Provides access to the Shopify context.

```tsx
import { useShopify } from "@/contexts/shopify";

const { 
  isShopifyConnected, 
  isShopifyHealthy,
  connectToShopify,
  disconnectShopify,
  syncToShopify
} = useShopify();
```

### useFileAnalysis

Provides access to the file analysis context.

```tsx
import { useFileAnalysis } from "@/contexts/fileAnalysis";

const {
  analysisResult,
  isAnalyzing,
  analyzeFile,
  resetAnalysis,
  exportAnalysis
} = useFileAnalysis();
```

### useCustomerNotifications

Provides functionality for sending customer notifications.

```tsx
import { useCustomerNotifications } from "@/hooks/useCustomerNotifications";

const {
  isSendingNotifications,
  lastNotificationResult,
  sendPriceIncreaseNotifications,
  generatePriceIncreaseHtml
} = useCustomerNotifications();
```

### useGadgetConnection

Provides Gadget.dev connection management.

```tsx
import { useGadgetConnection } from "@/hooks/useGadgetConnection";

const {
  isGadgetConnected,
  initializeGadget,
  disconnectGadget,
  testGadgetConnection
} = useGadgetConnection();
```

## Page Components

These components represent complete pages in the application.

### Dashboard

Main dashboard with summary information.

```tsx
import Dashboard from "@/pages/Dashboard";

<Dashboard />
```

### Documentation

Documentation page with tabs for different topics.

```tsx
import Documentation from "@/pages/Documentation";

<Documentation />
```

### GadgetDiagnostics

Page for diagnosing Gadget.dev connection issues.

```tsx
import GadgetDiagnostics from "@/pages/GadgetDiagnostics";

<GadgetDiagnostics />
```

### CompetitorAnalysis

Page for analyzing competitor pricing.

```tsx
import CompetitorAnalysis from "@/pages/CompetitorAnalysis";

<CompetitorAnalysis />
```

## Utility Components

These components provide specific utility functions.

### UploadProgress

Displays file upload progress.

```tsx
import { UploadProgress } from "@/components/file-upload/UploadProgress";

<UploadProgress 
  progress={75}
  fileName="supplier_prices.xlsx"
  fileSize={1024 * 1024}
  status="uploading" | "processing" | "complete" | "error"
  error={errorMessage}
/>
```

Props:
- `progress`: Upload progress percentage (0-100)
- `fileName`: Name of the file being uploaded
- `fileSize`: Size of the file in bytes
- `status`: Current status of the upload
- `error`: Error message if status is "error"

### GadgetConfigForm

Form for configuring Gadget.dev connection.

```tsx
import { GadgetConfigForm } from "@/components/GadgetConfigForm";

<GadgetConfigForm
  onSave={handleConfigSave}
  initialConfig={currentConfig}
/>
```

Props:
- `onSave`: Function called when configuration is saved
- `initialConfig`: Initial configuration object

### ShopifyAlerts

Displays alerts related to Shopify connection.

```tsx
import { ShopifyAlerts } from "@/components/file-upload/ShopifyAlerts";

<ShopifyAlerts />
```

## Component Hierarchy

```
App
├── Navigation
├── Routes
│   ├── Dashboard
│   │   ├── FileStats
│   │   ├── RecentAnalysesList
│   │   └── AIAnalysis
│   ├── Index
│   │   ├── Header
│   │   ├── HowItWorks
│   │   └── IndexTabs
│   ├── Documentation
│   │   ├── TechnicalDocumentation
│   │   └── GadgetIntegrationGuide
│   ├── CompetitorAnalysis
│   │   ├── CompetitorPriceTable
│   │   └── CompetitorPriceGraph
│   └── GadgetDiagnostics
│       ├── GadgetConnectionTest
│       └── GadgetTestResults
└── FileUpload (Floating component)
    ├── UploadIcon
    ├── UploadContent
    ├── UploadProgress
    └── ShopifyAlerts
```

## Best Practices

When using these components:

1. Always provide all required props
2. Use TypeScript for prop type checking
3. Follow the component hierarchy for logical organization
4. Maintain separation of concerns between components
5. Use context providers at appropriate levels to minimize re-renders
6. Use React.memo for performance-sensitive components
7. Follow accessibility best practices (aria attributes, keyboard navigation)
8. Maintain consistent styling and UX patterns

