
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import HelpButton from '@/components/documentation/HelpButton';
import { ShopifyApiVersionManager } from '@/components/shopify/ShopifyApiVersionManager';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showApiManager, setShowApiManager] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onApiManagerToggle={() => setShowApiManager(prev => !prev)}
        showApiManager={showApiManager} 
      />
      <div className="flex">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="relative">
            {showApiManager && (
              <div className="p-4">
                <ShopifyApiVersionManager />
              </div>
            )}
            <Outlet />
            <div className="fixed bottom-6 right-6">
              <HelpButton />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
