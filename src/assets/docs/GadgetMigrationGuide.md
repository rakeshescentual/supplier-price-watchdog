
# Migrating to Gadget.dev

This guide provides practical steps for moving the application from GitHub to Gadget.dev, ensuring a smooth transition.

## Pre-Migration Checklist

- [ ] Ensure you have a Gadget.dev account
- [ ] Create a new Gadget application in the Gadget dashboard
- [ ] Generate an API key with appropriate permissions
- [ ] Configure CORS in your Gadget application settings
- [ ] Make a backup of your GitHub repository

## Migration Process

### Step 1: Configure Your Gadget Application

1. Create the necessary data models in Gadget:
   - Product model (matching your PriceItem interface)
   - Supplier model
   - PriceChange model
   - Any other models specific to your application

2. Configure appropriate connections in Gadget:
   - Shopify connection (if using Shopify integration)
   - Email provider connection (if using email notifications)

3. Set up environment variables in Gadget for any secrets

### Step 2: Prepare Your Codebase

1. Use the Gadget configuration form to set up your connection:
   - Enter your App ID
   - Add your API key
   - Select the appropriate environment
   - Enable necessary feature flags

2. Update Gadget-specific code paths to use actual Gadget SDK:
   - Replace mock implementations with real Gadget client code
   - Use the provided `@gadgetinc/api-client-core` package

3. Test your application with the Gadget connection

### Step 3: Implement Gadget Actions

1. Create custom actions in Gadget for:
   - Processing PDF files
   - Syncing with Shopify
   - Batch operations
   - Market data enrichment

2. Update your code to call these Gadget actions:

```typescript
// Example of calling a Gadget action
const result = await client.mutate.processPriceList({
  file: uploadedFileId,
  options: {
    parseColumns: true,
    inferTypes: true
  }
});
```

### Step 4: Deploy Your Frontend

1. Build your React application:
   ```
   npm run build
   ```

2. Deploy your frontend to a hosting provider that supports SPAs:
   - Netlify
   - Vercel
   - GitHub Pages
   - Or use Gadget's frontend hosting capability

3. Update your CORS settings in Gadget to allow requests from your frontend domain

### Step 5: Test and Verify

1. Test all critical features:
   - Gadget configuration
   - Shopify integration
   - PDF processing
   - Data enrichment
   - Batch operations

2. Verify error handling and retry mechanisms

3. Test performance with realistic data volumes

## Gadget Features to Leverage

### 1. Actions

Gadget Actions are perfect for:
- Processing PDFs with OCR
- Market data enrichment
- Batch operations
- Complex business logic

### 2. Connections

Utilize pre-built connections for:
- Shopify
- Email providers
- Klaviyo
- Other third-party services

### 3. Background Jobs

Ideal for:
- Long-running PDF processing
- Web scraping for market data
- Bulk Shopify synchronization
- Data analysis tasks

### 4. Role-Based Permissions

Configure granular access controls:
- Admin vs regular users
- Read-only access to certain data
- Action-specific permissions

## Common Issues and Solutions

### CORS Issues

If you see CORS errors:
1. Go to Gadget App Settings → CORS
2. Add your frontend domain(s)
3. Enable the required HTTP methods
4. Allow credentials if needed

### Authentication Issues

If you experience authentication problems:
1. Verify API key permissions
2. Check API key expiration
3. Ensure proper Authorization header

### Performance Issues

For slow operations:
1. Use batch operations for bulk processing
2. Implement pagination for large data sets
3. Consider using background jobs for heavy tasks
4. Enable caching for frequent API calls

## Best Practices

1. **Environment Separation**: Maintain separate development and production environments

2. **Error Tracking**: Use Gadget's logging and monitor error rates

3. **Progressive Implementation**: Migrate one feature at a time to reduce risk

4. **Stateless Design**: Design your frontend to be stateless and rely on Gadget APIs

5. **Backup Strategy**: Regularly back up your Gadget data models

## Support Resources

- [Gadget Documentation](https://docs.gadget.dev)
- [Gadget API Reference](https://docs.gadget.dev/api)
- [Gadget Community Discord](https://discord.gg/gadget)
- [GitHub Repository](https://github.com/yourusername/your-repo)
