
import { useState, useEffect } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { useShopify } from "@/contexts/shopify";
import { FileUpload } from "@/components/FileUpload";
import { Header } from "./Header";
import { FileStats } from "./FileStats";
import { IndexTabs } from "./IndexTabs";
import { HowItWorks } from "./HowItWorks";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

export const IndexContent = () => {
  const { 
    file,
    items,
    isProcessing,
    summary,
  } = useFileAnalysis();

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Header />

      <div className="max-w-2xl mx-auto">
        <FileUpload onFileAccepted={(file) => {}} />
      </div>

      {isProcessing && (
        <div className="text-center text-muted-foreground">
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
  );
};
