
import { PriceItem as PriceFromPriceTs } from "@/types/price";
import { PriceItem as PriceFromShopifyTs } from "@/types/shopify";

/**
 * Adapter function to convert PriceItem from price.ts to PriceItem from shopify.ts
 */
export const adaptPriceItems = (items: PriceFromPriceTs[]): PriceFromShopifyTs[] => {
  return items.map(item => ({
    id: item.id || item.sku, // Ensure id exists
    sku: item.sku,
    name: item.name,
    oldPrice: item.oldPrice,
    newPrice: item.newPrice,
    status: item.status,
    percentChange: item.percentChange || ((item.newPrice - item.oldPrice) / item.oldPrice) * 100,
    shopifyProductId: item.shopifyProductId || item.productId,
    shopifyVariantId: item.shopifyVariantId || item.variantId,
    // Copy any other required properties
    category: item.category,
    supplier: item.vendor,
    lastUpdated: new Date(),
    notes: item.suggestionReason,
    difference: item.difference,
    isMatched: item.isMatched
  }));
};

/**
 * Adapter function to convert a single PriceItem
 */
export const adaptPriceItem = (item: PriceFromPriceTs): PriceFromShopifyTs => {
  return {
    id: item.id || item.sku,
    sku: item.sku,
    name: item.name,
    oldPrice: item.oldPrice,
    newPrice: item.newPrice,
    status: item.status,
    percentChange: item.percentChange || ((item.newPrice - item.oldPrice) / item.oldPrice) * 100,
    shopifyProductId: item.shopifyProductId || item.productId,
    shopifyVariantId: item.shopifyVariantId || item.variantId,
    category: item.category,
    supplier: item.vendor,
    lastUpdated: new Date(),
    notes: item.suggestionReason,
    difference: item.difference,
    isMatched: item.isMatched
  };
};
