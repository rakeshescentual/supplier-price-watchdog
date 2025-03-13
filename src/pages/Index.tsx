
import { ShopifyProvider } from "@/contexts/shopify";
import { FileAnalysisProvider } from "@/contexts/FileAnalysisContext";
import { IndexContent } from "@/components/index/IndexContent";

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
