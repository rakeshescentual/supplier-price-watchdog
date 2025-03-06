
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import Integrations from "./pages/Integrations";
import GadgetDocumentation from "./pages/GadgetDocumentation";
import { ShopifyProvider } from "./contexts/ShopifyContext";
import { FileAnalysisProvider } from "./contexts/FileAnalysisContext";
import { GadgetConfigForm } from "./components/GadgetConfigForm";
import { Navigation } from "./components/layout/Navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ShopifyProvider>
      <FileAnalysisProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/gadget-settings" element={<div className="container mx-auto py-8 px-4"><div className="max-w-lg mx-auto"><GadgetConfigForm /></div></div>} />
              <Route path="/gadget-documentation" element={<GadgetDocumentation />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FileAnalysisProvider>
    </ShopifyProvider>
  </QueryClientProvider>
);

export default App;
