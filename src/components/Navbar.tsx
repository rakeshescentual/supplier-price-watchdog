
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Settings, Bell, GitBranch } from 'lucide-react';
import { useShopify } from '@/contexts/shopify';
import { getShopifyApiVersion } from '@/lib/shopify/client';
import { isGraphQLOnlyVersion } from '@/lib/shopify/api-version';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onApiManagerToggle?: () => void;
  showApiManager?: boolean;
}

const Navbar = ({ sidebarOpen, setSidebarOpen, onApiManagerToggle, showApiManager }: NavbarProps) => {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const currentApiVersion = getShopifyApiVersion();
  const isGraphQLReady = isGraphQLOnlyVersion(currentApiVersion);

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Button
          variant="ghost"
          className="mr-4 flex lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
            <span>EscentPriceManager</span>
          </Link>
          
          {isShopifyConnected && (
            <Badge variant="outline" className="ml-2 hidden md:flex">
              Connected to {shopifyContext?.shop}
            </Badge>
          )}
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          {isShopifyConnected && (
            <Button
              variant={showApiManager ? "secondary" : "ghost"}
              size="sm"
              className="hidden md:flex items-center gap-1"
              onClick={onApiManagerToggle}
            >
              <GitBranch className="h-4 w-4" />
              API
              <Badge 
                variant={isGraphQLReady ? "success" : "outline"}
                className={`ml-1 text-xs ${isGraphQLReady ? "bg-green-100 text-green-800" : ""}`}
              >
                {currentApiVersion}
              </Badge>
            </Button>
          )}
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
