
export const changelogData = [
  {
    version: "3.5.2",
    date: "June 30, 2024",
    title: "Enhanced Gadget Integration with Google Workspace",
    type: "feature",
    description: "This release enhances the Google Workspace integration with advanced calendar features and improved email notifications.",
    details: [
      "New calendar event templates for price change notifications",
      "Improved email formatting with product images",
      "Support for scheduling recurring price analysis",
      "Integration with Google Drive for automated backups"
    ],
    technicalNotes: "Updated OAuth scopes for Google Calendar API. Added new email templates with dynamic content support. Improved error handling for Google API rate limits."
  },
  {
    version: "3.5.1",
    date: "June 15, 2024",
    title: "Google Drive Integration Improvements",
    type: "improvement",
    description: "Enhanced integration with Google Drive for more reliable file storage and retrieval.",
    details: [
      "Improved file upload reliability",
      "New thumbnail previews for stored documents",
      "Enhanced file versioning support",
      "Better handling of quota limitations"
    ]
  },
  {
    version: "3.5.0",
    date: "June 10, 2024",
    title: "Google Workspace Core Integration",
    type: "feature",
    description: "First release with Google Workspace integration, enabling Gmail notifications and Google Calendar events for price changes.",
    details: [
      "Gmail integration for sending price change notifications",
      "Calendar events for scheduled price updates",
      "Basic Google Drive integration for file storage",
      "Authentication with Google OAuth 2.0"
    ],
    technicalNotes: "Implements Google OAuth 2.0 flow with refresh tokens. Uses Gmail API for email notifications and Google Calendar API for scheduling."
  },
  {
    version: "3.4.2",
    date: "May 25, 2024",
    title: "Gadget PDF Processing Fix",
    type: "bugfix",
    description: "Fixed an issue with PDF processing where certain table formats were not correctly parsed.",
    details: [
      "Improved table detection algorithm",
      "Fixed encoding issues with special characters",
      "Enhanced error reporting for failed PDF parsing",
      "Better handling of multi-page documents"
    ]
  },
  {
    version: "3.4.0",
    date: "May 10, 2024",
    title: "Enhanced Batch Operations",
    type: "improvement",
    description: "Improved batch operation performance and reliability when using Gadget integration.",
    details: [
      "40% faster batch processing of large datasets",
      "Reduced memory usage during processing",
      "Better error handling and recovery",
      "New progress indicators in the UI"
    ]
  },
  {
    version: "3.0.0",
    date: "March 15, 2024",
    title: "Gadget.dev Integration",
    type: "feature",
    description: "Major release introducing Gadget.dev integration for enhanced capabilities.",
    details: [
      "Gadget.dev SDK integration for backend capabilities",
      "Advanced PDF processing",
      "Batch operation improvements",
      "Performance optimization",
      "Enhanced error handling"
    ],
    technicalNotes: "This version requires new API permissions for Gadget.dev. Users will need to generate a new API key with appropriate scopes."
  },
  {
    version: "2.5.0",
    date: "December 7, 2023",
    title: "AI Insights Release",
    type: "feature",
    description: "Introduced AI-powered price recommendations and competitive analysis features.",
    details: [
      "AI-powered price recommendations",
      "Market comparison data",
      "Competitive analysis features",
      "Customer notification system",
      "Enhanced reporting"
    ]
  },
  {
    version: "2.0.0",
    date: "September 22, 2023",
    title: "Shopify Integration",
    type: "feature",
    description: "Full Shopify API integration with product matching algorithm and price synchronization.",
    details: [
      "Full Shopify API integration",
      "Product matching algorithm",
      "Price synchronization to Shopify",
      "User interface redesign",
      "Multi-user support"
    ]
  },
  {
    version: "1.0.0",
    date: "March 15, 2023",
    title: "Initial Release",
    type: "feature",
    description: "First production release with core functionality for price comparison analysis.",
    details: [
      "Basic file upload (Excel format)",
      "Price comparison analysis",
      "Simple price change visualization",
      "Basic reporting functionality",
      "Manual Shopify connection"
    ]
  }
];
