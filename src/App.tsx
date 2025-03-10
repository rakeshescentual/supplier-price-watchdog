
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ShopifyProvider } from "./contexts/ShopifyContext";
import { FileAnalysisProvider } from "./contexts/FileAnalysisContext";
import { Navigation } from "./components/layout/Navigation";
import { shopifyCache, gadgetCache } from "./lib/api-cache";

// Lazy-loaded routes for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Integrations = lazy(() => import("./pages/Integrations"));
const GadgetDocumentation = lazy(() => import("./pages/GadgetDocumentation"));
const CompetitorAnalysis = lazy(() => import("./pages/CompetitorAnalysis"));
const GadgetConfigForm = lazy(() => import("./components/GadgetConfigForm"));
const GadgetMigration = lazy(() => import("./pages/GadgetMigration"));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetching on window focus for better performance
      refetchOnReconnect: true,    // Only refetch on reconnect
      gcTime: 1000 * 60 * 10,     // Keep unused data in cache for 10 minutes
    },
  },
});

const App = () => {
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Clean up cache resources
      shopifyCache.destroy();
      gadgetCache.destroy();
    };
  }, []);

  // Simple loading component for better UX during suspense
  const LoadingFallback = () => (
    <div className="container mx-auto py-8 px-4 flex items-center justify-center h-[calc(100vh-4rem)]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ShopifyProvider>
        <FileAnalysisProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navigation />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/documentation" element={<Documentation />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
                  <Route path="/gadget-settings" element={<div className="container mx-auto py-8 px-4"><div className="max-w-lg mx-auto"><GadgetConfigForm /></div></div>} />
                  <Route path="/gadget-documentation" element={<GadgetDocumentation />} />
                  <Route path="/gadget-migration" element={<GadgetMigration />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </FileAnalysisProvider>
      </ShopifyProvider>
    </QueryClientProvider>
  );
};

export default App;
