
/**
 * Shopify API Version Manager
 * Handles API version updates and compatibility
 */
import { 
  LATEST_API_VERSION, 
  SUPPORTED_API_VERSIONS, 
  isGraphQLOnlyVersion,
  API_VERSION_DETAILS,
  isDeprecatedVersion,
  getVersionStatusMessage
} from './api-version';

export interface ShopifyApiVersion {
  version: string;
  releaseDate: string;
  supportedUntil: string;
  status: 'current' | 'stable' | 'release-candidate' | 'deprecated';
  features?: string[];
}

interface ShopifyApiVersionManager {
  getCurrent: () => string;
  getLatestStable: () => ShopifyApiVersion;
  getAllVersions: () => ShopifyApiVersion[];
  updateToLatest: () => string;
  updateToVersion: (version: string) => boolean;
  isSupported: (version: string) => boolean;
  init: () => void;
  checkForUpdates: () => Promise<boolean>;
}

// Convert API version details to ShopifyApiVersion format
const convertApiVersionDetails = (version: string): ShopifyApiVersion => {
  const details = API_VERSION_DETAILS[version];
  if (!details) {
    return {
      version,
      releaseDate: 'Unknown',
      supportedUntil: 'Unknown',
      status: isDeprecatedVersion(version) ? 'deprecated' : 'stable'
    };
  }
  
  return {
    version: details.version,
    releaseDate: details.releaseDate,
    supportedUntil: details.sunsetDate,
    status: details.isDeprecated ? 'deprecated' : 
           (details.version === LATEST_API_VERSION ? 'current' : 'stable'),
    features: [...(details.supportedFeatures || []), ...(details.newFeatures || [])]
  };
};

// Cached current version
let currentVersion = localStorage.getItem('shopify_api_version') || LATEST_API_VERSION;

// Initialize the API version manager
export const shopifyApiVersionManager: ShopifyApiVersionManager = {
  // Get current API version
  getCurrent: () => currentVersion,
  
  // Get the latest stable version
  getLatestStable: () => convertApiVersionDetails(LATEST_API_VERSION),
  
  // Get all available versions
  getAllVersions: () => SUPPORTED_API_VERSIONS.map(convertApiVersionDetails),
  
  // Update to the latest version
  updateToLatest: () => {
    const latestVersion = LATEST_API_VERSION;
    shopifyApiVersionManager.updateToVersion(latestVersion);
    return latestVersion;
  },
  
  // Update to a specific version
  updateToVersion: (version: string) => {
    // Verify version exists and is supported
    if (!shopifyApiVersionManager.isSupported(version)) {
      console.error(`API version ${version} is not supported`);
      return false;
    }
    
    // Update current version
    currentVersion = version;
    localStorage.setItem('shopify_api_version', version);
    
    console.log(`Updated Shopify API version to ${version}`);
    return true;
  },
  
  // Check if a version is supported
  isSupported: (version: string) => {
    return SUPPORTED_API_VERSIONS.includes(version) && !isDeprecatedVersion(version);
  },
  
  // Initialize the API version manager
  init: () => {
    const storedVersion = localStorage.getItem('shopify_api_version');
    
    // If no version is stored or the stored version is not supported, set to latest stable
    if (!storedVersion || !shopifyApiVersionManager.isSupported(storedVersion)) {
      const latestStable = LATEST_API_VERSION;
      shopifyApiVersionManager.updateToVersion(latestStable);
      console.log(`Initialized Shopify API version to ${latestStable}`);
    } else {
      currentVersion = storedVersion;
      console.log(`Using Shopify API version ${currentVersion}`);
    }
  },
  
  // Check for updates and notify if newer version is available
  checkForUpdates: async () => {
    const latestStable = LATEST_API_VERSION;
    const needsUpdate = latestStable !== currentVersion;
    
    if (needsUpdate) {
      console.log(`Newer Shopify API version ${latestStable} is available (currently using ${currentVersion})`);
    }
    
    return needsUpdate;
  }
};

// Export default instance
export default shopifyApiVersionManager;
