
/**
 * Shopify API Version Manager
 * 
 * This utility helps manage Shopify API version transitions and updates.
 * Shopify releases new API versions quarterly and deprecates older versions after 12 months.
 */

import { toast } from "sonner";

interface ApiVersion {
  version: string;
  releaseDate: string;
  deprecationDate: string;
  status: 'stable' | 'release_candidate' | 'deprecated';
}

// Current and upcoming API versions
// Shopify updates these quarterly
const SHOPIFY_API_VERSIONS: ApiVersion[] = [
  {
    version: '2024-04',
    releaseDate: '2024-04-01',
    deprecationDate: '2025-04-01',
    status: 'stable'
  },
  {
    version: '2024-01',
    releaseDate: '2024-01-01',
    deprecationDate: '2025-01-01',
    status: 'stable'
  },
  {
    version: '2023-10',
    releaseDate: '2023-10-01',
    deprecationDate: '2024-10-01',
    status: 'stable'
  },
  {
    version: '2023-07',
    releaseDate: '2023-07-01',
    deprecationDate: '2024-07-01',
    status: 'stable'
  },
  {
    version: '2023-04',
    releaseDate: '2023-04-01',
    deprecationDate: '2024-04-01',
    status: 'deprecated'
  }
];

// Default to latest stable version
const DEFAULT_API_VERSION = '2024-04';

class ShopifyApiVersionManager {
  private currentVersion: string;
  private localStorage: Storage;

  constructor() {
    this.localStorage = typeof window !== 'undefined' ? window.localStorage : null as any;
    this.currentVersion = this.getSavedVersion() || DEFAULT_API_VERSION;
  }

  private getSavedVersion(): string | null {
    if (!this.localStorage) return null;
    return this.localStorage.getItem('shopify_api_version');
  }

  private saveVersion(version: string): void {
    if (!this.localStorage) return;
    this.localStorage.setItem('shopify_api_version', version);
    this.currentVersion = version;
  }

  /**
   * Get current API version
   */
  public getCurrent(): string {
    return this.currentVersion;
  }

  /**
   * Get all available API versions
   */
  public getAllVersions(): ApiVersion[] {
    return [...SHOPIFY_API_VERSIONS];
  }

  /**
   * Get latest stable API version
   */
  public getLatestStable(): ApiVersion {
    return SHOPIFY_API_VERSIONS.find(v => v.status === 'stable') || SHOPIFY_API_VERSIONS[0];
  }

  /**
   * Update to specific API version
   */
  public updateToVersion(version: string): boolean {
    const versionExists = SHOPIFY_API_VERSIONS.some(v => v.version === version);
    if (!versionExists) {
      console.error(`API version ${version} does not exist`);
      return false;
    }

    this.saveVersion(version);
    return true;
  }

  /**
   * Update to latest stable API version
   */
  public updateToLatest(): boolean {
    const latestVersion = this.getLatestStable().version;
    return this.updateToVersion(latestVersion);
  }

  /**
   * Check if current version is deprecated
   */
  public isCurrentVersionDeprecated(): boolean {
    const currentVersionInfo = SHOPIFY_API_VERSIONS.find(v => v.version === this.currentVersion);
    return currentVersionInfo?.status === 'deprecated';
  }

  /**
   * Check if current version needs updating
   */
  public needsUpdate(): boolean {
    return this.currentVersion !== this.getLatestStable().version;
  }

  /**
   * Get months until current version is deprecated
   */
  public monthsUntilDeprecation(): number {
    const currentVersionInfo = SHOPIFY_API_VERSIONS.find(v => v.version === this.currentVersion);
    if (!currentVersionInfo) return 0;

    const deprecationDate = new Date(currentVersionInfo.deprecationDate);
    const today = new Date();
    const monthsDiff = (deprecationDate.getFullYear() - today.getFullYear()) * 12 + 
                       (deprecationDate.getMonth() - today.getMonth());
    
    return Math.max(0, monthsDiff);
  }
}

// Export singleton instance
export const shopifyApiVersionManager = new ShopifyApiVersionManager();

/**
 * Start monitoring for deprecated API versions
 * @param checkIntervalDays How often to check (in days)
 * @returns Function to stop monitoring
 */
export const startApiVersionMonitoring = (checkIntervalDays: number = 7): (() => void) => {
  // Check immediately
  checkApiVersion();
  
  // Set up interval
  const intervalId = setInterval(checkApiVersion, checkIntervalDays * 24 * 60 * 60 * 1000);
  
  return () => clearInterval(intervalId);
};

/**
 * Check if API version needs updating
 */
export const checkApiVersion = (): boolean => {
  const manager = shopifyApiVersionManager;
  
  if (manager.isCurrentVersionDeprecated()) {
    toast.warning("Shopify API version deprecated", {
      description: "The current Shopify API version is deprecated. Please update to the latest version.",
      action: {
        label: "Update",
        onClick: () => {
          if (manager.updateToLatest()) {
            toast.success("API version updated", {
              description: `Updated to Shopify API version ${manager.getCurrent()}`
            });
            return true;
          }
          return false;
        }
      }
    });
    return true;
  }
  
  if (manager.needsUpdate() && manager.monthsUntilDeprecation() <= 3) {
    toast.info("Shopify API version update available", {
      description: "A new Shopify API version is available. Consider updating soon.",
      action: {
        label: "Update",
        onClick: () => {
          if (manager.updateToLatest()) {
            toast.success("API version updated", {
              description: `Updated to Shopify API version ${manager.getCurrent()}`
            });
            return true;
          }
          return false;
        }
      }
    });
    return true;
  }
  
  return false;
};
