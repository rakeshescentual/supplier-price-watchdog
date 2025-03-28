
/**
 * Shopify API Version Manager
 * Handles API version updates and compatibility
 */

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
  init: () => void; // Add the missing init method
  checkForUpdates: () => Promise<boolean>; // Add checkForUpdates method
}

// API versions data
const API_VERSIONS: ShopifyApiVersion[] = [
  {
    version: '2024-04',
    releaseDate: '2024-04-01',
    supportedUntil: '2025-04-01',
    status: 'current',
    features: [
      'Enhanced Webhook Management',
      'New Metafield Types',
      'Improved Bulk Operations',
      'B2B API Improvements'
    ]
  },
  {
    version: '2024-01',
    releaseDate: '2024-01-01',
    supportedUntil: '2025-01-01',
    status: 'stable',
    features: [
      'Order Editing API',
      'Customer Segmentation',
      'Fulfillment API Updates'
    ]
  },
  {
    version: '2023-10',
    releaseDate: '2023-10-01',
    supportedUntil: '2024-10-01',
    status: 'stable',
    features: [
      'New Graph API Endpoints',
      'Checkout Extensions',
      'Discount Combinations'
    ]
  },
  {
    version: '2023-07',
    releaseDate: '2023-07-01',
    supportedUntil: '2024-07-01',
    status: 'stable',
    features: [
      'Multipass Improvements',
      'B2B API Enhancements',
      'Analytics Data Access'
    ]
  },
  {
    version: '2023-04',
    releaseDate: '2023-04-01',
    supportedUntil: '2024-04-01',
    status: 'deprecated',
    features: [
      'Original Metafields API',
      'Legacy Webhook Registration'
    ]
  }
];

// Cached current version
let currentVersion = localStorage.getItem('shopify_api_version') || '2024-01';

// Initialize the API version manager
export const shopifyApiVersionManager: ShopifyApiVersionManager = {
  // Get current API version
  getCurrent: () => currentVersion,
  
  // Get the latest stable version
  getLatestStable: () => {
    const stableVersions = API_VERSIONS.filter(v => 
      v.status === 'current' || v.status === 'stable'
    );
    return stableVersions[0] || API_VERSIONS[0];
  },
  
  // Get all available versions
  getAllVersions: () => [...API_VERSIONS],
  
  // Update to the latest version
  updateToLatest: () => {
    const latestVersion = shopifyApiVersionManager.getLatestStable().version;
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
    const foundVersion = API_VERSIONS.find(v => v.version === version);
    
    if (!foundVersion) {
      return false;
    }
    
    return foundVersion.status !== 'deprecated';
  },
  
  // Initialize the API version manager
  init: () => {
    const storedVersion = localStorage.getItem('shopify_api_version');
    
    // If no version is stored or the stored version is not supported, set to latest stable
    if (!storedVersion || !shopifyApiVersionManager.isSupported(storedVersion)) {
      const latestStable = shopifyApiVersionManager.getLatestStable().version;
      shopifyApiVersionManager.updateToVersion(latestStable);
      console.log(`Initialized Shopify API version to ${latestStable}`);
    } else {
      currentVersion = storedVersion;
      console.log(`Using Shopify API version ${currentVersion}`);
    }
  },
  
  // Check for updates and notify if newer version is available
  checkForUpdates: async () => {
    const latestStable = shopifyApiVersionManager.getLatestStable().version;
    const needsUpdate = latestStable !== currentVersion;
    
    if (needsUpdate) {
      console.log(`Newer Shopify API version ${latestStable} is available (currently using ${currentVersion})`);
    }
    
    return needsUpdate;
  }
};

// Export default instance
export default shopifyApiVersionManager;
