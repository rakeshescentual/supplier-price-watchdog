
/**
 * Shopify API Version Manager
 * 
 * This module helps keep the app up-to-date with the latest Shopify API versions.
 * Shopify releases new API versions quarterly, and it's important to stay current.
 */

import { toast } from 'sonner';
import { gadgetAnalytics } from '../gadget/analytics';

// Types for API version management
interface ShopifyApiVersion {
  version: string;
  status: 'stable' | 'release-candidate' | 'unstable';
  releaseDate: Date;
  supportEndDate: Date;
}

// Current known Shopify API versions (would be kept up-to-date in production)
const SHOPIFY_API_VERSIONS: ShopifyApiVersion[] = [
  {
    version: '2022-10',
    status: 'stable',
    releaseDate: new Date('2022-10-01'),
    supportEndDate: new Date('2023-10-01')
  },
  {
    version: '2023-01',
    status: 'stable',
    releaseDate: new Date('2023-01-01'),
    supportEndDate: new Date('2024-01-01')
  },
  {
    version: '2023-04',
    status: 'stable',
    releaseDate: new Date('2023-04-01'),
    supportEndDate: new Date('2024-04-01')
  },
  {
    version: '2023-07',
    status: 'stable',
    releaseDate: new Date('2023-07-01'),
    supportEndDate: new Date('2024-07-01')
  },
  {
    version: '2023-10',
    status: 'stable',
    releaseDate: new Date('2023-10-01'),
    supportEndDate: new Date('2024-10-01')
  },
  {
    version: '2024-01',
    status: 'stable',
    releaseDate: new Date('2024-01-01'),
    supportEndDate: new Date('2025-01-01')
  },
  {
    version: '2024-04',
    status: 'stable',
    releaseDate: new Date('2024-04-01'),
    supportEndDate: new Date('2025-04-01')
  },
  {
    version: '2024-07',
    status: 'release-candidate',
    releaseDate: new Date('2024-07-01'),
    supportEndDate: new Date('2025-07-01')
  }
];

class ShopifyApiVersionManager {
  private currentVersion: string = '2024-04';
  private isInitialized: boolean = false;
  
  /**
   * Initialize the API version manager
   */
  public init(): void {
    // In a real app, this would check local storage or server config
    // to determine the currently used API version
    this.isInitialized = true;
    
    // Check if the current version is going to be deprecated soon
    this.checkVersionStatus();
  }
  
  /**
   * Get the current API version in use
   */
  public getCurrent(): string {
    return this.currentVersion;
  }
  
  /**
   * Get all available API versions
   */
  public getAvailableVersions(): ShopifyApiVersion[] {
    return SHOPIFY_API_VERSIONS;
  }
  
  /**
   * Get the latest stable API version
   */
  public getLatestStable(): ShopifyApiVersion {
    const stableVersions = SHOPIFY_API_VERSIONS
      .filter(v => v.status === 'stable')
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
    
    return stableVersions[0] || SHOPIFY_API_VERSIONS[SHOPIFY_API_VERSIONS.length - 1];
  }
  
  /**
   * Update to the latest stable API version
   */
  public updateToLatest(): void {
    const latest = this.getLatestStable();
    this.currentVersion = latest.version;
    
    // In a real app, this would save the version to storage
    localStorage.setItem('shopifyApiVersion', latest.version);
    
    // Track update
    gadgetAnalytics.trackBusinessMetric('shopify_api_version_updated', 1, {
      oldVersion: this.currentVersion,
      newVersion: latest.version
    });
    
    this.isInitialized = true;
  }
  
  /**
   * Set a specific API version
   */
  public setVersion(version: string): boolean {
    const versionExists = SHOPIFY_API_VERSIONS.some(v => v.version === version);
    
    if (!versionExists) {
      console.error(`API version ${version} not found`);
      return false;
    }
    
    this.currentVersion = version;
    
    // In a real app, this would save the version to storage
    localStorage.setItem('shopifyApiVersion', version);
    
    // Track change
    gadgetAnalytics.trackBusinessMetric('shopify_api_version_changed', 1, {
      version
    });
    
    return true;
  }
  
  /**
   * Check if the current version is going to be deprecated soon
   * and notify the user if needed
   */
  private checkVersionStatus(): void {
    const currentVersionInfo = SHOPIFY_API_VERSIONS.find(v => v.version === this.currentVersion);
    
    if (!currentVersionInfo) {
      return;
    }
    
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    
    // If the version will be deprecated within 3 months
    if (currentVersionInfo.supportEndDate <= threeMonthsFromNow) {
      toast.warning('Shopify API Version Update Needed', {
        description: `The Shopify API version ${this.currentVersion} will be deprecated soon. Please update to the latest version.`
      });
    }
  }
}

// Export a singleton instance
export const shopifyApiVersionManager = new ShopifyApiVersionManager();
