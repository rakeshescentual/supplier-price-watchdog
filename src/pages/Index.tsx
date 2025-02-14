
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { toast } from "sonner";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileAccepted = (acceptedFile: File) => {
    setFile(acceptedFile);
    toast.success("File uploaded successfully", {
      description: "Analyzing price changes...",
    });
    
    // TODO: Implement actual file processing and Shopify API integration
  };

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

      {file && (
        <AnalysisSummary
          increasedItems={12}
          decreasedItems={8}
          discontinuedItems={3}
          potentialSavings={15000}
          potentialLoss={8500}
        />
      )}
    </div>
  );
};

export default Index;
