import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { FileAnalysisProvider } from './contexts/FileAnalysisContext';
import { ShopifyProvider } from './contexts/shopify';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Pricing from './pages/Pricing';
import Competitive from './pages/Competitive';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { ShopifyIntegrationDashboard } from './components/ShopifyIntegrationDashboard';
import Documentation from './pages/Documentation';
import ErrorBoundary from './components/ErrorBoundary';
import { shopifyApiVersionManager } from './lib/shopify/apiVersionManager';
import { useOfflineDetection } from './hooks/useOfflineDetection';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isOffline = useOfflineDetection();
  
  // Initialize shopify API version manager
  useEffect(() => {
    // Initialize the API version manager on app start
    shopifyApiVersionManager.init();
    
    // Check for updates periodically
    const checkInterval = setInterval(() => {
      // Using public methods only
      shopifyApiVersionManager.init();
    }, 24 * 60 * 60 * 1000); // Check once a day
    
    return () => clearInterval(checkInterval);
  }, []);
  
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="escentual-theme">
        <Router>
          <ShopifyProvider>
            <FileAnalysisProvider>
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                  
                  {isOffline && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm text-center">
                      You are currently offline. Some features may be unavailable.
                    </div>
                  )}
                  
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/analysis" element={<Analysis />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/competitive" element={<Competitive />} />
                      <Route path="/integrations" element={<Integrations />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/documentation" element={<Documentation />} />
                      <Route path="/shopify" element={<ShopifyIntegrationDashboard />} />
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
              
              <Toaster position="top-right" closeButton={true} />
            </FileAnalysisProvider>
          </ShopifyProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
