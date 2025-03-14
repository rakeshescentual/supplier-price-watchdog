
# Gadget.dev Integration - Frequently Asked Questions

## General Questions

### What is Gadget.dev?
Gadget.dev is a powerful backend development platform that enhances Supplier Price Watch with additional capabilities like PDF processing, batch operations, and advanced data storage.

### Is Gadget.dev required to use Supplier Price Watch?
No, Gadget.dev integration is completely optional. The core functionality of Supplier Price Watch works without it, but certain advanced features are enhanced when Gadget.dev is connected.

### What are the main benefits of integrating with Gadget.dev?
- Enhanced PDF processing capabilities for complex supplier price lists
- Faster batch operations for large product catalogs
- Advanced data storage for historical analysis
- Improved market data analysis
- Better performance for enterprise-scale operations

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
- Table extraction from complex PDF layouts
- OCR for scanned documents
- Structured data extraction from semi-structured documents
- Processing of large multi-page documents

### How does batch processing work with Gadget?
Gadget allows efficient batch processing of operations by:
- Respecting Shopify API rate limits automatically
- Processing data in optimal chunk sizes
- Providing detailed progress and error reporting
- Handling retries for failed operations

### Can Gadget help with market data analysis?
Yes, with proper configuration, Gadget can:
- Store and analyze competitor pricing data
- Calculate market positioning metrics
- Track price trends over time
- Generate AI-powered pricing recommendations

## Troubleshooting

### My Gadget connection is failing, what should I check?
1. Verify your App ID and API Key are correct
2. Check that your API Key has the necessary permissions
3. Ensure your Gadget app is deployed and running
4. Check for any API rate limit issues
5. Verify network connectivity from your environment to Gadget.dev

### I'm getting "Permission Denied" errors
This typically means your API Key doesn't have the required permissions. In your Gadget dashboard, go to API Keys and ensure your key has access to all required models and actions.

### PDF processing is returning incomplete data
This can happen with complex PDFs. Try these solutions:
- Check if the PDF has multiple tables or unusual formatting
- Use the Gadget app's document viewer to see how the PDF is being interpreted
- Configure custom document processing rules in your Gadget app
- For scanned documents, ensure they're high quality and properly aligned

### Batch operations are timing out
For large catalogs, try these solutions:
- Reduce batch size in your Supplier Price Watch settings
- Increase the timeout value in your Gadget app configuration
- Process updates in smaller groups
- Implement progressive processing for very large catalogs

## Advanced Usage

### Can I extend the Gadget integration with custom functionality?
Yes, the Gadget integration is extensible. You can:
- Create custom actions in your Gadget app
- Implement custom data models
- Add custom processing logic
- Connect additional data sources

### How can I optimize performance for large catalogs?
For enterprise-scale operations:
- Implement caching strategies in your Gadget app
- Use incremental updates instead of full syncs
- Configure background processing for large operations
- Implement custom indexing for frequently queried data

### Is there a way to automate Gadget operations?
Yes, you can:
- Schedule jobs in your Gadget app to run at specific intervals
- Set up webhooks to trigger operations based on events
- Create automation flows in Gadget that respond to data changes
- Implement custom triggers for specific business logic

## Billing & Limits

### How does Gadget.dev billing work?
Gadget.dev has its own billing structure separate from Supplier Price Watch. They typically offer:
- A free tier for development and small-scale usage
- Usage-based billing for production applications
- Enterprise plans for high-volume needs

### Are there rate limits when using Gadget?
Yes, Gadget.dev implements rate limits to ensure fair usage:
- API request limits vary by plan
- Storage limits for different tiers
- Execution time limits for actions
- Concurrent operation limits

For specific limits, consult the Gadget.dev documentation or your account dashboard.

### How can I monitor my Gadget usage?
Your Gadget.dev dashboard provides usage metrics including:
- API requests per day/month
- Storage utilization
- Execution time for actions
- Error rates and performance metrics

## Migration & Data Management

### Can I migrate from standalone to Gadget.dev later?
Yes, you can start with the standalone version and add Gadget.dev integration later. We provide migration tools and documentation to make this process smooth.

### How is data stored in Gadget.dev?
Gadget.dev uses a secure database system with:
- End-to-end encryption
- Geographic data residency options
- Automatic backups
- Role-based access controls

### Can I export data from Gadget.dev?
Yes, Gadget.dev provides several data export options:
- API endpoints for programmatic access
- Scheduled exports to cloud storage
- Integration with data warehousing solutions
- Bulk export utilities

For additional questions about Gadget.dev integration, please contact our support team at gadget-support@supplierpricewatcher.com
