
/**
 * Debug utilities for MCP development
 */
import { toast } from 'sonner';
import { executeMcpQuery, generateMcpTestUrl } from '../mcp';

/**
 * Validate a GraphQL query syntax
 * @param query GraphQL query to validate
 * @returns Validation result
 */
export const validateQuerySyntax = async (
  query: string
): Promise<{ valid: boolean; errors?: string[] }> => {
  try {
    // Use GraphQL schema introspection to validate
    const validationQuery = `
      query {
        __type(name: "__Schema") {
          name
        }
      }
    `;
    
    // If we can execute this simple query, the connection works
    await executeMcpQuery(validationQuery);
    
    // For actual validation, we'd need to parse the query with a GraphQL library
    // This is a simple check that looks for common errors
    const errors: string[] = [];
    
    if (!query.trim()) {
      errors.push('Query is empty');
      return { valid: false, errors };
    }
    
    // Check for mismatched braces
    const openBraces = (query.match(/{/g) || []).length;
    const closeBraces = (query.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Mismatched braces: ${openBraces} opening vs ${closeBraces} closing`);
    }
    
    // Check for missing operation type
    if (!query.trim().match(/^(query|mutation|subscription)\s/i) && !query.trim().startsWith('{')) {
      errors.push('Missing operation type (query, mutation, or subscription)');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Query validation error:', error);
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
};

/**
 * Debug a GraphQL query with explained steps
 * @param query GraphQL query to debug
 * @param variables Variables to pass to the query
 */
export const debugQuery = async (
  query: string,
  variables?: Record<string, any>
): Promise<void> => {
  toast.info('Starting query debug', {
    description: 'Analyzing query structure and execution...'
  });
  
  try {
    // Step 1: Validate syntax
    const validation = await validateQuerySyntax(query);
    if (!validation.valid) {
      toast.error('Query syntax error', {
        description: validation.errors?.join('. ')
      });
      return;
    }
    
    // Step 2: Prepare for execution
    console.group('GraphQL Query Debug');
    console.log('Query:', query);
    if (variables) {
      console.log('Variables:', variables);
    }
    
    // Step 3: Generate test URL
    const testUrl = generateMcpTestUrl(query, variables);
    console.log('Test URL:', testUrl);
    
    // Step 4: Execute query
    console.time('Query execution time');
    const result = await executeMcpQuery(query, variables);
    console.timeEnd('Query execution time');
    
    // Step 5: Log results
    console.log('Result:', result);
    console.groupEnd();
    
    toast.success('Query executed successfully', {
      description: 'See console for detailed results'
    });
  } catch (error) {
    console.error('Query debug error:', error);
    toast.error('Query execution failed', {
      description: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Explain a GraphQL query structure
 * @param query GraphQL query to explain
 */
export const explainQuery = (query: string): string => {
  // This is a simple implementation, a production version would use a proper GraphQL parser
  const lines = query.trim().split('\n');
  const explanation: string[] = [];
  
  let depth = 0;
  let inComment = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Handle comments
    if (trimmedLine.startsWith('#')) {
      explanation.push(`Comment: ${trimmedLine.substring(1).trim()}`);
      continue;
    }
    
    // Check for operation type
    if (trimmedLine.match(/^(query|mutation|subscription)/i)) {
      const match = trimmedLine.match(/^(query|mutation|subscription)\s*(\w+)?/i);
      if (match) {
        const [, operationType, operationName] = match;
        explanation.push(`Operation: ${operationType}${operationName ? ` named "${operationName}"` : ''}`);
      }
    }
    
    // Check for fields
    if (trimmedLine.includes(':')) {
      const [fieldName, fieldType] = trimmedLine.split(':').map(part => part.trim());
      explanation.push(`Field: "${fieldName}" of type ${fieldType.replace(/[!,{}]/, '')}`);
    }
    
    // Track nesting depth
    depth += (trimmedLine.match(/{/g) || []).length;
    depth -= (trimmedLine.match(/}/g) || []).length;
  }
  
  return explanation.join('\n');
};

/**
 * Optimize a GraphQL query by removing redundant whitespace
 * @param query GraphQL query to optimize
 * @returns Optimized query
 */
export const optimizeQuery = (query: string): string => {
  return query
    .replace(/\s+/g, ' ')         // Replace multiple whitespace with single space
    .replace(/\s*{\s*/g, ' { ')   // Normalize spaces around opening braces
    .replace(/\s*}\s*/g, ' } ')   // Normalize spaces around closing braces
    .replace(/\s*:\s*/g, ': ')    // Normalize spaces around colons
    .replace(/\s*,\s*/g, ', ')    // Normalize spaces around commas
    .replace(/\s*\(\s*/g, '(')    // Remove spaces after opening parentheses
    .replace(/\s*\)\s*/g, ') ')   // Normalize spaces around closing parentheses
    .trim();
};
