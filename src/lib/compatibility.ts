
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
          }
        }
      }
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
    }
  };
}

export const ensureCompatibility = () => {
  // This function can be called from main.tsx to ensure compatibility fixes are applied
  console.log('Compatibility fixes applied');
};
