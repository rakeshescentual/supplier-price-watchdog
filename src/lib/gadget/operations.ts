
/**
 * Re-export all Gadget operation modules
 * This file maintains backward compatibility with existing imports
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
 */
