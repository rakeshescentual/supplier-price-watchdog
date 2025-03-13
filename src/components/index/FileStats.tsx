
import { RefreshCw, FileUp, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { useShopify } from "@/contexts/shopify";

export const FileStats = () => {
  const { file, items, exportForShopify } = useFileAnalysis();
  const { isShopifyConnected, isSyncing, syncToShopify } = useShopify();
  
  if (!file) return null;
  
  const handleSync = async () => {
    if (items.length > 0) {
      await syncToShopify(items);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 bg-muted p-3 rounded-md">
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
      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 justify-center sm:justify-end w-full sm:w-auto">
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
  );
};
