
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize shopify API version manager - we would normally do this in an app initializer
  // but for simplicity we're calling it here
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="escentual-theme">
      <Router>
        <ShopifyProvider>
          <FileAnalysisProvider>
            <div className="flex h-screen overflow-hidden bg-background">
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
              
              <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
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
  );
}

export default App;
