
# Supplier Price Watch - Technical Documentation

## Overview

Supplier Price Watch is a specialized web application designed for eCommerce businesses, particularly Shopify merchants, to analyze and manage supplier price changes efficiently. The core functionality revolves around processing supplier price lists, identifying price changes, and providing actionable insights.

## Key Functionality

- **Price Analysis**: Compare old vs new prices to identify increases, decreases, and anomalies
- **AI Insights**: Generate recommendations based on price changes and market data
- **Shopify Integration**: Connect directly with Shopify stores for product information and price updates
- **Gadget.dev Enhancement**: Optional integration for improved PDF processing and batch operations
- **Data Visualization**: Graphical representation of price changes and market positioning
- **Customer Notifications**: Tools for communicating price changes to customers

## Technical Architecture

```
┌─────────────────────────────────┐
│          React Frontend         │
│  (TypeScript, Tailwind, shadcn) │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│       Context Providers         │
│  ShopifyContext, FileAnalysis   │
└┬──────────────┬─────────────────┘
 │              │
 ▼              ▼
┌────────────┐ ┌────────────────────┐
│  Shopify   │ │    File Analysis   │
│   API      │ │    & Processing    │
└──────┬─────┘ └──────────┬─────────┘
       │                  │
       ▼                  ▼
┌────────────┐    ┌───────────────┐
│ Gadget.dev │◄───┤ AI Analysis   │
│ Integration│    │ & Enrichment  │
└──────┬─────┘    └───────────────┘
       │
       ▼
┌────────────────────────────────┐
│   Google Workspace Integration  │
│     (Gmail, Google Calendar)    │
└────────────────────────────────┘
```

## Development Workflows

For detailed workflows for specific developer tasks, please refer to [DeveloperWorkflows.md](./DeveloperWorkflows.md)

## API Documentation

For API endpoints and integration details, please refer to [APIDocumentation.md](./APIDocumentation.md)

## Deployment Guide

For deployment procedures and environment setup, please refer to [DeploymentGuide.md](./DeploymentGuide.md)

## Component Reference

For a breakdown of all React components and their props, please refer to [ComponentReference.md](./ComponentReference.md)

## Feature Development Timeline

For detailed feature development history and roadmap, please refer to [FeatureTimeline.md](./FeatureTimeline.md)

## Testing Strategy

For testing procedures and requirements, please refer to [TestingStrategy.md](./TestingStrategy.md)

## Gadget.dev Integration

For details on Gadget.dev integration capabilities, please refer to [GadgetIntegration.md](./GadgetIntegration.md)

## User Permissions

For information on user roles and permissions, please refer to [UserPermissions.md](./UserPermissions.md)

