
# Shopify Plus and Built for Shopify Compliance Guide

This guide ensures that the Supplier Price Watch application meets all requirements for Shopify Plus certification and the Built for Shopify program.

## Built for Shopify Requirements

### 1. Technical Requirements

#### API Usage

✅ **GraphQL Required (As of April 1, 2025)**
- All Shopify API interactions use GraphQL exclusively
- No REST API calls are made
- API version 2025-04 or later is used

✅ **Proper API Versioning**
- All Shopify API calls use a dated version (e.g., `2025-04`)
- Version is configured centrally and can be updated easily
- App handles API version deprecation gracefully

✅ **GraphQL Best Practices**
- Uses aliases for complex queries
- Requests only needed fields
- Uses fragments for reusable components
- Uses bulk operations for large datasets

✅ **Rate Limiting**
- Implements backoff strategies for rate limiting
- Respects Shopify's leaky bucket algorithm
- Processes requests in batches to avoid limits

#### Authentication

✅ **OAuth Implementation**
- Uses standard OAuth flow for authentication
- Securely stores access tokens
- Implements token refresh mechanisms
- Uses app proxies appropriately

✅ **Session Management**
- Validates session tokens
- Implements session expiration
- Secures all session data

#### Performance

✅ **Efficient API Usage**
- Minimizes API calls through batching
- Uses webhooks for real-time updates
- Implements pagination correctly

✅ **Resource Management**
- Optimizes memory usage
- Manages background processes efficiently
- Implements caching strategies

### 2. App Experience

✅ **Embedded App Compliance**
- Follows Polaris design system
- Uses App Bridge for navigation
- Stays within Shopify admin context

✅ **Responsive Design**
- Adapts to all screen sizes
- Supports mobile admin usage
- Maintains usability on all devices

✅ **User Feedback**
- Provides loading states
- Shows clear error messages
- Confirms successful actions

### 3. Security Requirements

✅ **Data Protection**
- Encrypts sensitive data
- Does not store customer PII unnecessarily
- Implements proper data retention policies

✅ **Request Verification**
- Validates HMAC signatures
- Verifies webhook authenticity
- Prevents CSRF attacks

✅ **Access Control**
- Limits app permissions to only what's needed
- Implements staff account access controls
- Respects merchant collaboration roles

## Shopify Plus Certification Requirements

### 1. Plus-Specific Features

✅ **Scripts Support**
- Creates and manages Shopify Scripts
- Provides script templates for common use cases
- Validates scripts before deployment

✅ **Flow Integration**
- Creates and triggers Flows
- Supports custom Flow conditions
- Provides action templates

✅ **Launchpad Support**
- Integrates with Launchpad events
- Schedules price changes
- Supports campaign coordination

### 2. Enterprise Capabilities

✅ **Multi-Location Support**
- Manages inventory across locations
- Supports location-specific pricing
- Handles location transfers

✅ **B2B Functionality**
- Supports B2B price lists
- Manages customer-specific pricing
- Integrates with B2B customer accounts

✅ **Advanced User Management**
- Respects staff permission levels
- Supports collaboration accounts
- Provides role-specific views

### 3. Performance & Reliability

✅ **High Performance**
- Handles large catalogs (100,000+ products)
- Processes bulk operations efficiently
- Maintains responsiveness under load

✅ **Reliability**
- Implements comprehensive error handling
- Provides fallback mechanisms
- Maintains uptime commitments

✅ **Scalability**
- Scales with merchant growth
- Handles seasonal traffic spikes
- Manages resource allocation dynamically

## Implementation Details

### GraphQL API Interaction (Required as of April 1, 2025)

```typescript
// GraphQL example for product updates
const updateProduct = async (productId, priceData) => {
  const client = initGadgetClient();
  
  return await client.mutate({
    mutation: gql`
      mutation productVariantUpdate($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        id: productId,
        variants: {
          id: priceData.variantId,
          price: priceData.newPrice.toString()
        }
      }
    }
  });
};

// Batch processing with rate limiting awareness
export const performBatchOperations = async (items, processFn, options) => {
  // Implementation includes:
  // 1. Backoff strategy for rate limits
  // 2. Concurrent request management
  // 3. Error handling with retries
  // 4. Progress tracking and reporting
};
```

### Plus-Specific Features

```typescript
// Script deployment example using GraphQL
export const deployShopifyScript = async (
  context: ShopifyContext,
  scriptConfig: ShopifyScriptConfig
): Promise<{ success: boolean; scriptId?: string }> => {
  const client = initGadgetClient();
  
  // Implementation connects to Shopify Plus Scripts API via GraphQL
  // and handles deployment, validation, and activation
};

// B2B pricing example using GraphQL
export const syncB2BPrices = async (
  context: ShopifyContext,
  items: PriceItem[],
  customerSegments: string[]
): Promise<{ success: boolean }> => {
  // Implementation handles B2B-specific price lists via GraphQL
  // and customer segment associations
};
```

### Security Implementation

```typescript
// Webhook verification
export const verifyWebhook = (request, secret) => {
  const hmac = request.headers['x-shopify-hmac-sha256'];
  const body = request.rawBody;
  
  const calculatedHmac = createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
  
  return safeCompare(hmac, calculatedHmac);
};

// Session validation
export const validateSession = async (session) => {
  // Implementation verifies session token
  // and checks for expiration
};
```

## Testing & Validation

A comprehensive testing strategy ensures compliance:

1. **Unit Tests**: Cover all core functions
2. **Integration Tests**: Verify Shopify API interactions
3. **Performance Tests**: Validate under load
4. **Security Scans**: Check for vulnerabilities
5. **Accessibility Tests**: Ensure WCAG compliance

## April 2025 GraphQL Transition Checklist

Before submitting your app to the Shopify App Store after April 1, 2025:

- [ ] Confirm API version is 2025-04 or newer
- [ ] Verify all Shopify API calls use GraphQL (no REST calls)
- [ ] Test all GraphQL queries and mutations with the new schema
- [ ] Update any field references that have changed in the transition
- [ ] Convert any string enums to proper GraphQL enum types
- [ ] Handle any normalized data structures properly
- [ ] Update documentation to reflect GraphQL-only approach
- [ ] Test thoroughly with the 2025-04 API version in development/staging
- [ ] Create a rollback plan in case of issues

## Compliance Checklist

Before submission for certification, verify:

- [ ] All API calls use GraphQL (required as of April 1, 2025)
- [ ] API version is set to 2025-04 or newer
- [ ] Rate limiting is handled properly
- [ ] Authentication follows best practices
- [ ] App provides clear feedback to users
- [ ] Data is properly secured
- [ ] Shopify Plus features are fully supported
- [ ] Accessibility requirements are met
- [ ] Documentation is complete and accurate
- [ ] Support channels are established
- [ ] Privacy policy is up to date

## Resources

- [Shopify API Documentation](https://shopify.dev/docs/api)
- [GraphQL API Reference](https://shopify.dev/docs/api/admin-graphql)
- [Built for Shopify Requirements](https://shopify.dev/docs/apps/launch/built-for-shopify)
- [Shopify Plus Partners](https://help.shopify.com/en/partners/plus-partners)
- [Shopify App Bridge](https://shopify.dev/docs/apps/tools/app-bridge)
- [Polaris Design System](https://polaris.shopify.com/)

By following this guide, the Supplier Price Watch application will meet all requirements for Shopify Plus certification and the Built for Shopify program, including the April 1, 2025 deadline for GraphQL-only API usage.
