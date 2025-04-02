
/**
 * Shopify API version utilities
 */

// Latest stable API version
export const LATEST_API_VERSION = '2024-04';

// List of all supported API versions, from newest to oldest
export const SUPPORTED_API_VERSIONS = [
  '2024-04',
  '2024-01',
  '2023-10',
  '2023-07',
  '2023-04',
  '2023-01',
  '2022-10',
  '2022-07',
];

// Versions that are GraphQL-only (no REST API)
export const GRAPHQL_ONLY_VERSIONS = [
  '2024-04',
  '2024-01',
];

// Deprecated versions (will be removed soon)
export const DEPRECATED_VERSIONS = [
  '2022-07',
  '2022-10',
];

// API version details
export interface ApiVersionDetails {
  version: string;
  releaseDate: string;
  sunsetDate: string;
  isGraphQLOnly: boolean;
  isDeprecated: boolean;
  supportedFeatures: string[];
  newFeatures?: string[];
  removedFeatures?: string[];
}

// Detailed information about each API version
export const API_VERSION_DETAILS: Record<string, ApiVersionDetails> = {
  '2024-04': {
    version: '2024-04',
    releaseDate: '2024-04-01',
    sunsetDate: '2025-04-01',
    isGraphQLOnly: true,
    isDeprecated: false,
    supportedFeatures: [
      'Enhanced Metafields',
      'B2B API',
      'Markets API',
      'Content API',
      'Bulk Operations',
      'Shop Configuration',
    ],
    newFeatures: [
      'Enhanced discount strategies',
      'Advanced customer segmentation',
      'Improved product publishing workflow',
    ],
  },
  '2024-01': {
    version: '2024-01',
    releaseDate: '2024-01-01',
    sunsetDate: '2025-01-01',
    isGraphQLOnly: true,
    isDeprecated: false,
    supportedFeatures: [
      'Enhanced Metafields',
      'B2B API',
      'Markets API',
      'Content API',
      'Bulk Operations',
    ],
    newFeatures: [
      'Web Pixel API improvements',
      'Enhanced checkout extensibility',
    ],
  },
  '2023-10': {
    version: '2023-10',
    releaseDate: '2023-10-01',
    sunsetDate: '2024-10-01',
    isGraphQLOnly: false,
    isDeprecated: false,
    supportedFeatures: [
      'Product Media',
      'Metafields',
      'B2B API',
      'Markets API',
      'REST and GraphQL',
    ],
    newFeatures: [
      'Selling Plan Improvements',
      'Enhanced Media Support',
    ],
  },
  '2023-07': {
    version: '2023-07',
    releaseDate: '2023-07-01',
    sunsetDate: '2024-07-01',
    isGraphQLOnly: false,
    isDeprecated: false,
    supportedFeatures: [
      'Product Media',
      'Metafields',
      'B2B API',
      'REST and GraphQL',
    ],
  },
  '2023-04': {
    version: '2023-04',
    releaseDate: '2023-04-01',
    sunsetDate: '2024-04-01',
    isGraphQLOnly: false,
    isDeprecated: false,
    supportedFeatures: [
      'Product Media',
      'Metafields',
      'REST and GraphQL',
    ],
  },
  '2023-01': {
    version: '2023-01',
    releaseDate: '2023-01-01',
    sunsetDate: '2024-01-01',
    isGraphQLOnly: false,
    isDeprecated: false,
    supportedFeatures: [
      'Product Media',
      'Metafields',
      'REST and GraphQL',
    ],
  },
  '2022-10': {
    version: '2022-10',
    releaseDate: '2022-10-01',
    sunsetDate: '2023-10-01',
    isGraphQLOnly: false,
    isDeprecated: true,
    supportedFeatures: [
      'Basic Metafields',
      'REST and GraphQL',
    ],
    removedFeatures: [
      'Legacy Inventory API',
    ],
  },
  '2022-07': {
    version: '2022-07',
    releaseDate: '2022-07-01',
    sunsetDate: '2023-07-01',
    isGraphQLOnly: false,
    isDeprecated: true,
    supportedFeatures: [
      'Basic Metafields',
      'REST and GraphQL',
    ],
    removedFeatures: [
      'Legacy Inventory API',
      'Legacy Discount API',
    ],
  },
};

// Functions for API version management

/**
 * Check if a version is GraphQL-only
 * @param version API version
 * @returns True if GraphQL-only, false otherwise
 */
export const isGraphQLOnlyVersion = (version: string): boolean => {
  return GRAPHQL_ONLY_VERSIONS.includes(version);
};

/**
 * Check if a version is deprecated
 * @param version API version
 * @returns True if deprecated, false otherwise
 */
export const isDeprecatedVersion = (version: string): boolean => {
  return DEPRECATED_VERSIONS.includes(version);
};

/**
 * Get the best API version to use based on requirements
 * @param requireGraphQLOnly Whether GraphQL-only is required
 * @returns The best API version
 */
export const getBestVersion = (requireGraphQLOnly: boolean = false): string => {
  if (requireGraphQLOnly) {
    return GRAPHQL_ONLY_VERSIONS[0] || LATEST_API_VERSION;
  }
  
  return LATEST_API_VERSION;
};

/**
 * Get version details
 * @param version API version
 * @returns Version details
 */
export const getVersionDetails = (version: string): ApiVersionDetails | null => {
  return API_VERSION_DETAILS[version] || null;
};

/**
 * Get a user-friendly status message for a specific API version
 * @param version API version
 * @returns Status message
 */
export const getVersionStatusMessage = (version: string): string => {
  if (isGraphQLOnlyVersion(version)) {
    return `Version ${version} is GraphQL-only and currently supported.`;
  }
  
  if (isDeprecatedVersion(version)) {
    return `Version ${version} is deprecated and will be removed soon. Please upgrade to a newer version.`;
  }
  
  if (version !== LATEST_API_VERSION) {
    return `Version ${version} is supported, but not the latest. Consider upgrading to ${LATEST_API_VERSION}.`;
  }
  
  return `Version ${version} is the latest API version.`;
};

/**
 * Get days until a version becomes GraphQL-only
 * @returns Number of days, or 0 if already GraphQL-only
 */
export const getDaysUntilGraphQLOnly = (): number => {
  const today = new Date();
  const graphqlOnlyDate = new Date('2024-01-01');
  
  if (today >= graphqlOnlyDate) {
    return 0;
  }
  
  const diffTime = graphqlOnlyDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Update to the latest API version
 * @returns True if successful, false otherwise
 */
export const updateToLatestVersion = (): boolean => {
  // Import here to avoid circular dependencies
  const { getShopifyApiVersion, setShopifyApiVersion } = require('./client');
  
  const currentVersion = getShopifyApiVersion();
  
  if (currentVersion === LATEST_API_VERSION) {
    return true;
  }
  
  try {
    return setShopifyApiVersion(LATEST_API_VERSION);
  } catch (error) {
    console.error("Error updating API version:", error);
    return false;
  }
};

/**
 * Compare two API versions
 * @param versionA First version
 * @param versionB Second version
 * @returns -1 if A is older, 0 if equal, 1 if A is newer
 */
export const compareVersions = (versionA: string, versionB: string): number => {
  if (versionA === versionB) {
    return 0;
  }
  
  const indexA = SUPPORTED_API_VERSIONS.indexOf(versionA);
  const indexB = SUPPORTED_API_VERSIONS.indexOf(versionB);
  
  if (indexA === -1 || indexB === -1) {
    return 0;
  }
  
  return indexA < indexB ? 1 : -1;
};

