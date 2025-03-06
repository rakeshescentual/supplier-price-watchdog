
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  toastTitle?: string;
  fallbackMessage?: string;
}

const defaultOptions: ErrorOptions = {
  showToast: true,
  logToConsole: true,
  toastTitle: 'Error',
  fallbackMessage: 'An unexpected error occurred'
};

/**
 * Custom hook for standardized error handling across the application
 */
export const useErrorHandler = (defaultOpts?: Partial<ErrorOptions>) => {
  const [lastError, setLastError] = useState<Error | null>(null);
  const [isErrorActive, setIsErrorActive] = useState(false);
  
  const options = { ...defaultOptions, ...defaultOpts };

  const handleError = useCallback((error: unknown, customOptions?: Partial<ErrorOptions>) => {
    const mergedOptions = { ...options, ...customOptions };
    let errorObject: Error;
    
    // Normalize the error to an Error object
    if (error instanceof Error) {
      errorObject = error;
    } else if (typeof error === 'string') {
      errorObject = new Error(error);
    } else {
      errorObject = new Error(mergedOptions.fallbackMessage || 'Unknown error');
    }
    
    // Set the error state
    setLastError(errorObject);
    setIsErrorActive(true);
    
    // Log to console if enabled
    if (mergedOptions.logToConsole) {
      console.error(errorObject);
    }
    
    // Show toast if enabled
    if (mergedOptions.showToast) {
      toast.error(mergedOptions.toastTitle || 'Error', {
        description: errorObject.message,
        duration: 5000,
      });
    }
    
    return errorObject;
  }, [options]);
  
  const clearError = useCallback(() => {
    setLastError(null);
    setIsErrorActive(false);
  }, []);
  
  return {
    handleError,
    clearError,
    lastError,
    isErrorActive
  };
};
