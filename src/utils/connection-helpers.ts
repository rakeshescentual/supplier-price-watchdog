
/**
 * Helper utilities for managing connection configurations
 */

/**
 * Load connection context from localStorage
 */
export function loadConnectionContext<T>(
  key: string,
  onError?: (error: Error) => void
): T | null {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) {
      return null;
    }
    
    return JSON.parse(storedData) as T;
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    return null;
  }
}

/**
 * Save connection context to localStorage
 */
export function saveConnectionContext<T>(
  key: string,
  data: T,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (onSuccess) {
      onSuccess();
    }
    return true;
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    return false;
  }
}
