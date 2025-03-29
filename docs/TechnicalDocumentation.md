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

## Documentation Sections

For detailed information about specific aspects of the system, please refer to the following documentation files:

- [System Core Components](./SystemCoreComponents.md)
- [File Analysis Processing](./FileAnalysisProcessing.md)
- [Gadget Integration Details](./GadgetIntegrationDetails.md)
- [Google Workspace Integration](./GoogleWorkspaceIntegration.md)
- [Application Workflows](./ApplicationWorkflows.md)
- [Error Handling](./ErrorHandlingStrategy.md)
- [Deployment Options](./DeploymentOptions.md)

## Market Data & Insights

The application provides extensive market data analysis through a modular architecture:

- **Market Data Core**: Central hook for market data state management
- **Market Data Enrichment**: Web data enrichment operations
- **Market Data Analysis**: Statistical analysis of market positioning
- **Market Data Trends**: Category and price trend monitoring
- **Market Data Batching**: Efficient batch processing of market operations

These components work together to provide competitive insights and market positioning information for pricing decisions.

## Stakeholder-Specific Documentation

### For Business Users & Decision Makers
- [Executive Summary](../docs/ExecutiveSummary.md)
- [ROI Analysis](../docs/ROIAnalysis.md)
- [Feature Roadmap](../docs/FeatureRoadmap.md)
- [User Permissions Guide](../docs/UserPermissions.md)
- [Pricing Strategy Playbook](../docs/PriceStrategyPlaybook.md)

### For eCommerce Managers
- [Shopify Merchant Guide](../docs/ShopifyMerchantGuide.md)
- [Customer Communication Templates](../docs/CustomerCommunicationTemplates.md)
- [Workflow Automation Guide](../docs/WorkflowAutomation.md)
- [Reporting & Analytics](../docs/ReportingAnalytics.md)

### For Developers & IT Teams
- [Developer Workflows](../docs/DeveloperWorkflows.md)
- [API Documentation](../docs/APIDocumentation.md)
- [Deployment Guide](../docs/DeploymentGuide.md)
- [Component Reference](../docs/ComponentReference.md)
- [Testing Framework](../docs/TestingFramework.md)

### For Integration Partners
- [Shopify Compliance Guide](../docs/ShopifyComplianceGuide.md)
- [Gadget.dev Integration Guide](../docs/Gadget_Integration_Guide.md)
- [Google Workspace Integration Guide](../docs/GoogleWorkspaceGuide.md)
- [Third-Party API Integration](../docs/ThirdPartyIntegration.md)

## Quick Start Guides

- [5-Minute Setup Guide](../docs/QuickStartGuide.md)
- [First Price List Analysis](../docs/FirstPriceAnalysis.md)
- [Connecting Your Shopify Store](../docs/ShopifyConnection.md)
- [Setting Up Customer Notifications](../docs/NotificationSetup.md)

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
