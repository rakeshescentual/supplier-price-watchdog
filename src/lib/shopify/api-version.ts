
/**
 * Shopify API version information
 * Updated based on Shopify's changelog: https://shopify.dev/changelog
 */

import { getShopifyApiVersion, setShopifyApiVersion } from './client';

// Latest stable API version
export const LATEST_API_VERSION = "2024-10";

// Recommended version (usually the latest stable)
export const RECOMMENDED_VERSION = LATEST_API_VERSION;

// Upcoming version (usually the next planned release)
export const UPCOMING_API_VERSION = "2025-01";

// Date when GraphQL-only requirement begins
export const GRAPHQL_ONLY_DATE = new Date("2025-04-01");

// API versions that are GraphQL-only compatible
export const GRAPHQL_ONLY_VERSIONS = ["2024-10", "2024-07", "2024-04", "2025-01"];

// All supported API versions (most recent first)
export const SUPPORTED_VERSIONS = [
  "2024-10", // October 2024 (Latest)
  "2024-07", // July 2024
  "2024-04", // April 2024
  "2024-01", // January 2024
  "2023-10", // October 2023
  "2023-07", // July 2023 (Legacy)
  "2023-04", // April 2023 (Legacy)
];

// Version release information with features
export const API_VERSION_DETAILS = {
  "2024-10": {
    releaseDate: "2024-10-01",
    endOfSupport: "2025-10-01",
    majorChanges: [
      "Enhanced GraphQL support for fulfillment services",
      "Improved bulk operations with progress tracking",
      "New customer segmentation features",
      "Support for additional payment methods"
    ],
    breaking: [
      "Removal of legacy order processing endpoints",
      "Changes to customer metafield structure"
    ],
    graphqlOnly: true
  },
  "2024-07": {
    releaseDate: "2024-07-01",
    endOfSupport: "2025-07-01",
    majorChanges: [
      "Enhanced support for marketplace integrations",
      "Improved B2B capabilities",
      "New checkout extension APIs",
      "Expanded multi-currency support"
    ],
    breaking: [
      "Deprecation of legacy discount APIs",
      "Changes to inventory adjustment API structure"
    ],
    graphqlOnly: true
  },
  "2024-04": {
    releaseDate: "2024-04-02",
    endOfSupport: "2025-04-02",
    majorChanges: [
      "First GraphQL-only API version",
      "Enhanced App Bridge 2.0 integration",
      "Improved multi-location inventory management",
      "New subscription management capabilities"
    ],
    breaking: [
      "Removal of all legacy REST endpoints for public apps",
      "New authentication flow requirements"
    ],
    graphqlOnly: true
  },
  "2024-01": {
    releaseDate: "2024-01-04",
    endOfSupport: "2025-01-04",
    majorChanges: [
      "Last API version with full REST support",
      "Webhook API improvements",
      "Enhanced metafield support",
      "New discount combinations API"
    ],
    breaking: [
      "Changes to product publishing workflow",
      "Revised order editing permissions"
    ],
    graphqlOnly: false
  }
};

/**
 * Checks if a given API version is supported
 */
export const isVersionSupported = (version: string): boolean => {
  return SUPPORTED_VERSIONS.includes(version);
};

/**
 * Checks if a given API version is GraphQL-only
 */
export const isGraphQLOnlyVersion = (version: string): boolean => {
  return GRAPHQL_ONLY_VERSIONS.includes(version);
};

/**
 * Returns information about compatibility status for a given version
 */
export const getVersionCompatibility = (version: string): {
  supported: boolean;
  graphqlOnly: boolean;
  recommended: boolean;
  daysUntilDeprecation?: number;
} => {
  const isSupported = isVersionSupported(version);
  const isGraphQLOnly = isGraphQLOnlyVersion(version);
  
  let daysUntilDeprecation;
  if (isSupported && version in API_VERSION_DETAILS) {
    const endDate = new Date(API_VERSION_DETAILS[version as keyof typeof API_VERSION_DETAILS].endOfSupport);
    const today = new Date();
    daysUntilDeprecation = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  return {
    supported: isSupported,
    graphqlOnly: isGraphQLOnly,
    recommended: version === RECOMMENDED_VERSION,
    daysUntilDeprecation
  };
};

/**
 * Returns the latest GraphQL-only version
 */
export const getLatestGraphQLOnlyVersion = () => {
  return GRAPHQL_ONLY_VERSIONS[0];
};

/**
 * Returns the latest stable version
 */
export const getLatestStable = () => {
  return {
    version: LATEST_API_VERSION,
    details: API_VERSION_DETAILS[LATEST_API_VERSION as keyof typeof API_VERSION_DETAILS]
  };
};

/**
 * Returns days until GraphQL-only requirement
 */
export const getDaysUntilGraphQLOnly = (): number => {
  const today = new Date();
  return Math.max(0, Math.floor((GRAPHQL_ONLY_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
};

/**
 * Gets the recommended API version to use based on compatibility
 */
export const getBestVersion = (): string => {
  return RECOMMENDED_VERSION;
};

/**
 * Returns a status message for a given version
 */
export const getVersionStatusMessage = (version: string): { status: 'current' | 'supported' | 'deprecated' | 'unknown', message: string } => {
  if (version === LATEST_API_VERSION) {
    return { status: 'current', message: 'Current API version' };
  }
  
  if (isVersionSupported(version)) {
    return { status: 'supported', message: 'Supported API version' };
  }
  
  return { status: 'deprecated', message: 'Deprecated API version' };
};

/**
 * Shopify API version manager
 */
export const shopifyApiVersionManager = {
  getCurrent: getShopifyApiVersion,
  setCurrent: setShopifyApiVersion,
  getSupported: () => SUPPORTED_VERSIONS,
  getLatestStable,
  getLatestGraphQLOnly: getLatestGraphQLOnlyVersion,
  isSupported: isVersionSupported,
  isGraphQLOnly: isGraphQLOnlyVersion,
  getCompatibility: getVersionCompatibility,
  getDaysToGraphQLOnly: getDaysUntilGraphQLOnly,
  getBestVersion,
  getVersionStatus: getVersionStatusMessage,
  updateToLatest: () => setShopifyApiVersion(LATEST_API_VERSION),
  updateToVersion: (version: string) => {
    if (isVersionSupported(version)) {
      return setShopifyApiVersion(version);
    }
    return false;
  }
};
