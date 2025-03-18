
import { useState, useEffect } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { useShopify } from "@/contexts/shopify";
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { FileStats } from "./FileStats";
import { IndexTabs } from "./IndexTabs";
import { HowItWorks } from "./HowItWorks";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { toast } from "sonner";
import { GadgetStatusBar } from "@/components/gadget/GadgetStatusBar";

export const IndexContent = () => {
  const { 
    file,
    items,
    isProcessing,
    summary,
    handleFileAccepted
  } = useFileAnalysis();

  const { isGadgetInitialized } = useShopify();
  const { savedAnalyses, saveAnalysis } = useAnalysisHistory();

  useEffect(() => {
    if (file && items.length > 0 && summary) {
      saveAnalysis({
        fileName: file.name,
        itemCount: items.length,
        summary: {
          increasedItems: summary.increasedItems,
          decreasedItems: summary.decreasedItems
        }
      });
    }
  }, [file, items.length, summary, saveAnalysis]);

  const handleFileAcceptedWithToast = (acceptedFile) => {
    try {
      handleFileAccepted(acceptedFile);
      toast.success(`File "${acceptedFile.name}" uploaded successfully`);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file", {
        description: error.message || "Please try again with a different file"
      });
    }
  };

  return (
    <div className="space-y-8">
      {isGadgetInitialized && <GadgetStatusBar />}
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Header />

        <div className="max-w-2xl mx-auto">
          <FileUpload onFileAccepted={handleFileAcceptedWithToast} />
        </div>

        {isProcessing && (
          <div className="text-center text-muted-foreground animate-pulse">
            <div className="inline-block w-6 h-6 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Processing file...
          </div>
        )}

        {file && items.length > 0 && (
          <>
            <FileStats />
            <IndexTabs />
          </>
        )}
        
        {!file && <HowItWorks savedAnalyses={savedAnalyses} />}
      </div>
    </div>
  );
};
