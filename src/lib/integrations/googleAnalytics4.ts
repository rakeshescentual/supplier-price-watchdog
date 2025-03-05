
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';

/**
 * Google Analytics 4 (GA4) integration for tracking price changes
 * and other e-commerce events
 */

// GA4 Event types specific to price management
export enum GA4EventType {
  PRICE_INCREASE = 'price_increase',
  PRICE_DECREASE = 'price_decrease',
  PRICE_SYNC = 'price_sync',
  PRODUCT_DISCONTINUED = 'product_discontinued',
  BULK_PRICE_UPDATE = 'bulk_price_update'
}

/**
 * Initialize Google Analytics 4 with enhanced e-commerce tracking
 */
export const initGA4 = (): boolean => {
  try {
    // Check if GA4 is already loaded
    if (typeof window.gtag === 'function') {
      console.log('GA4 already initialized');
      return true;
    }

    console.log('Initializing Google Analytics 4...');
    
    // In a production implementation, this would:
    // 1. Load the GA4 script from Google
    // 2. Initialize with the measurement ID
    // 3. Set up enhanced e-commerce tracking
    
    // For development/demo purposes, we'll create a mock gtag function
    window.gtag = function() {
      console.log('GA4 event:', ...arguments);
    };
    
    // Return success
    return true;
  } catch (error) {
    console.error('Error initializing Google Analytics 4:', error);
    return false;
  }
};

/**
 * Track a price change event in Google Analytics 4
 */
export const trackPriceChange = (
  items: PriceItem[],
  eventType: GA4EventType = GA4EventType.BULK_PRICE_UPDATE
): boolean => {
  try {
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics 4 not initialized');
      return false;
    }
    
    const increasedItems = items.filter(item => item.status === 'increased').length;
    const decreasedItems = items.filter(item => item.status === 'decreased').length;
    const unchangedItems = items.filter(item => item.status === 'unchanged').length;
    
    // Send event to GA4
    window.gtag('event', eventType, {
      event_category: 'price_management',
      event_label: 'bulk_update',
      value: items.length,
      price_increases: increasedItems,
      price_decreases: decreasedItems,
      unchanged_prices: unchangedItems,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Tracked ${eventType} event for ${items.length} items in GA4`);
    return true;
  } catch (error) {
    console.error('Error tracking GA4 event:', error);
    return false;
  }
};

/**
 * Track a product view event in GA4 (for Shopify Plus enhanced e-commerce)
 */
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  brand?: string;
  category?: string;
}): boolean => {
  try {
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics 4 not initialized');
      return false;
    }
    
    // Send product view event to GA4
    window.gtag('event', 'view_item', {
      currency: 'GBP',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_brand: product.brand || '',
        item_category: product.category || ''
      }]
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking product view in GA4:', error);
    return false;
  }
};

/**
 * Track a conversion event when prices are synced to Shopify
 */
export const trackPriceSyncConversion = (
  items: PriceItem[],
  success: boolean
): boolean => {
  try {
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics 4 not initialized');
      return false;
    }
    
    // Send conversion event to GA4
    window.gtag('event', GA4EventType.PRICE_SYNC, {
      event_category: 'price_management',
      event_label: success ? 'success' : 'failure',
      value: items.length,
      conversion: success ? 1 : 0,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking price sync conversion in GA4:', error);
    return false;
  }
};
