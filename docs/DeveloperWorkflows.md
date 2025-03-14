
# Developer Workflows

## Development Environment Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Familiarity with React, TypeScript, and Tailwind CSS

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/supplier-price-watch.git
   cd supplier-price-watch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` to include your development API keys.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Code Organization

### Directory Structure

```
src/
├── assets/          # Static assets and raw docs
├── components/      # React components
│   ├── ui/          # UI components from shadcn
│   ├── index/       # Index page components
│   ├── auth/        # Authentication components
│   └── ...          # Feature-specific components
├── contexts/        # React context providers
│   ├── shopify/     # Shopify integration context
│   ├── fileAnalysis/ # File analysis context
│   └── ...
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
│   ├── gadget/      # Gadget.dev integration
│   └── ...
├── pages/           # Page components
├── services/        # Service modules
├── types/           # TypeScript type definitions
└── utils/           # Utility helpers
```

### Key Component Types

- **Context Providers**: Manage global state and provide data to components
- **UI Components**: Pure presentation components from shadcn/ui
- **Feature Components**: Business logic components for specific features
- **Hooks**: Reusable stateful logic
- **Services**: External API interactions

## Development Workflow

### 1. Feature Development Process

1. **Understand Requirements**: Review specifications in Jira/GitHub issues
2. **Design**: Create component designs and state management plan
3. **Implementation**: Develop components and integration logic
4. **Testing**: Write and run unit and integration tests
5. **Code Review**: Submit PR for peer review
6. **Documentation**: Update relevant documentation files
7. **Deployment**: Merge to main branch for deployment

### 2. State Management Guidelines

- Use React Context for global state (e.g., Shopify connection status)
- Use local component state for UI state
- Extract reusable stateful logic into custom hooks
- Use React Query for data fetching and caching

### 3. Component Development Guidelines

- Keep components small and focused (< 200 lines)
- Use composition over inheritance
- Implement proper TypeScript interfaces for props
- Follow accessibility best practices
- Use Storybook for component development and documentation

### 4. Integration Patterns

#### Shopify Integration

For integrating with Shopify API:
1. Use the `useShopify` hook to access connection state and methods
2. Ensure proper error handling and loading states
3. Implement exponential backoff for rate-limited requests

Example:
```typescript
const { isShopifyConnected, syncToShopify } = useShopify();

const handleSync = async () => {
  if (!isShopifyConnected) {
    toast.error("Please connect to Shopify first");
    return;
  }
  
  const result = await syncToShopify(selectedItems);
  if (result) {
    toast.success("Sync completed successfully");
  }
};
```

#### Gadget.dev Integration

For leveraging Gadget.dev capabilities:
1. Use the Gadget client initialization pattern
2. Implement fallback mechanisms when Gadget is not available
3. Use batch operations for efficient API usage

## Testing Strategy

- **Unit Tests**: Test individual components and hooks
- **Integration Tests**: Test component interactions and context providers
- **E2E Tests**: Test complete user workflows

## Build and Deployment

See [DeploymentGuide.md](./DeploymentGuide.md) for detailed deployment procedures.

## Performance Considerations

- Use React.memo for expensive render components
- Implement virtualization for large lists
- Optimize re-renders by minimizing context changes
- Use proper keys for list items

## Troubleshooting

Common development issues and solutions:

- **Build Errors**: Check TypeScript types and import paths
- **React Hook Warnings**: Ensure proper dependency arrays in useEffect, useMemo, etc.
- **API Connection Issues**: Verify credentials and network connectivity
- **Performance Issues**: Use React DevTools profiler to identify bottlenecks

