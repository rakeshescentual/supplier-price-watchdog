
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { PriceTable } from "@/components/PriceTable";
import { processExcelFile } from "@/lib/excel";
import { toast } from "sonner";
import type { PriceItem } from "@/types/price";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileAccepted = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setIsProcessing(true);
    
    try {
      const processedItems = await processExcelFile(acceptedFile);
      setItems(processedItems);
      
      toast.success("Analysis complete", {
        description: "Price changes have been processed successfully.",
      });
    } catch (error) {
      toast.error("Error processing file", {
        description: "Please check the file format and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAnalysisSummary = () => {
    const increased = items.filter(item => item.status === 'increased');
    const decreased = items.filter(item => item.status === 'decreased');
    const discontinued = items.filter(item => item.status === 'discontinued');

    return {
      increasedItems: increased.length,
      decreasedItems: decreased.length,
      discontinuedItems: discontinued.length,
      potentialSavings: increased.reduce((acc, item) => acc + (item.potentialImpact || 0), 0),
      potentialLoss: discontinued.reduce((acc, item) => acc + (item.potentialImpact || 0), 0),
    };
  };

  const summary = getAnalysisSummary();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4 animate-fade-up">
        <h1 className="text-4xl font-bold tracking-tight">Supplier Price Watch</h1>
        <p className="text-lg text-muted-foreground">
          Upload your supplier price list to analyze changes and potential impacts
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <FileUpload onFileAccepted={handleFileAccepted} />
      </div>

      {isProcessing && (
        <div className="text-center text-muted-foreground">
          Processing file...
        </div>
      )}

      {items.length > 0 && (
        <>
          <AnalysisSummary {...summary} />
          <PriceTable items={items} />
        </>
      )}
    </div>
  );
};

export default Index;
