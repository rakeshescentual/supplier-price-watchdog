
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

/**
 * Format a date relative to now (e.g., "5 minutes ago")
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to seconds
  const diffSecs = Math.floor(diffMs / 1000);
  
  if (diffSecs < 60) {
    return 'Just now';
  }
  
  // Convert to minutes
  const diffMins = Math.floor(diffSecs / 60);
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
  
  // Convert to hours
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  
  // Convert to days
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  // Convert to months
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }
  
  // Convert to years
  const diffYears = Math.floor(diffMonths / 12);
  
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}
