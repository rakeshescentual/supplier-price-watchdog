
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { IndexContent } from "@/components/index/IndexContent";
import { ShopifyIntegrationDashboard } from "@/components/ShopifyIntegrationDashboard";
import { FileAnalysisProvider } from "@/contexts/FileAnalysisContext";
import { ShopifyProvider } from "@/contexts/shopify";
import { Layout } from "@/components/Layout";
import { MarketAnalysisDashboard } from "@/components/ai-market-insights/MarketAnalysisDashboard";
import { CompetitorPriceMonitor } from "@/components/competitor-monitoring/CompetitorPriceMonitor";
import { GadgetIntegrationPanel } from "@/components/gadget/GadgetIntegrationPanel";
import { SupplierCorrespondenceManager } from "@/components/supplier/SupplierCorrespondenceManager";

export function App() {
  return (
    <Router>
      <ShopifyProvider>
        <FileAnalysisProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<IndexContent />} />
              <Route path="/shopify" element={<ShopifyIntegrationDashboard />} />
              <Route path="/market-analysis" element={<MarketAnalysisDashboard competitorItems={[]} />} />
              <Route path="/competitor-monitoring" element={<CompetitorPriceMonitor />} />
              <Route path="/gadget-integration" element={<GadgetIntegrationPanel />} />
              <Route path="/supplier-correspondence" element={<SupplierCorrespondenceManager />} />
            </Routes>
          </Layout>
        </FileAnalysisProvider>
      </ShopifyProvider>
    </Router>
  );
}

export default App;
