# Testing Framework

## Overview

This document outlines the testing framework and best practices for ensuring quality and reliability in the Supplier Price Watch application.

## Testing Levels

### Unit Testing

Unit tests verify that individual components and functions work as expected in isolation.

#### Key Areas for Unit Testing

- **Utility Functions**: Mathematical operations, formatting, validation
- **React Hooks**: Custom hooks for state management and business logic
- **Context Providers**: Provider functionality and state updates
- **Helper Classes**: Self-contained functionality classes

#### Implementation

```typescript
// Example unit test for price change calculation
describe('calculatePriceChange', () => {
  it('should calculate percentage correctly', () => {
    expect(calculatePriceChange(100, 110)).toBe(10);
    expect(calculatePriceChange(200, 150)).toBe(-25);
  });
  
  it('should handle zero values', () => {
    expect(calculatePriceChange(0, 100)).toBe(Infinity);
    expect(calculatePriceChange(100, 0)).toBe(-100);
  });
});
```

### Component Testing

Component tests verify that React components render correctly and respond appropriately to user interactions.

#### Key Components to Test

- **UI Components**: Buttons, forms, tables, charts
- **Feature Components**: FileUpload, PriceTable, ShopifyConnectionStatus
- **Page Components**: Dashboard, Documentation, GadgetDiagnostics

#### Implementation

```typescript
// Example component test for FileUpload
describe('FileUpload', () => {
  it('should display upload button', () => {
    render(<FileUpload onUploadComplete={jest.fn()} />);
    expect(screen.getByText('Upload Price List')).toBeInTheDocument();
  });
  
  it('should call onUploadComplete when file is processed', async () => {
    const mockOnUploadComplete = jest.fn();
    render(<FileUpload onUploadComplete={mockOnUploadComplete} />);
    
    // Simulate file upload
    const input = screen.getByLabelText('Upload file');
    fireEvent.change(input, { target: { files: [new File(['content'], 'test.xlsx')] } });
    
    // Wait for processing
    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalled();
    });
  });
});
```

### Integration Testing

Integration tests verify that multiple parts of the application work together correctly.

#### Key Integration Points

- **Context & Components**: Testing components with actual context providers
- **API Interactions**: Testing components that make API calls
- **Form Submissions**: Testing complete form workflows

#### Implementation

```typescript
// Example integration test for Shopify sync
describe('ShopifySync Integration', () => {
  beforeEach(() => {
    // Mock Shopify API
    mockShopifyApi();
  });
  
  it('should sync selected items to Shopify', async () => {
    // Set up test data
    const testItems = generateTestPriceItems(5);
    
    // Render component tree with context
    render(
      <ShopifyProvider>
        <PriceTable items={testItems} />
        <SyncControls />
      </ShopifyProvider>
    );
    
    // Select items and trigger sync
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getByText('Sync to Shopify'));
    
    // Verify sync was triggered with correct items
    await waitFor(() => {
      expect(mockShopifyApi.syncItems).toHaveBeenCalledWith(
        expect.arrayContaining([testItems[0]])
      );
    });
  });
});
```

### End-to-End Testing

E2E tests verify complete user flows in a browser-like environment.

#### Key User Flows

- **Price List Analysis**: Upload → Process → View Results → Take Action
- **Shopify Integration**: Connect Store → Match Products → Sync Prices
- **Customer Notifications**: Select Changes → Configure → Preview → Send

#### Implementation

```typescript
// Example E2E test for price list analysis flow
describe('Price List Analysis Flow', () => {
  it('should process an Excel file and display results', async () => {
    // Navigate to the upload page
    await page.goto('/');
    
    // Upload a file
    await page.setInputFiles('input[type="file"]', './test-data/sample-price-list.xlsx');
    
    // Wait for processing to complete
    await page.waitForSelector('.analysis-results');
    
    // Verify results are displayed
    const itemCount = await page.$$eval('.price-item', items => items.length);
    expect(itemCount).toBeGreaterThan(0);
    
    // Verify summary is accurate
    const increaseCount = await page.textContent('.increases-count');
    expect(increaseCount).toBe('5');
  });
});
```

## Testing Tools

### Primary Testing Framework

- **Jest**: Core testing framework
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking
- **Playwright**: End-to-end testing

### Additional Testing Utilities

