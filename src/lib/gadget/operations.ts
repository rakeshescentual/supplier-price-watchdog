
/**
 * Re-export all Gadget operation modules
 * This file maintains backward compatibility with existing imports
 * 
 * Gadget.dev compatibility:
 * This file organizes operations to match Gadget.dev's architecture,
 * making migration to Gadget.dev seamless when ready.
 */

// Core functionality
export * from './client';
export * from './sync';
export * from './batch';
export * from './export';
export * from './processing';
export * from './logging';
export * from './telemetry';
export * from './pagination';
export * from './diagnostics';
export * from './shopify-integration';

// Mock implementations for development
export * from './mocks';

/**
 * Gadget Integration Module
 * 
 * This module provides a comprehensive integration with Gadget.dev
 * for the Supplier Price Watch application. All Gadget-related
 * functionality is exported through this single entry point.
 * 
 * For implementation details and migration instructions,
 * see the documentation in:
 * - src/assets/docs/Gadget_Integration_Guide.md
 * - src/assets/docs/GadgetMigrationGuide.md
 * 
 * To migrate to a live Gadget.dev implementation:
 * 1. Create a Gadget.dev account and application
 * 2. Replace mock implementations with Gadget SDK calls
 * 3. Update configuration to use your Gadget app ID
 * 4. Use the official Gadget client SDK
 * 
 * For Shopify Plus and Built for Shopify certification:
 * - Implements all required Shopify API endpoints
 * - Follows Shopify API best practices with rate limiting
 * - Provides efficient batch operations for bulk updates
 * - Supports Shopify Plus features like Scripts, Flows, and B2B
 * - Handles authentication securely
 * - Includes comprehensive error handling and retry logic
 */
