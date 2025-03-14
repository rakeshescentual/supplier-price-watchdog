
# Gadget.dev Integration - Frequently Asked Questions

## General Questions

### What is Gadget.dev?
Gadget.dev is a powerful full-stack JavaScript application platform that enhances Supplier Price Watch with serverless backend capabilities, API integrations, and database functionality without requiring infrastructure management.

### Is Gadget.dev required to use Supplier Price Watch?
No, Gadget.dev integration is completely optional. The core functionality of Supplier Price Watch works without it, but certain advanced features are enhanced when Gadget.dev is connected.

### What are the main benefits of integrating with Gadget.dev?
- Enhanced PDF processing capabilities for complex supplier price lists
- Serverless background jobs for resource-intensive operations
- Managed database for historical pricing analysis
- API connections with Shopify, Klaviyo, and other services
- Built-in authentication and permissions management
- Automatic API generation and TypeScript SDKs

## Setup & Configuration

### How do I get started with Gadget.dev?
1. Create a Gadget.dev account at [gadget.dev](https://gadget.dev)
2. Create a new application in your Gadget dashboard
3. Follow our [Gadget Integration Guide](./Gadget_Integration_Guide.md) to configure your app
4. Connect your Gadget app to Supplier Price Watch via the Settings page

### What credentials do I need?
You'll need your Gadget App ID and an API Key with appropriate permissions. These can be found in your Gadget.dev dashboard under API Keys.

### How do I test if my Gadget integration is working?
Use the Gadget Diagnostics page in Supplier Price Watch to run a comprehensive test of your integration. This will check connectivity, permissions, and specific feature capabilities.

## Features & Capabilities

### What types of PDF processing does Gadget enable?
Gadget enhances PDF processing in several ways:
- Table extraction from complex PDF layouts using the Connections feature
- OCR for scanned documents through integrated cloud services
- Structured data extraction from semi-structured documents
- Processing of large multi-page documents with background jobs

### How does batch processing work with Gadget?
Gadget allows efficient batch processing through:
- Background Jobs for long-running processes
- Connection management for third-party API rate limits
- Optimistic locking for data integrity
- Built-in retry mechanisms for failed operations
- Real-time job status monitoring

### Can Gadget help with market data analysis?
Yes, with proper configuration, Gadget can:
- Store and analyze competitor pricing data in its managed database
- Schedule regular market data collection through Actions
- Connect to external analytics services through Connections
- Generate insights using built-in JavaScript runtime
- Create custom APIs for frontend visualization tools

## Troubleshooting

### My Gadget connection is failing, what should I check?
1. Verify your App ID and API Key are correct
2. Check that your API Key has the necessary permissions
3. Ensure your Gadget app is deployed and published
4. Check for any API rate limit issues in your Gadget logs
5. Verify CORS settings if you're connecting from a browser

### I'm getting "Permission Denied" errors
This typically means your API Key doesn't have the required permissions. In your Gadget dashboard, go to API Keys and ensure your key has access to all required models and actions.

### PDF processing is returning incomplete data
This can happen with complex PDFs. Try these solutions:
- Use Gadget's Connection feature to integrate with specialized document processing services
- Configure custom Actions with document parsing logic
- Use the Gadget Effects API to implement custom processing logic
- For scanned documents, ensure they're high quality and properly aligned

### Batch operations are timing out
For large catalogs, try these solutions:
- Convert your operations to use Gadget's Background Jobs feature
- Implement pagination using Gadget's cursor-based pagination
- Use the `recordLimit` option in your API requests
- Add appropriate indexes to your Gadget models for query optimization

## Advanced Usage

### Can I extend the Gadget integration with custom functionality?
Yes, the Gadget integration is extensible through:
- Custom Actions for specific business logic
- Custom API Routes for specialized endpoints
- Effects for side-effect management
- Connections to third-party services
- Custom roles and permissions

### How can I optimize performance for large catalogs?
For enterprise-scale operations:
- Use Gadget's built-in caching capabilities
- Configure appropriate database indexes on frequently queried fields
- Implement cursor-based pagination for large data sets
- Use Background Jobs for long-running operations
- Leverage Gadget's Connection pooling for third-party API calls

### Is there a way to automate Gadget operations?
Yes, you can:
- Use Gadget's built-in Scheduler for time-based operations
- Configure Webhooks to trigger operations based on events
- Set up Event Subscriptions for real-time data changes
- Create Action chains for complex workflows
- Use the TypeScript SDK for programmatic control

## Billing & Limits

### How does Gadget.dev billing work?
Gadget.dev has its own billing structure separate from Supplier Price Watch:
- A free Developer tier for development and testing
- Production tier with usage-based pricing
- Enterprise plans with dedicated resources and support
- Add-ons for increased storage and compute needs

### Are there rate limits when using Gadget?
Yes, Gadget.dev implements various limits based on your plan:
- API request limits per minute and per day
- Background job concurrency limits
- Database storage limits
- File storage limits
- Connection execution limits

For specific limits, consult the Gadget.dev documentation or your account dashboard.

### How can I monitor my Gadget usage?
Your Gadget.dev dashboard provides detailed usage metrics:
- API requests with filtering by endpoint
- Database operations and storage usage
- Background job executions and durations
- File storage usage
- Connection invocations and performance

## Migration & Data Management

### Can I migrate from standalone to Gadget.dev later?
Yes, you can start with the standalone version and add Gadget.dev integration later. We provide migration tools and documentation to make this process smooth.

### How is data stored in Gadget.dev?
Gadget.dev provides a fully managed database system with:
- Automatic backups and point-in-time recovery
- Data encryption at rest and in transit
- Role-based access controls
- Optimistic concurrency control
- Built-in validation rules

### Can I export data from Gadget.dev?
Yes, Gadget.dev provides several data export options:
- API endpoints for programmatic access
- CSV exports through the Gadget dashboard
- Bulk export operations via custom Actions
- Real-time sync through webhooks and subscriptions

For additional questions about Gadget.dev integration, please contact our support team at gadget-support@supplierpricewatcher.com
