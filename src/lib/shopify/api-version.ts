
/**
 * Shopify API Version Management
 * 
 * This module handles Shopify API version compatibility and updates.
 */

// Supported API versions in order of preference (newest first)
export const SUPPORTED_VERSIONS = ['2024-04', '2024-01', '2023-10', '2023-07'];

// Recommended stable version
export const RECOMMENDED_VERSION = '2024-04';

// Minimum supported version
export const MINIMUM_VERSION = '2023-07';

/**
 * Determines if a given API version is supported
 */
export function isVersionSupported(version: string): boolean {
  return SUPPORTED_VERSIONS.includes(version);
}

/**
 * Checks if a version is deprecated
 */
export function isVersionDeprecated(version: string): boolean {
  return isVersionSupported(version) && 
         SUPPORTED_VERSIONS.indexOf(version) > SUPPORTED_VERSIONS.indexOf(RECOMMENDED_VERSION);
}

/**
 * Gets the most appropriate API version
 * 
 * If the provided version is supported, it will be used.
 * Otherwise, falls back to the recommended version.
 */
export function getBestVersion(version?: string): string {
  if (version && isVersionSupported(version)) {
    return version;
  }
  return RECOMMENDED_VERSION;
}

/**
 * Fetches supported Shopify API versions from the Shopify API
 * (This would normally call the Shopify REST API to get current versions)
 */
export async function fetchShopifyVersions(): Promise<string[]> {
  try {
    // In a real implementation, this would call:
    // GET https://shopify.dev/api/usage/versioning/release-notes.json
    
    // Mock implementation for demo purposes
    return Promise.resolve(SUPPORTED_VERSIONS);
  } catch (error) {
    console.error("Failed to fetch Shopify API versions:", error);
    return SUPPORTED_VERSIONS;
  }
}

/**
 * Checks if the store's current version needs updating
 */
export function needsVersionUpdate(currentVersion: string): boolean {
  if (!isVersionSupported(currentVersion)) {
    return true;
  }
  
  return SUPPORTED_VERSIONS.indexOf(currentVersion) > 0;
}

/**
 * Gets a human-readable message about version status
 */
export function getVersionStatusMessage(version: string): {
  status: 'current' | 'supported' | 'deprecated' | 'unsupported',
  message: string
} {
  if (!isVersionSupported(version)) {
    return {
      status: 'unsupported',
      message: `Version ${version} is not supported. Please update to ${RECOMMENDED_VERSION}.`
    };
  }
  
  if (version === RECOMMENDED_VERSION) {
    return {
      status: 'current',
      message: `You're using the current recommended Shopify API version.`
    };
  }
  
  if (isVersionDeprecated(version)) {
    return {
      status: 'deprecated',
      message: `Version ${version} will be deprecated soon. Consider updating to ${RECOMMENDED_VERSION}.`
    };
  }
  
  return {
    status: 'supported',
    message: `Version ${version} is supported but not the latest. Latest is ${RECOMMENDED_VERSION}.`
  };
}
