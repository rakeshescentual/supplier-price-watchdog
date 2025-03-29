
# Shopify Integration Guide

## Overview

The Supplier Price Watch application integrates seamlessly with your Shopify store, allowing you to efficiently manage product pricing, analyze market data, and automate various processes. This guide will walk you through all aspects of the Shopify integration.

## Connection Setup

### Connecting Your Shopify Store

1. Navigate to the **Shopify Integration** page from the main navigation
2. Click the **Connect Store** button in the top right corner
3. Enter your Shopify store URL (e.g., `your-store.myshopify.com`)
4. Click "Authorize Access" to grant the necessary permissions
5. You'll be redirected back to the application once the connection is established

### Verifying Connection Status

The connection status indicator in the top right of the Shopify Integration dashboard shows:
- Green: Successfully connected and functioning properly
- Orange: Connected but with warnings (e.g., outdated API version)
- Red: Connection issue detected

Click the "Refresh" button next to the status indicator to verify your connection at any time.

## Dashboard Overview

The Shopify Integration dashboard provides a comprehensive view of your integration status and quick access to key features:

### Integration Status Card
Shows connection health, API version, and active integration features.

### API Health Check
Monitors API responsiveness and rate limit status.

### Quick Actions
Provides buttons for common tasks:
- Sync Prices: Update product prices in Shopify
- Manage Webhooks: Set up notifications for Shopify events
- Market Analysis: View market trends and price insights

## Managing Product Prices

### Bulk Price Updates

1. Navigate to the **Bulk Operations** tab
2. Select the products you wish to update or use filters to select groups of products
3. Choose update options:
   - Dry Run: Preview changes without applying them
   - Notify Customers: Send automatic notifications for significant price changes
4. Click "Update Prices" to synchronize with Shopify

### Scheduling Price Changes

For Shopify Plus stores, you can schedule price changes to take effect at a specific date and time:

1. Go to the **Bulk Operations** tab
2. Select products and click "Schedule Update"
3. Choose the effective date and time
4. Review and confirm the scheduled changes

## Market Insights

The **Market Insights** tab provides AI-powered analysis of your product pricing compared to competitors:

### Price Optimization
Recommendations for price adjustments based on market positioning and competitor analysis.

### Opportunity Detection
Identifies products with potential for margin improvement or market share gains.

### Market Trends
Visualizes pricing trends across your product catalog and industry.

## Shopify Plus Features

If you have a Shopify Plus subscription, additional features are available:

### Flows Automation
Create and manage Shopify Flow automations directly from the app.

### B2B Pricing
Set up and manage B2B-specific pricing structures.

### Multi-Location Inventory
Manage inventory across multiple store locations.

### Multipass Authentication
Securely authenticate customers across multiple channels.

### Gift Card Management
Create and manage digital gift cards for your store.

## Webhooks

Webhooks allow your Shopify store to send real-time notifications when certain events occur:

### Setting Up Webhooks

1. Navigate to the **Webhooks** tab
2. Click "Create Webhook" for the desired event type
3. The system will automatically configure the webhook endpoint

### Essential Webhooks

We recommend setting up these essential webhooks:
- products/update: Notifies when product information changes
- products/delete: Alerts when products are removed
- inventory_levels/update: Tracks inventory changes
- orders/create: Notifies when new orders are placed

## Troubleshooting

### Common Connection Issues

1. **Authentication Errors**
   - Ensure your access token is valid and has not expired
   - Check that the app has the required permissions in your Shopify admin

2. **API Rate Limiting**
   - The app monitors rate limits and adjusts request frequencies automatically
   - If you see rate limit warnings, consider scheduling bulk operations during off-peak hours

3. **Webhook Delivery Failures**
   - Verify your server is accessible from the internet
   - Check webhook logs in the Shopify admin

### Getting Help

If you encounter issues with your Shopify integration:

1. Check the API Health status on the dashboard
2. Click the "Help" button for contextual documentation
3. Contact support@supplierpricewatcher.com for personalized assistance

## Best Practices

1. **Regular Connection Verification**
   Use the "Refresh" button to regularly verify your connection status

2. **API Version Updates**
   Keep your API version current by applying updates when prompted

3. **Webhooks Maintenance**
   Review and test your webhooks periodically to ensure they're working correctly

4. **Bulk Operation Timing**
   Schedule large bulk operations during off-peak hours to minimize impact on your store

5. **Compliance Review**
   Check the Compliance tab regularly to ensure your integration follows Shopify's best practices
