
/**
 * Functions for bulk price updates
 */
import { shopifyClient } from '../client';
import { ShopifyContext, PriceItem } from '@/types/shopify';
import { BulkOperationResult, BulkPriceUpdateOptions } from './types';
import { saveToOperationHistory } from './history';

/**
 * Bulk update product prices
 */
export async function bulkUpdatePrices(
  context: ShopifyContext,
  items: PriceItem[],
  options: BulkPriceUpdateOptions = {}
): Promise<BulkOperationResult> {
  try {
    console.log(`Starting bulk price update for ${items.length} items`);
    
    // Create mutation for each item
    const mutations = items.map(item => {
      return `
        productVariantUpdate(input: {
          id: "${item.variantId}",
          price: "${item.price.toFixed(2)}"
        }) {
          productVariant {
            id
            price
          }
          userErrors {
            field
            message
          }
        }
      `;
    });
    
    // Split mutations into chunks to avoid hitting GraphQL complexity limits
    const chunkSize = 50;
    const chunks = [];
    for (let i = 0; i < mutations.length; i += chunkSize) {
      chunks.push(mutations.slice(i, i + chunkSize));
    }
    
    // Mock bulk operation id
    const operationId = `bulkop_${Date.now()}`;
    
    let updatedCount = 0;
    let failedCount = 0;
    
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkMutation = `
        mutation {
          ${chunk.join('\n')}
        }
      `;
      
      // If this is a dry run, log but don't execute
      if (options.dryRun) {
        console.log('Dry run mutation:', chunkMutation);
        continue;
      }
      
      try {
        const response = await shopifyClient.graphql(chunkMutation);
        
        // Process results
        for (const key in response) {
          if (key.startsWith('productVariantUpdate')) {
            if (response[key].userErrors && response[key].userErrors.length > 0) {
              failedCount++;
            } else {
              updatedCount++;
            }
          }
        }
        
        // Report progress
        if (options.onProgress) {
          const progress = Math.round(((i + 1) / chunks.length) * 100);
          options.onProgress(progress);
        }
      } catch (error) {
        console.error(`Error processing chunk ${i}:`, error);
        failedCount += chunk.length;
      }
    }
    
    // Save operation to history
    saveToOperationHistory({
      id: operationId,
      type: 'priceUpdate',
      status: failedCount === 0 ? 'COMPLETED' : 'COMPLETED',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      itemCount: items.length,
      errorMessage: failedCount > 0 ? `Failed to update ${failedCount} items` : undefined
    });
    
    return {
      success: failedCount === 0,
      message: `Updated ${updatedCount} prices${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
      operationId,
      updatedCount,
      failedCount
    };
  } catch (error) {
    console.error("Bulk price update error:", error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error during bulk price update",
      updatedCount: 0,
      failedCount: items.length
    };
  }
}
