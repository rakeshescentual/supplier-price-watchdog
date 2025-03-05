
interface Window {
  // Google API Client Library
  gapi: {
    load: (libraries: string, callback: () => void) => void;
    client: {
      init: (config: any) => Promise<any>;
      drive: {
        files: {
          create: (params: any) => Promise<any>;
          list: (params: any) => Promise<any>;
          get: (params: any) => Promise<any>;
          delete?: (params: any) => Promise<any>;
        };
      };
    };
    auth2?: {
      getAuthInstance: () => {
        isSignedIn: {
          get: () => boolean;
        };
        signIn: () => Promise<any>;
        signOut: () => Promise<any>;
      };
    };
  };

  // Google Analytics 4
  gtag: (...args: any[]) => void;

  // Google Merchant Center
  merchant?: {
    updateProducts: (products: any[], options?: any) => Promise<any>;
    fetchProductStatus: (productIds: string[]) => Promise<any>;
  };

  // Google Search Console
  gsc?: {
    submit: (url: string, options?: any) => Promise<any>;
    fetch: (query: string, options?: any) => Promise<any>;
  };
}
