
/**
 * Helper functions for managing connection and config data
 */

/**
 * Safely load connection context from local storage
 */
export function loadConnectionContext<T>(
  key: string,
  onError?: (error: unknown) => void
): T | null {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    onError?.(error);
    return null;
  }
}

/**
 * Save connection context to local storage
 */
export function saveConnectionContext<T>(
  key: string,
  data: T,
  onSuccess?: () => void,
  onError?: (error: unknown) => void
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    onSuccess?.();
    return true;
  } catch (error) {
    onError?.(error);
    return false;
  }
}

/**
 * Format a timestamp as a relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
