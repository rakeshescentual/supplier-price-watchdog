
# Shopify GraphQL Migration Guide

## Important Deadline: April 1, 2025

As of April 1, 2025, Shopify will no longer accept public app store submissions that make REST API calls. This guide will help you prepare for this transition and ensure your app remains compliant.

## Key Changes

1. **REST API Deprecation**: All REST API calls must be replaced with GraphQL equivalents
2. **API Version Requirement**: Version 2025-04 or newer is required
3. **Breaking Changes**:
   - Some fields have been renamed
   - Some types have changed (former strings are now enums)
   - Some previously denormalized fields are now JSONs

## Migration Checklist

- [ ] Upgrade to Shopify API version 2025-04
- [ ] Identify all REST API calls in your codebase
- [ ] Replace each REST endpoint with its GraphQL equivalent
- [ ] Update field references to match GraphQL schema changes
- [ ] Convert string values to enum types where required
- [ ] Handle JSON fields that were previously denormalized
- [ ] Test thoroughly with the new API version

## Common REST to GraphQL Conversions

### Products

**REST:**
```
GET /admin/api/2024-04/products.json
```

**GraphQL:**
```graphql
query {
  products(first: 50) {
    edges {
      node {
        id
        title
        handle
        variants(first: 10) {
          edges {
            node {
              id
              price
              sku
            }
          }
        }
      }
    }
  }
}
```

### Orders

**REST:**
```
GET /admin/api/2024-04/orders.json
```

**GraphQL:**
```graphql
query {
  orders(first: 50) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
          email
        }
      }
    }
  }
}
```

### Webhooks

**REST:**
```
POST /admin/api/2024-04/webhooks.json
```

**GraphQL:**
```graphql
mutation {
  webhookSubscriptionCreate(
    topic: PRODUCTS_CREATE
    webhookSubscription: {
      callbackUrl: "https://example.com/webhooks"
      format: JSON
    }
  ) {
    webhookSubscription {
      id
    }
    userErrors {
      field
      message
    }
  }
}
```

## Field Naming Changes

Some fields have been renamed in the GraphQL API. Here are common examples:

| REST Field | GraphQL Field |
|------------|---------------|
| `variant_id` | `variantId` |
| `product_id` | `productId` |
| `line_items` | `lineItems` |
| `created_at` | `createdAt` |
| `updated_at` | `updatedAt` |

## Type Changes

Some fields that were strings in REST are now enums in GraphQL:

| Field | REST Type | GraphQL Type |
|-------|-----------|--------------|
| Status | String ("active", "archived") | Enum (ACTIVE, ARCHIVED) |
| Fulfillment Status | String ("fulfilled", "partial") | Enum (FULFILLED, PARTIALLY_FULFILLED) |
| Weight Unit | String ("kg", "g") | Enum (KILOGRAMS, GRAMS) |

## JSON Field Changes

Some fields that were flat in REST are now nested objects in GraphQL:

**REST:**
```json
{
  "price": "19.99",
  "currency": "USD"
}
```

**GraphQL:**
```json
{
  "priceSet": {
    "shopMoney": {
      "amount": "19.99",
      "currencyCode": "USD"
    }
  }
}
```

## Testing Your Migration

1. Create a development store in your Partner Dashboard
2. Set the API version to 2025-04 in your app
3. Run integration tests against all API endpoints
4. Monitor for errors and exceptions
5. Verify data consistency between old and new implementations

## Resources

- [Shopify GraphQL Admin API Reference](https://shopify.dev/docs/api/admin-graphql)
- [GraphQL Learning Resources](https://shopify.dev/docs/api/usage/graphql-explorer)
- [REST to GraphQL Migration Examples](https://shopify.dev/docs/apps/examples)

## Timeline

- **Now**: Begin identifying REST API calls in your codebase
- **When 2025-04 is available (April 1, 2025)**: Upgrade API version and test changes
- **Before April 1, 2025**: Complete migration for new public app submissions
- **By late 2025**: All existing public apps should be migrated
- **By 2026**: All custom apps should be migrated

## Need Assistance?

Contact our support team or visit the Shopify Developer Discord channel for help with your migration.