- **faker.js**: Generate test data
- **jest-dom**: Custom DOM matchers
- **testing-library/user-event**: Simulate user interactions
- **jest-axe**: Accessibility testing

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/mocks/**',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Playwright Configuration

```javascript
// playwright.config.js
module.exports = {
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'Safari',
      use: { browserName: 'webkit' },
    },
  ],
};
```

## Test Data Management

### Fixture Files

Store test data in structured fixture files:

```
src/
└── test/
    └── fixtures/
        ├── priceItems.json       # Sample price items
        ├── supplierPriceLists/   # Sample price list files
        ├── shopifyProducts.json  # Sample Shopify products
        └── marketData.json       # Sample market data
```

### Factory Functions

Create factory functions to generate test data:

```typescript
// src/test/factories/priceItemFactory.ts
export function createPriceItem(overrides = {}): PriceItem {
  return {
    sku: `SKU-${Math.floor(Math.random() * 10000)}`,
    name: `Test Product ${Math.floor(Math.random() * 100)}`,
    oldPrice: 19.99,
    newPrice: 21.99,
    changePercent: 10,
    status: 'increased',
    ...overrides,
  };
}

export function createPriceItems(count: number, overrides = {}): PriceItem[] {
  return Array.from({ length: count }, () => createPriceItem(overrides));
}
```

## Mocking Strategies

### API Mocking

Use MSW to intercept and mock API requests:

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Mock Shopify API
  rest.get('https://api.shopify.com/admin/products.json', (req, res, ctx) => {
    return res(
      ctx.json({
        products: [
          { id: 1, title: 'Product 1', variants: [{ id: 101, price: '19.99' }] },
          { id: 2, title: 'Product 2', variants: [{ id: 102, price: '29.99' }] },
        ],
      })
    );
  }),
  
  // Mock Gadget.dev API
  rest.post('https://api.gadget.app/processPdf', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          items: [
            { sku: 'ABC123', description: 'Test Product', price: '19.99' },
            { sku: 'DEF456', description: 'Another Product', price: '29.99' },
            ],
        },
      })
    );
  }),
];
```

### Context Mocking

Create test wrappers with mocked context values:

```typescript
// src/test/wrappers/ShopifyContextWrapper.tsx
export function ShopifyContextWrapper({ children, mockValues = {} }) {
  const defaultValues = {
    isShopifyConnected: true,
    connectToShopify: jest.fn(),
    syncToShopify: jest.fn().mockResolvedValue({ success: true }),
    // ... other defaults
  };
  
  const contextValue = { ...defaultValues, ...mockValues };
  
  return (
    <ShopifyContext.Provider value={contextValue}>
      {children}
    </ShopifyContext.Provider>
  );
}
```

## Test Organization

### File Structure

Organize tests alongside the code they test:

```
src/
├── components/
│   ├── FileUpload.tsx
│   └── __tests__/
│       ├── FileUpload.test.tsx
│       └── FileUpload.integration.test.tsx
├── hooks/
│   ├── useFileAnalysis.ts
│   └── __tests__/
│       └── useFileAnalysis.test.ts
└── pages/
    ├── Dashboard.tsx
    └── __tests__/
        └── Dashboard.test.tsx
```

### Naming Conventions

Follow consistent naming conventions:

- **Unit tests**: `*.test.ts(x)`
- **Integration tests**: `*.integration.test.ts(x)`
- **E2E tests**: `*.e2e.test.ts`

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - name: Upload test coverage
        uses: codecov/codecov-action@v3
```

## Test-Driven Development Process

1. **Write failing test**: Define expected behavior first
2. **Implement code**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests passing
4. **Repeat**: Add more tests to expand functionality

### Example TDD Workflow

```typescript
// 1. Write failing test
describe('calculateMarginImpact', () => {
  it('should calculate margin impact correctly', () => {
    expect(calculateMarginImpact({
      oldPrice: 100,
      newPrice: 120,
      cost: 70
    })).toBe(-6.67); // Expected change in margin percentage
  });
});

// 2. Implement code to pass test
function calculateMarginImpact({ oldPrice, newPrice, cost }) {
  const oldMargin = (oldPrice - cost) / oldPrice * 100;
  const newMargin = (newPrice - cost) / newPrice * 100;
  return parseFloat((newMargin - oldMargin).toFixed(2));
}

// 3. Refactor while keeping tests passing
function calculateMarginImpact({ oldPrice, newPrice, cost }) {
  const calculateMargin = (price, cost) => (price - cost) / price * 100;
  
  const oldMargin = calculateMargin(oldPrice, cost);
  const newMargin = calculateMargin(newPrice, cost);
  
  return parseFloat((newMargin - oldMargin).toFixed(2));
}
```

## Accessibility Testing

Integrate accessibility testing into your workflow:

```typescript
// Example accessibility test
import { axe } from 'jest-axe';

describe('FileUpload accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<FileUpload onUploadComplete={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Performance Testing

### Key Performance Metrics

- **Time to process** large price lists (1000+ items)
- **Render time** for PriceTable with large datasets
- **API response time** for Shopify and Gadget operations
- **Memory usage** during file processing

### Implementation

```typescript
// Example performance test
describe('PriceTable performance', () => {
  it('should render 1000 items within 500ms', async () => {
    const items = createPriceItems(1000);
    
    const start = performance.now();
    render(<PriceTable items={items} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(500);
  });
});
```

## Test Best Practices

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Keep tests isolated**: Each test should be independent of others
3. **Use realistic test data**: Test with data that resembles production
4. **Be explicit about assertions**: Make it clear what you're testing
5. **Clean up after tests**: Reset state between tests
6. **Avoid test duplication**: Don't test the same thing multiple ways
7. **Test edge cases**: Handle zeros, empty strings, large values, etc.
8. **Maintain test quality**: Refactor tests along with code
9. **Prioritize test coverage**: Focus on critical paths first
10. **Document test scenarios**: Explain why certain tests are important

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing JavaScript Applications](https://testingjavascript.com/)
