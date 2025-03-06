
/**
 * Main entry point for Gadget integration
 * Re-exports all Gadget-related functionality
 */

// Core client and operations
export * from './client';
export * from './operations';

// Core utilities
export * from './sync';
export * from './batch';
export * from './export';
export * from './processing';

// Infrastructure
export * from './logging';
export * from './telemetry';
export * from './pagination';

// Development utilities
export * from './mocks';

// Type definitions
export type { GadgetConfig } from '@/types/price';

/**
 * Gadget Module Documentation
 * 
 * This module provides a complete integration with Gadget.dev services,
 * with the following key components:
 * 
 * 1. Client initialization and management (client.ts)
 * 2. Shopify integration and synchronization (sync.ts)
 * 3. Efficient batch processing (batch.ts)
 * 4. PDF processing and data enrichment (processing.ts)
 * 5. Data export capabilities (export.ts)
 * 6. Comprehensive logging system (logging.ts)
 * 7. Performance tracking and telemetry (telemetry.ts)
 * 8. Pagination utilities (pagination.ts)
 * 9. Development mocks for testing (mocks.ts)
 * 
 * For migration to Gadget.dev, refer to the documentation in
 * src/assets/docs/GadgetMigrationGuide.md
 */
