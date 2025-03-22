
/**
 * Shopify API Version Management
 * This utility helps manage Shopify API versions and ensures the app stays compatible
 * with Shopify's API versioning schedule.
 */

import { toast } from 'sonner';
import { gadgetAnalytics } from '@/lib/gadget/analytics';

// Shopify releases new API versions quarterly
type ApiReleaseQuarter = 'January' | 'April' | 'July' | 'October';

interface ApiVersion {
  version: string;
  releaseDate: Date;
  supportedUntil: Date;
  isStable: boolean;
  isReleaseCandidate: boolean;
  status: 'current' | 'supported' | 'deprecated' | 'unsupported';
}

// Current and upcoming API versions (should be updated regularly)
const SHOPIFY_API_VERSIONS: ApiVersion[] = [
  {
    version: '2024-01',
    releaseDate: new Date('2024-01-01'),
    supportedUntil: new Date('2025-01-31'),
    isStable: true,
    isReleaseCandidate: false,
    status: 'current'
  },
  {
    version: '2023-10',
    releaseDate: new Date('2023-10-01'),
    supportedUntil: new Date('2024-10-31'),
    isStable: true,
    isReleaseCandidate: false,
    status: 'supported'
  },
  {
    version: '2023-07',
    releaseDate: new Date('2023-07-01'),
    supportedUntil: new Date('2024-07-31'),
    isStable: true,
    isReleaseCandidate: false,
    status: 'supported'
  },
  {
    version: '2023-04',
    releaseDate: new Date('2023-04-01'),
    supportedUntil: new Date('2024-04-30'),
    isStable: true,
    isReleaseCandidate: false,
    status: 'deprecated'
  }
];

// Default configuration
let currentApiVersion = '2024-01';
let autoUpdate = true;

/**
 * Initialize the API version manager
 */
export const initApiVersionManager = (
  initialVersion?: string,
  options?: { autoUpdate?: boolean }
): string => {
  // If provided, use the initial version
  if (initialVersion) {
    const validVersion = validateApiVersion(initialVersion);
    if (validVersion) {
      currentApiVersion = validVersion.version;
    } else {
      console.warn(`Invalid API version: ${initialVersion}. Using latest stable version.`);
      currentApiVersion = getLatestStableVersion().version;
    }
  } else {
    // Default to latest stable version
    currentApiVersion = getLatestStableVersion().version;
  }
  
  // Set auto-update preference
  if (options?.autoUpdate !== undefined) {
    autoUpdate = options.autoUpdate;
  }
  
  // Check for upcoming version deprecations
  checkVersionDeprecation();
  
  return currentApiVersion;
};

/**
 * Get the current API version
 */
export const getCurrentApiVersion = (): string => currentApiVersion;

/**
 * Get all available API versions
 */
export const getAllApiVersions = (): ApiVersion[] => SHOPIFY_API_VERSIONS;

/**
 * Get the latest stable version
 */
export const getLatestStableVersion = (): ApiVersion => {
  const stableVersions = SHOPIFY_API_VERSIONS.filter(v => v.isStable && !v.isReleaseCandidate);
  return stableVersions.sort((a, b) => 
    b.releaseDate.getTime() - a.releaseDate.getTime()
  )[0];
};

/**
 * Update to the latest stable API version
 */
export const updateToLatestVersion = (): string => {
  const latestVersion = getLatestStableVersion();
  
  if (latestVersion.version !== currentApiVersion) {
    const oldVersion = currentApiVersion;
    currentApiVersion = latestVersion.version;
    
    console.log(`Updated Shopify API version from ${oldVersion} to ${currentApiVersion}`);
    
    // Track version update
    gadgetAnalytics.trackBusinessMetric('shopify_api_version_update', 1, {
      oldVersion,
      newVersion: currentApiVersion
    });
    
    // Notify user
    toast.success('Shopify API Version Updated', {
      description: `Updated to the latest version (${currentApiVersion})`
    });
  }
  
  return currentApiVersion;
};

/**
 * Manually set the API version
 */
export const setApiVersion = (version: string): boolean => {
  const validVersion = validateApiVersion(version);
  
  if (!validVersion) {
    console.error(`Invalid API version: ${version}`);
    return false;
  }
  
  if (validVersion.status === 'unsupported') {
    console.warn(`Warning: Setting to unsupported API version: ${version}`);
    toast.warning('Unsupported API Version', {
      description: 'The selected API version is no longer supported by Shopify.'
    });
  }
  
  currentApiVersion = validVersion.version;
  return true;
};

/**
 * Check if a version is valid
 */
export const validateApiVersion = (version: string): ApiVersion | null => {
  return SHOPIFY_API_VERSIONS.find(v => v.version === version) || null;
};

/**
 * Check for upcoming API version deprecations
 */
export const checkVersionDeprecation = (): void => {
  const currentVersion = SHOPIFY_API_VERSIONS.find(v => v.version === currentApiVersion);
  
  if (!currentVersion) {
    return;
  }
  
  const now = new Date();
  const daysUntilDeprecation = Math.floor(
    (currentVersion.supportedUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Warn if within 60 days of deprecation
  if (daysUntilDeprecation <= 60 && daysUntilDeprecation > 0) {
    console.warn(`Shopify API version ${currentApiVersion} will be unsupported in ${daysUntilDeprecation} days.`);
    
    if (daysUntilDeprecation <= 30) {
      toast.warning('API Version Expiring Soon', {
        description: `Shopify API version ${currentApiVersion} will be unsupported in ${daysUntilDeprecation} days.`,
        duration: 10000
      });
      
      if (autoUpdate) {
        updateToLatestVersion();
      }
    }
  }
  
  // If already deprecated, force update if auto-update is enabled
  if (currentVersion.status === 'deprecated' || currentVersion.status === 'unsupported') {
    console.error(`Shopify API version ${currentApiVersion} is ${currentVersion.status}!`);
    
    toast.error('Outdated API Version', {
      description: `The current Shopify API version (${currentApiVersion}) is ${currentVersion.status}.`,
      duration: 10000
    });
    
    if (autoUpdate) {
      updateToLatestVersion();
    }
  }
};

/**
 * Calculate the next API version release
 */
export const getNextApiVersionRelease = (): { quarter: ApiReleaseQuarter; year: number } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  let nextQuarter: ApiReleaseQuarter;
  let year = currentYear;
  
  if (currentMonth < 4) {
    nextQuarter = 'April';
  } else if (currentMonth < 7) {
    nextQuarter = 'July';
  } else if (currentMonth < 10) {
    nextQuarter = 'October';
  } else {
    nextQuarter = 'January';
    year = currentYear + 1;
  }
  
  return { quarter: nextQuarter, year };
};

// Export a unified version manager
export const shopifyApiVersionManager = {
  init: initApiVersionManager,
  getCurrent: getCurrentApiVersion,
  getAll: getAllApiVersions,
  getLatestStable: getLatestStableVersion,
  updateToLatest: updateToLatestVersion,
  setVersion: setApiVersion,
  validate: validateApiVersion,
  checkDeprecation: checkVersionDeprecation,
  getNextRelease: getNextApiVersionRelease
};

export default shopifyApiVersionManager;
