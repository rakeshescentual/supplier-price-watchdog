
import { ShopifyContext } from '@/types/price';

/**
 * Fetch Shopify products
 */
export const getShopifyProducts = async () => {
  console.log("Fetching products from Shopify");
  // Mock implementation
  return [
    { id: '1', title: 'Product 1', price: 19.99 },
    { id: '2', title: 'Product 2', price: 29.99 },
    { id: '3', title: 'Product 3', price: 39.99 },
  ];
};

/**
 * Get sync history from Shopify
 */
export const getShopifySyncHistory = async () => {
  console.log("Fetching sync history from Shopify");
  // Mock implementation
  return [
    { id: '1', date: new Date(), status: 'success', items: 5 },
    { id: '2', date: new Date(Date.now() - 86400000), status: 'failed', items: 3 },
    { id: '3', date: new Date(Date.now() - 172800000), status: 'success', items: 10 },
  ];
};
