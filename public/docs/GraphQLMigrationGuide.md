
# Shopify GraphQL Migration Guide

## Overview

Starting April 2025, Shopify will require all public apps to use GraphQL APIs exclusively, as REST APIs will no longer be accepted for app submissions. This guide will help you migrate your app from REST to GraphQL.

## Timeline

- **April 2024**: First GraphQL-only API version (2024-04) released
- **July 2024**: GraphQL-only API version (2024-07) released
- **October 2024**: GraphQL-only API version (2024-10) released
- **April 1, 2025**: Shopify will no longer accept public app submissions that make REST API calls

## Why GraphQL?

GraphQL offers several advantages over REST:

1. **Precise data retrieval**: Request only the data you need
2. **Single request**: Fetch multiple resources in a single request
3. **Strong typing**: Clear schema definition with built-in documentation
4. **Powerful introspection**: Explore the API through GraphQL tooling
5. **Improved performance**: Reduces over-fetching and under-fetching of data

## Migration Steps

### 1. Update Your API Version

First, update your app to use a GraphQL-compatible API version (2024-04 or later):

```javascript
// Before
const shopify = createShopifyClient({
  apiVersion: '2023-10'
});

// After
const shopify = createShopifyClient({
  apiVersion: '2024-10'
});
```

### 2. Convert REST Endpoints to GraphQL Queries

#### Products

**REST (Before):**
```javascript
const products = await shopify.rest.get('/admin/api/2023-10/products.json');
```

**GraphQL (After):**
```javascript
const { data } = await shopify.graphql(`
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          variants(first: 5) {
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
`);
```

#### Orders

**REST (Before):**
```javascript
const orders = await shopify.rest.get('/admin/api/2023-10/orders.json?status=any');
```

**GraphQL (After):**
```javascript
const { data } = await shopify.graphql(`
  query {
    orders(first: 10, query: "status:any") {
      edges {
        node {
          id
          name
          displayFinancialStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`);
```

### 3. Convert REST Mutations to GraphQL Mutations

#### Creating a Product

**REST (Before):**
```javascript
const newProduct = await shopify.rest.post('/admin/api/2023-10/products.json', {
  product: {
    title: "New Product",
    product_type: "Accessories",
    vendor: "My Store"
  }
});
```

**GraphQL (After):**
```javascript
const { data } = await shopify.graphql(`
  mutation {
    productCreate(input: {
      title: "New Product",
      productType: "Accessories",
      vendor: "My Store"
    }) {
      product {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`);
```

### 4. Use Variables for Dynamic Data

Rather than string interpolation, use GraphQL variables:

```javascript
const { data } = await shopify.graphql(`
  mutation productUpdate($input: ProductInput!, $id: ID!) {
    productUpdate(input: $input, id: $id) {
      product {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`, {
  variables: {
    id: "gid://shopify/Product/1234567890",
    input: {
      title: "Updated Product Title"
    }
  }
});
```

### 5. Testing Your GraphQL Queries

Use the GraphQL Explorer in the Shopify Partner Dashboard to build and test your queries before implementing them in your app:

1. Log in to your [Shopify Partner Dashboard](https://partners.shopify.com)
2. Navigate to "Apps" and select your app
3. Click on "Extensions" and then "API Explorer"
4. Use the GraphQL Explorer to build and test your queries

## Common Challenges and Solutions

### Pagination

**REST (Before):**
```javascript
let page = 1;
let hasMore = true;
while (hasMore) {
  const response = await shopify.rest.get(`/admin/api/2023-10/products.json?page=${page}`);
  // Process data
  hasMore = response.headers['link'] && response.headers['link'].includes('rel="next"');
  page++;
}
```

**GraphQL (After):**
```javascript
let hasNextPage = true;
let cursor = null;

while (hasNextPage) {
  const query = `
    query getProducts($cursor: String) {
      products(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;
  
  const { data } = await shopify.graphql(query, {
    variables: { cursor }
  });
  
  // Process data
  hasNextPage = data.products.pageInfo.hasNextPage;
  cursor = data.products.pageInfo.endCursor;
}
```

### Error Handling

**REST (Before):**
```javascript
try {
  const response = await shopify.rest.get('/admin/api/2023-10/products.json');
  // Process data
} catch (error) {
  if (error.response && error.response.status === 429) {
    // Handle rate limit
  } else {
    // Handle other errors
  }
}
```

**GraphQL (After):**
```javascript
try {
  const { data, errors } = await shopify.graphql(`
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `);
  
  if (errors) {
    // Handle GraphQL errors
    const throttled = errors.some(e => e.extensions && e.extensions.code === 'THROTTLED');
    if (throttled) {
      // Handle rate limit
    }
  } else {
    // Process data
  }
} catch (error) {
  // Handle network or other errors
}
```

## Resources

- [Shopify GraphQL Admin API Reference](https://shopify.dev/api/admin-graphql)
- [GraphQL Learning Resources](https://shopify.dev/api/usage/graphql-learning-resources)
- [Migrating from REST to GraphQL](https://shopify.dev/api/usage/migrating-to-graphql)
- [GraphQL Query Builder](https://shopify.dev/api/tools/graphql-query-builder)

## Support

If you encounter issues during migration, contact Shopify Developer Support through the Partner Dashboard or join the [Shopify Community forums](https://community.shopify.com/c/Shopify-APIs-SDKs/bd-p/shopify-apis-and-sdks).
