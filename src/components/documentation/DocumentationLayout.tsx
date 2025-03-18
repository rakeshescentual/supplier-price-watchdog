
import React, { useState, useEffect } from "react";
import { DocumentationHeader } from "./DocumentationHeader";
import { DocumentationTabs } from "./DocumentationTabs";
import { GadgetStatusBar } from "@/components/gadget/GadgetStatusBar";
import { useGadgetStatus } from "@/hooks/useGadgetStatus";
import { TableOfContents } from "./TableOfContents";
import { DocumentationContent } from "./DocumentationContent";
import { DocumentationFAQ } from "./DocumentationFAQ";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface DocumentationLayoutProps {
  children?: React.ReactNode;
}

// Mock content for technical documentation
const technicalDoc = `
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

\`\`\`
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
\`\`\`

## Documentation Sections

For detailed information about specific aspects of the system, please refer to the following documentation files:

- [System Core Components](./SystemCoreComponents.md)
- [File Analysis Processing](./FileAnalysisProcessing.md)
- [Gadget Integration Details](./GadgetIntegrationDetails.md)
- [Google Workspace Integration](./GoogleWorkspaceIntegration.md)
- [Application Workflows](./ApplicationWorkflows.md)
- [Error Handling](./ErrorHandlingStrategy.md)
- [Deployment Options](../docs/DeploymentOptions.md)
`;

// Mock content for Gadget FAQ
const gadgetFAQ = `
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
`;

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ 
  children 
}) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [quickRefOpen, setQuickRefOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("technical");
  const [activeSection, setActiveSection] = useState<string>("");
  const { isInitialized, healthStatus } = useGadgetStatus();
  
  // Get the content based on the active tab
  const getContent = () => {
    return activeTab === "technical" ? technicalDoc : gadgetFAQ;
  };

  // Scroll to a section when clicked in the table of contents
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Sample FAQ items
  const faqItems = [
    {
      question: "Is Gadget integration required to use this application?",
      answer: "No, Gadget integration is completely optional. The core functionality works without it, but certain advanced features are enhanced when Gadget is connected."
    },
    {
      question: "How do I get started with Gadget integration?",
      answer: "You can start by visiting the Settings page and navigating to the Integrations tab. From there, you'll find options to configure your Gadget connection with your API key and application ID."
    },
    {
      question: "What features are enhanced by Gadget?",
      answer: "Gadget enhances PDF processing capabilities, enables background jobs for resource-intensive operations, provides a managed database for historical pricing analysis, and offers API connections with various services."
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {isInitialized && <GadgetStatusBar />}
      
      <div className="container mx-auto py-8 px-4 flex-1">
        <DocumentationHeader 
          onToggleSearch={() => setShowSearch(!showSearch)} 
          onToggleQuickRef={() => setQuickRefOpen(!quickRefOpen)}
          showSearch={showSearch}
        />
        
        <DocumentationTabs 
          showSearch={showSearch} 
          quickRefOpen={quickRefOpen}
          onQuickRefClose={() => setQuickRefOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Table of Contents */}
          <div className="hidden lg:block">
            <TableOfContents 
              content={getContent()} 
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <DocumentationContent 
                content={getContent()}
                type={activeTab as 'technical' | 'gadget'}
              />
              
              {activeTab === "gadget" && (
                <>
                  <Separator className="my-8" />
                  <DocumentationFAQ items={faqItems} />
                </>
              )}
            </ScrollArea>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};
