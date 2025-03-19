
import React from "react";
import { NavigationSidebar } from "@/components/NavigationSidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background h-14 flex items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Escentual Price Manager</span>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <NavigationSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
