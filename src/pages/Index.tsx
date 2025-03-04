
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { PriceTable } from "@/components/PriceTable";
import { AIAnalysis } from "@/components/AIAnalysis";
import { ShareDialog } from "@/components/ShareDialog";
import { SupplierCorrespondence } from "@/components/supplier/SupplierCorrespondence";
import { exportToShopifyFormat } from "@/lib/excel";
import { ShopifyProvider, useShopify } from "@/contexts/ShopifyContext";
import { FileAnalysisProvider, useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RefreshCw, FileUp, FileText, Info, FileBarChart2, Brain, Mail } from "lucide-react";

const IndexContent = () => {
  const { 
    shopifyContext, 
    isShopifyConnected, 
    isGadgetInitialized,
    isSyncing,
    syncToShopify
  } = useShopify();

  const {
    file,
    items,
    isProcessing,
    analysis,
    isAnalyzing,
    summary,
    handleFileAccepted,
    exportForShopify
  } = useFileAnalysis();

  const fileStats = items.length > 0 ? {
    totalItems: items.length,
    increasedItems: summary.increasedItems,
    decreasedItems: summary.decreasedItems
  } : undefined;

  const handleSync = async () => {
    if (items.length > 0) {
      await syncToShopify(items);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-fade-up">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Supplier Price Watch</h1>
          <p className="text-lg text-muted-foreground">
            Upload your supplier price list to analyze changes and impacts
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
          <div className="flex gap-2">
            {isShopifyConnected && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Shopify Connected
              </div>
            )}
            {isGadgetInitialized && (
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Gadget Enabled
              </div>
            )}
          </div>
          
          <ShareDialog fileStats={fileStats} onExport={items.length > 0 ? exportForShopify : undefined} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </div>

      {(isProcessing) && (
        <div className="text-center text-muted-foreground">
          {isProcessing ? "Processing file..." : "Loading Shopify data..."}
        </div>
      )}

      {file && items.length > 0 && (
        <>
          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
            <div className="p-2 rounded-full bg-primary/10">
              {file.type === 'application/pdf' ? (
                <FileText className="w-5 h-5 text-primary" />
              ) : (
                <FileUp className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{items.length} items analyzed</p>
            </div>
            <div className="flex gap-2">
              {isShopifyConnected && (
                <Button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="bg-[#5E8E3E] hover:bg-[#4a7331]"
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? "Syncing..." : "Sync to Shopify"}
                </Button>
              )}
              <Button 
                onClick={exportForShopify}
                className="bg-[#5E8E3E] hover:bg-[#4a7331]"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Export for Shopify
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="analysis" className="mt-8">
            <TabsList className="w-full max-w-md mx-auto mb-4">
              <TabsTrigger value="analysis" className="flex-1">
                <FileBarChart2 className="w-4 h-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Communication
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <AnalysisSummary {...summary} />
                </div>
                <div className="md:col-span-1">
                  <AIAnalysis analysis={analysis} isLoading={isAnalyzing} />
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
                <Info className="h-4 w-4 text-blue-500" />
                <p>
                  {isShopifyConnected 
                    ? "This analysis is integrated with your Shopify store data. You can sync price changes directly or export them."
                    : "You can export this analysis in Shopify-compatible format for easy importing."}
                </p>
              </div>
              
              <PriceTable items={items} />
            </TabsContent>
            
            <TabsContent value="communication">
              <SupplierCorrespondence />
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {!file && (
        <div className="text-center mt-12 p-8 border rounded-lg bg-muted/30">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">How it works</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload your supplier price list (Excel or PDF) to compare old vs new prices. 
            Supplier Price Watch will analyze price changes, identify anomalies, and calculate the potential impact on your business.
            {isShopifyConnected && " It also integrates with your Shopify store to provide tailored insights."}
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Upload file</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">AI Analysis</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Sync to Shopify</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ShopifyProvider>
      <FileAnalysisProvider>
        <IndexContent />
      </FileAnalysisProvider>
    </ShopifyProvider>
  );
};

export default Index;
