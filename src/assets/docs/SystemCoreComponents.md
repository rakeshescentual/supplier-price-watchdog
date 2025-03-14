
# System Core Components

## Frontend Architecture

The Supplier Price Watch application is built with a modern React frontend using TypeScript, Tailwind CSS, and shadcn UI components. This combination provides a responsive, accessible, and visually consistent user interface.

### Key Technology Stack

- **React**: Core UI library
- **TypeScript**: For type safety and improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **React Router**: For client-side routing
- **React Query**: For data fetching, caching, and state management
- **React Context**: For global state management

### Context Providers

The application uses React Context to manage global state and provide data to components:

1. **ShopifyContext**: Manages Shopify authentication and data sync
   - Handles connection status
   - Provides methods for data synchronization
   - Manages API credentials securely

2. **FileAnalysisContext**: Manages file processing and analysis state
   - Tracks file upload status
   - Provides analysis results and summary data
   - Manages historical analysis data

### Component Organization

Components are organized in a modular fashion:

```
src/
├── components/
│   ├── ui/               # UI components from shadcn
│   ├── documentation/    # Documentation components
│   ├── file-upload/      # File upload components
│   ├── index/            # Index page components
│   ├── supplier/         # Supplier-related components
│   └── ...               # Feature-specific components
├── contexts/
│   ├── shopify/          # Shopify integration context
│   ├── fileAnalysis/     # File analysis context
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── gadget/           # Gadget.dev integration
│   └── ...
├── pages/                # Page components
├── types/                # TypeScript type definitions
└── utils/                # Utility helpers
```

## API Structure

The application uses a modular API structure:

### Shopify API Integration

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

## Data Flow

1. User uploads a supplier price list
2. FileAnalysisContext processes the file
3. If connected to Shopify, data is matched with Shopify products
4. Analysis results are displayed to the user
5. User can take actions based on the analysis (update prices, notify customers, etc.)
6. Optional integrations with Gadget.dev and Google Workspace enhance functionality

This modular architecture ensures separation of concerns and maintainability of the codebase.
