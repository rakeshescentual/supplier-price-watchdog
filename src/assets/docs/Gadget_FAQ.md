
# Gadget.dev Integration - Frequently Asked Questions

## General Questions

### What is Gadget.dev?
Gadget.dev is a full-stack application development platform that simplifies building web applications. It provides pre-built connections, action frameworks, and background jobs that enhance the Supplier Price Watch application.

### Why use Gadget.dev instead of custom backend solutions?
Gadget.dev eliminates the need to build and maintain custom backend infrastructure while providing powerful features like PDF processing, data enrichment, and Shopify integration with minimal code.

### Is a Gadget.dev account required to use Supplier Price Watch?
No. The application is designed to work without Gadget.dev, but certain advanced features like PDF processing, background batch operations, and enhanced Shopify integration are only available with Gadget.dev.

## Configuration & Setup

### How do I configure the Gadget.dev connection?
1. Create a Gadget.dev account and application
2. Generate an API key with appropriate permissions
3. In Supplier Price Watch, go to Integrations → Gadget Config
4. Enter your App ID, API key, and select environment
5. Save and test the connection

### What permissions does my Gadget API key need?
The API key should have permissions for:
- Reading and writing to your Gadget models
- Executing actions
- Accessing connected services (Shopify, email, etc.)

### Can I use multiple Gadget applications with Supplier Price Watch?
Currently, the application supports connecting to one Gadget.dev application at a time. For multiple environments (development/production), you can switch the configuration as needed.

## Features & Capabilities

### What Gadget.dev features does Supplier Price Watch use?
1. **Authentication Bridge**: Secure Shopify authentication
2. **PDF Processing**: Extract data from supplier PDF price lists
3. **Batch Operations**: Efficiently process large datasets
4. **Data Enrichment**: Add market information to products
5. **Background Jobs**: Handle time-consuming tasks asynchronously

### How does the PDF processing feature work?
Supplier Price Watch uploads PDF files to Gadget.dev, which processes them using OCR and structured data extraction. The extracted data is then returned in a format that can be used for price analysis.

### Can I use Gadget's background jobs for large datasets?
Yes. For time-consuming operations like processing thousands of products or performing market research, you can leverage Gadget's background jobs to run these tasks asynchronously without blocking the user interface.

## Troubleshooting

### I'm getting CORS errors when connecting to Gadget.dev
1. Go to your Gadget application settings
2. Navigate to the CORS section
3. Add your frontend application's domain
4. Enable the necessary HTTP methods
5. Allow credentials if needed

### My API key isn't working
1. Verify the API key is active in your Gadget dashboard
2. Check that the key has the required permissions
3. Ensure you're connecting to the correct environment
4. Try regenerating the API key if issues persist

### The connection test succeeds but features aren't working
1. Check that your Gadget models match the expected structure
2. Verify that required actions are implemented in your Gadget app
3. Look for console errors that might provide more information
4. Confirm your Gadget application has necessary connections configured

## Migration & Deployment

### How do I migrate from GitHub to Gadget.dev?
Refer to our comprehensive [Gadget Migration Guide](docs/GadgetMigrationGuide.md) for step-by-step instructions on moving your application from GitHub to Gadget.dev.

### Do I need to rewrite my frontend code?
No. The frontend remains the same, but you'll need to:
1. Replace mock implementations with real Gadget client code
2. Update API calls to use the Gadget SDK
3. Configure proper error handling for Gadget operations

### Can I still deploy my frontend separately?
Yes. You can deploy your React frontend to any static hosting service like Netlify, Vercel, or GitHub Pages. The frontend will communicate with your Gadget.dev backend via API calls.

## Advanced Integration

### Can I create custom Gadget actions for my specific needs?
Yes. You can create custom actions in your Gadget application for specialized tasks like:
- Advanced market data analysis
- Custom PDF processing logic
- Specialized Shopify integrations
- Business-specific batch operations

### How do I handle authentication with Gadget.dev?
Supplier Price Watch stores your Gadget API key locally. For user authentication, you can leverage Gadget's built-in authentication providers or implement custom authentication logic.

### Can Gadget.dev help with multi-tenant applications?
Yes. If you're building an application that serves multiple clients, Gadget's tenant model can help you isolate data and manage access control efficiently.

## Support & Resources

### Where can I find more information about Gadget.dev?
- [Gadget Documentation](https://docs.gadget.dev)
- [Gadget API Reference](https://docs.gadget.dev/api)
- [Gadget Community Discord](https://discord.gg/gadget)

### How can I get help with Gadget.dev integration?
1. Consult our [Integration Guide](docs/Gadget_Integration_Guide.md)
2. Contact support@gadget.dev for direct assistance
3. Join the Gadget Community Discord for community support
4. Review the FAQ and troubleshooting sections of our documentation

### Is there a cost to using Gadget.dev?
Gadget.dev offers various pricing tiers, including a free tier for development and testing. Check their [pricing page](https://gadget.dev/pricing) for current information on plans and limitations.
