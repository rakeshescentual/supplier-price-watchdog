
/**
 * Functions for canceling bulk operations
 */
import { shopifyClient } from '../client';
import { ShopifyContext } from '@/types/shopify';

/**
 * Cancel a running bulk operation
 */
export async function cancelBulkOperation(
  context: ShopifyContext,
  operationId: string
): Promise<boolean> {
  try {
    const response = await shopifyClient.graphql(`
      mutation {
        bulkOperationCancel(id: "${operationId}") {
          bulkOperation {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `);
    
    if (response.bulkOperationCancel.userErrors.length > 0) {
      console.error("Error canceling bulk operation:", 
        response.bulkOperationCancel.userErrors.map(e => e.message).join(', '));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error canceling bulk operation:", error);
    return false;
  }
}
