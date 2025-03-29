
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import HelpButton from '@/components/documentation/HelpButton';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="relative">
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
