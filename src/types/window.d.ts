
interface Window {
  gtag: (...args: any[]) => void;
  gsc?: {
    submit: (url: string, options?: any) => Promise<any>;
    fetch: (query: string, options?: any) => Promise<any>;
  };
  merchant?: {
    updateProducts: (products: any[], options?: any) => Promise<any>;
    fetchProductStatus: (productIds: string[]) => Promise<any>;
  };
}
