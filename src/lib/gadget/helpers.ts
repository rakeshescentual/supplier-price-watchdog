
/**
 * Helper functions for Gadget.dev integration
 */
import { GadgetConfig } from '@/types/price';
import { getGadgetConfig, getGadgetApiUrl, createGadgetHeaders } from '@/utils/gadget-helpers';
import { logInfo, logError } from './logging';

/**
 * Check if a feature flag is enabled in the Gadget configuration
 * @param flagName Name of the feature flag to check
 * @param defaultValue Default value if flag is not specified
 * @returns Whether the feature flag is enabled
 */
export const isFeatureEnabled = (
  flagName: string,
  defaultValue: boolean = false
): boolean => {
  const config = getGadgetConfig();
  if (!config || !config.featureFlags) {
    return defaultValue;
  }
  
  return config.featureFlags[flagName as keyof typeof config.featureFlags] ?? defaultValue;
};

/**
 * Format error message for user display
 * @param error Error object or string
 * @param fallbackMessage Fallback message if error is undefined
 * @returns User-friendly error message
 */
export const formatErrorMessage = (
  error: unknown,
  fallbackMessage: string = "An unknown error occurred"
): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return fallbackMessage;
};

/**
 * Create a properly formatted API request to Gadget
 * @param endpoint API endpoint path
 * @param method HTTP method
 * @param body Request body
 * @returns Promise resolving to response data
 */
export const gadgetApiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: object
): Promise<T> => {
  const config = getGadgetConfig();
  if (!config) {
    throw new Error("Gadget configuration required");
  }
  
  const url = `${getGadgetApiUrl(config)}${endpoint}`;
  
  try {
    logInfo(`Making ${method} request to Gadget: ${endpoint}`, {}, 'api');
    
    const response = await fetch(url, {
      method,
      headers: createGadgetHeaders(config),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    logError(`Error in Gadget API request to ${endpoint}`, { error }, 'api');
    throw error;
  }
};

/**
 * Get API version info from Gadget
 * @returns Promise resolving to version information
 */
export const getGadgetApiVersion = async (): Promise<{
  version: string;
  environment: string;
  apiVersion: string;
}> => {
  // In production: fetch real version info
  // return await gadgetApiRequest<{ version: string; environment: string; apiVersion: string }>('version');
  
  // For development: return mock data
  return {
    version: '1.0.0',
    environment: getGadgetConfig()?.environment || 'development',
    apiVersion: 'v1'
  };
};

/**
 * Convert a Gadget error to a user-friendly message
 * @param error Error from Gadget API
 * @returns User-friendly error message
 */
export const gadgetErrorToMessage = (error: any): string => {
  // If error is from Gadget API, it may have a specific structure
  if (error && typeof error === 'object') {
    if (error.code === 'RATE_LIMITED') {
      return 'Rate limit exceeded. Please try again later.';
    } else if (error.code === 'UNAUTHORIZED') {
      return 'Authentication failed. Please check your API key.';
    } else if (error.code === 'VALIDATION_ERROR') {
      return `Validation error: ${error.details || 'Invalid data provided'}`;
    } else if (error.message) {
      return error.message;
    }
  }
  
  return formatErrorMessage(error);
};

/**
 * Format a date string for Gadget API requests
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatGadgetDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Get environment-specific configuration for Gadget
 * @returns Environment-specific configuration
 */
export const getEnvironmentConfig = (): {
  apiUrl: string;
  maxBatchSize: number;
  enableDetailedLogs: boolean;
} => {
  const config = getGadgetConfig();
  const isDevelopment = config?.environment === 'development';
  
  return {
    apiUrl: getGadgetApiUrl(config || { appId: '', apiKey: '', environment: 'development' }),
    maxBatchSize: isDevelopment ? 10 : 50,
    enableDetailedLogs: isDevelopment
  };
};
