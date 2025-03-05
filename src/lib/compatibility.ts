
/**
 * This file contains compatibility fixes for third-party libraries
 * and type declarations that need global modifications
 */

// Ensure window.gapi is always valid
if (typeof window !== 'undefined') {
  // Google API Client
  window.gapi = window.gapi || {
    load: (libraries, callback) => {
      console.warn('Mock gapi.load called - Google API not actually loaded');
      setTimeout(callback, 0);
    },
    client: {
      init: (config) => {
        console.warn('Mock gapi.client.init called - Google API not actually initialized');
        return Promise.resolve();
      },
      drive: {
        files: {
          create: (params) => {
            console.warn('Mock gapi.client.drive.files.create called');
            return Promise.resolve({ result: { id: 'mock-file-id', name: params?.resource?.name } });
          },
          list: (params) => {
            console.warn('Mock gapi.client.drive.files.list called');
            return Promise.resolve({ result: { files: [] } });
          },
          get: (params) => {
            console.warn('Mock gapi.client.drive.files.get called');
            return Promise.resolve({ result: { id: params?.fileId } });
          },
          delete: (params) => {
            console.warn('Mock gapi.client.drive.files.delete called');
            return Promise.resolve({ result: { success: true } });
          }
        }
      }
    },
    auth2: {
      getAuthInstance: () => ({
        isSignedIn: {
          get: () => false,
          listen: (callback) => callback(false),
        },
        signIn: () => Promise.resolve({}),
        signOut: () => Promise.resolve({}),
        currentUser: {
          get: () => ({
            getBasicProfile: () => ({
              getName: () => 'Mock User',
              getEmail: () => 'mock@example.com',
              getImageUrl: () => 'https://example.com/avatar.png',
            })
          })
        }
      })
    }
  };

  // Google Analytics 4
  window.gtag = window.gtag || function() {
    console.log('Mock gtag called with:', ...arguments);
  };

  // Google Merchant Center
  window.merchant = window.merchant || {
    updateProducts: async (products, options = {}) => {
      console.log(`Mock Merchant Center: Updating ${products.length} products`, options);
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true,
        updatedCount: products.length,
        products 
      };
    },
    fetchProductStatus: async (productIds) => {
      console.log(`Mock Merchant Center: Fetching status for ${productIds.length} products`);
      await new Promise(resolve => setTimeout(resolve, 600));
      return { 
        products: productIds.map(id => ({
          id,
          status: Math.random() > 0.1 ? 'active' : 'pending',
          issues: Math.random() > 0.8 ? ['price_mismatch'] : []
        }))
      };
    },
    getProduct: async (productId) => {
      console.log(`Mock Merchant Center: Getting product ${productId}`);
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        product: {
          id: productId,
          title: `Product ${productId}`,
          price: 19.99,
          status: 'active'
        }
      };
    },
    createProduct: async (product) => {
      console.log(`Mock Merchant Center: Creating product`, product);
      await new Promise(resolve => setTimeout(resolve, 700));
      return {
        success: true,
        product: {
          ...product,
          id: `gid://merchant-center/Product/${Date.now()}`
        }
      };
    },
    deleteProduct: async (productId) => {
      console.log(`Mock Merchant Center: Deleting product ${productId}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        id: productId
      };
    }
  };

  // Google Search Console
  window.gsc = window.gsc || {
    submit: async (url, options = {}) => {
      console.log(`Mock GSC: Submitted URL for indexing: ${url}`, options);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, url };
    },
    fetch: async (query, options = {}) => {
      console.log(`Mock GSC: Queried data: ${query}`, options);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        data: [{
          url: `${options.siteUrl || 'https://example.com'}/products/sample`,
          impressions: 120,
          clicks: 15,
          position: 4.2
        }]
      };
    },
    getSiteInfo: async (siteUrl) => {
      console.log(`Mock GSC: Getting site info for: ${siteUrl}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        siteUrl,
        verificationType: 'meta',
        isVerified: true,
        lastCrawled: new Date().toISOString()
      };
    },
    getPerformance: async (params) => {
      console.log(`Mock GSC: Getting performance data`, params);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        dimensions: ['query', 'page'],
        rows: [
          {
            keys: ['price increase', '/products/sample'],
            clicks: 24,
            impressions: 230,
            ctr: 0.104,
            position: 3.2
          }
        ]
      };
    }
  };

  // Klaviyo mockup
  window.klaviyo = window.klaviyo || {
    identify: (email, customerProperties = {}) => {
      console.log(`Mock Klaviyo: Identifying customer ${email}`, customerProperties);
    },
    track: (event, properties = {}) => {
      console.log(`Mock Klaviyo: Tracking event ${event}`, properties);
    },
    createSegment: async (segmentName, filter) => {
      console.log(`Mock Klaviyo: Creating segment ${segmentName}`, filter);
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        id: `segment_${Date.now()}`,
        name: segmentName,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        filter_query: filter
      };
    },
    getSegments: async () => {
      console.log(`Mock Klaviyo: Getting segments`);
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        segments: [
          {
            id: 'segment_1',
            name: 'Price Increase Notification',
            created: new Date().toISOString(),
            count: 356
          }
        ]
      };
    }
  };

  // Shopify App Bridge
  window.shopify = window.shopify || {
    createApp: (config) => {
      console.log('Mock Shopify App Bridge: Creating app', config);
      return {
        dispatch: (action) => {
          console.log('Mock Shopify App Bridge: Dispatching action', action);
          return Promise.resolve();
        }
      };
    },
    actions: {
      Redirect: {
        Action: {
          ADMIN_PATH: 'ADMIN_PATH',
          REMOTE: 'REMOTE'
        }
      }
    },
    utils: {
      getSessionToken: () => Promise.resolve('mock-session-token')
    }
  };
}

export const ensureCompatibility = () => {
  // Initialize any additional compatibility fixes

  // Initialize mock data for development
  if (process.env.NODE_ENV === 'development') {
    // Set up mock data
    localStorage.setItem('mockDataEnabled', 'true');
  }

  console.log('Compatibility fixes applied');
};

// Export any helper functions for mock data
export const getMockItems = (count = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    sku: `SKU${i + 1000}`,
    name: `Test Product ${i + 1}`,
    oldPrice: 19.99 + i,
    newPrice: (19.99 + i) * (Math.random() > 0.7 ? 1.1 : Math.random() > 0.5 ? 0.95 : 1),
    status: Math.random() > 0.7 ? 'increased' : Math.random() > 0.5 ? 'decreased' : 'unchanged',
    difference: 0,
    isMatched: true,
    productId: `gid://shopify/Product/${1000000 + i}`,
    variantId: `gid://shopify/ProductVariant/${2000000 + i}`,
    inventoryItemId: `gid://shopify/InventoryItem/${3000000 + i}`,
    inventoryLevel: Math.floor(Math.random() * 100),
    compareAtPrice: 24.99 + i,
    tags: ['test', 'sample'],
    historicalSales: Math.floor(Math.random() * 1000),
    lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    vendor: ['Supplier A', 'Supplier B', 'Supplier C'][Math.floor(Math.random() * 3)]
  }));
};

// Export types for development use
export type MockApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};
