
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
  BULK_PRICE_UPDATE = 'bulk_price_update',
  KLAVIYO_SEGMENT = 'klaviyo_segment_created',
  CUSTOMER_NOTIFICATION = 'customer_notification_sent',
  TEST_EVENT = 'test_event'
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
    const discontinuedItems = items.filter(item => item.status === 'discontinued').length;
    
    // Send event to GA4
    window.gtag('event', eventType, {
      event_category: 'price_management',
      event_label: 'bulk_update',
      value: items.length,
      price_increases: increasedItems,
      price_decreases: decreasedItems,
      unchanged_prices: unchangedItems,
      discontinued_items: discontinuedItems,
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

/**
 * Track Klaviyo segment creation in Google Analytics 4
 */
export const trackKlaviyoSegmentCreation = (
  segmentData: {
    segmentName: string;
    segmentType: string;
    productCount: number;
    effectiveDate?: Date;
  }
): boolean => {
  try {
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics 4 not initialized');
      return false;
    }
    
    // Send Klaviyo segment event to GA4
    window.gtag('event', GA4EventType.KLAVIYO_SEGMENT, {
      event_category: 'klaviyo_integration',
      event_label: segmentData.segmentType,
      segment_name: segmentData.segmentName,
      product_count: segmentData.productCount,
      effective_date: segmentData.effectiveDate?.toISOString() || '',
      timestamp: new Date().toISOString()
    });
    
    console.log(`Tracked Klaviyo segment creation in GA4: ${segmentData.segmentName}`);
    return true;
  } catch (error) {
    console.error('Error tracking Klaviyo segment in GA4:', error);
    return false;
  }
};

/**
 * Track customer notification events in Google Analytics 4
 */
export const trackCustomerNotification = (
  notificationData: {
    channelType: string;
    notificationType: string;
    customerCount: number;
    productCount: number;
  }
): boolean => {
  try {
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics 4 not initialized');
      return false;
    }
    
    // Send customer notification event to GA4
    window.gtag('event', GA4EventType.CUSTOMER_NOTIFICATION, {
      event_category: 'customer_communication',
      event_label: notificationData.notificationType,
      channel: notificationData.channelType,
      customer_count: notificationData.customerCount,
      product_count: notificationData.productCount,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Tracked customer notification in GA4: ${notificationData.channelType} - ${notificationData.notificationType}`);
    return true;
  } catch (error) {
    console.error('Error tracking customer notification in GA4:', error);
    return false;
  }
};

/**
 * Track a discontinued product notification in Google Analytics 4
 */
export const trackDiscontinuedProductNotification = (
  items: PriceItem[],
  channelType: string = 'email'
): boolean => {
  try {
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics 4 not initialized');
      return false;
    }
    
    const discontinuedItems = items.filter(item => item.status === 'discontinued');
    
    if (discontinuedItems.length === 0) {
      console.warn('No discontinued items to track');
      return false;
    }
    
    // Send discontinued product notification event to GA4
    window.gtag('event', GA4EventType.PRODUCT_DISCONTINUED, {
      event_category: 'customer_communication',
      event_label: 'discontinued_notification',
      channel: channelType,
      product_count: discontinuedItems.length,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Tracked discontinued product notification in GA4 for ${discontinuedItems.length} items`);
    return true;
  } catch (error) {
    console.error('Error tracking discontinued product notification in GA4:', error);
    return false;
  }
};
