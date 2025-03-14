
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Lightbulb } from "lucide-react";

interface QuickReferenceGuideProps {
  activeTab: string;
  onClose: () => void;
  onDownload: (content: string, filename: string) => void;
  technicalDocumentation: string;
  gadgetIntegrationGuide: string;
}

export const QuickReferenceGuide: React.FC<QuickReferenceGuideProps> = ({
  activeTab,
  onClose,
  onDownload,
  technicalDocumentation,
  gadgetIntegrationGuide,
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm space-y-3 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-amber-800 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
          Quick Reference Guide
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {activeTab === "technical" ? (
        <div className="space-y-2">
          <p className="font-medium text-amber-800">Common Tasks:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Upload a price list: Navigate to File Upload page and select your Excel/PDF file</li>
            <li>Analyze price changes: Use the Price Table component and apply filters</li>
            <li>Connect to Shopify: Go to Settings page and enter your Shopify credentials</li>
            <li>Sync prices to Shopify: Select items in Price Table and use "Sync to Shopify" button</li>
            <li>Set up notifications: Use the Customer Notifications panel from the sidebar</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-medium text-amber-800">Gadget.dev Quick Reference:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Configure Gadget: Go to Settings page and enter your Gadget App ID and API Key</li>
            <li>Process PDFs: Enable PDF processing in your Gadget app models</li>
            <li>Batch operations: Use performBatchOperations helper for efficient API usage</li>
            <li>Custom Gadget actions: Create actions for price analysis and synchronization</li>
            <li>Error handling: Check logs in Gadget dashboard for troubleshooting</li>
          </ul>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2 bg-amber-100 hover:bg-amber-200 text-amber-800"
        onClick={() => onDownload(activeTab === "technical" ? technicalDocumentation : gadgetIntegrationGuide, 
          activeTab === "technical" ? "TechnicalDocumentation.md" : "GadgetIntegrationGuide.md")}
      >
        <Download className="h-3 w-3 mr-2" />
        Download Full Guide
      </Button>
    </div>
  );
};
