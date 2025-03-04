
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BarChart2, Settings, Home, Menu, X } from "lucide-react";
import { useShopify } from "@/contexts/ShopifyContext";

export const Navigation = () => {
  const location = useLocation();
  const { isShopifyConnected, isGadgetInitialized } = useShopify();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { path: '/gadget-settings', label: 'Gadget Settings', icon: <Settings className="h-4 w-4 mr-2" /> }
  ];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-md p-1">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-lg">PriceWatch</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={item.path} className="flex items-center">
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {isShopifyConnected && (
                <div className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                  Shopify
                </div>
              )}
              
              {isGadgetInitialized && (
                <div className="flex items-center text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1"></span>
                  Gadget
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium
                  ${location.pathname === item.path 
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
