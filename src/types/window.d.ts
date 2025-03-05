
// Global window extensions for third-party libraries

interface Window {
  // Google Analytics
  gtag?: (...args: any[]) => void;
  
  // Google API Client
  gapi?: {
    load: (libraries: string, callback: () => void) => void;
    client?: {
      init: (config: any) => Promise<any>;
      drive?: {
        files?: {
          create: (params: any) => Promise<any>;
          list: (params: any) => Promise<any>;
          get: (params: any) => Promise<any>;
          delete?: (params: any) => Promise<any>;
        }
      };
    };
    auth2?: {
      getAuthInstance: () => {
        isSignedIn: {
          get: () => boolean;
          listen: (callback: (isSignedIn: boolean) => void) => void;
        };
        signIn: () => Promise<any>;
        signOut: () => Promise<any>;
        currentUser: {
          get: () => any;
        };
      };
    };
  };
  
  // Google Merchant Center
  merchant?: {
    updateProducts: (products: any[], options?: any) => Promise<any>;
    fetchProductStatus: (productIds: string[]) => Promise<any>;
    getProduct?: (productId: string) => Promise<any>;
    createProduct?: (product: any) => Promise<any>;
    deleteProduct?: (productId: string) => Promise<any>;
  };
  
  // Google Search Console
  gsc?: {
    submit: (url: string, options?: any) => Promise<any>;
    fetch: (query: string, options?: any) => Promise<any>;
    getSiteInfo?: (siteUrl: string) => Promise<any>;
    getPerformance?: (params: any) => Promise<any>;
  };
  
  // Klaviyo
  klaviyo?: {
    identify?: (email: string, customerProperties?: any) => void;
    track?: (event: string, properties?: any) => void;
    createSegment?: (segmentName: string, filter: any) => Promise<any>;
    getSegments?: () => Promise<any>;
  };
  
  // Shopify App Bridge
  shopify?: {
    createApp: (config: any) => any;
    actions?: any;
    utils?: any;
  };
}
