
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useShopify } from "@/contexts/ShopifyContext";
import { cn } from "@/lib/utils";
import { MenuIcon, HomeIcon, BarChart2, FileText, Settings, ShoppingCart, Cog, Check, FileSpreadsheet, ArrowUpRight, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const { isShopifyConnected } = useShopify();
  const location = useLocation();
  const { isMobile } = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);
  
  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: HomeIcon,
      current: location.pathname === "/"
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart2,
      current: location.pathname === "/dashboard"
    },
    {
      name: "Integrations",
      href: "/integrations",
      icon: Share2,
      current: location.pathname === "/integrations"
    },
    {
      name: "Documentation",
      href: "/documentation",
      icon: FileText,
      current: location.pathname === "/documentation"
    }
  ];
  
  const NavItems = () => (
    <div className="flex flex-col gap-2">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
            item.current
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
      
      <Separator className="my-2" />
      
      <Link
        to={isShopifyConnected ? "/gadget-settings" : "#"}
        onClick={(e) => {
          if (!isShopifyConnected) {
            e.preventDefault();
            // Show notification about needing to connect Shopify first
          }
        }}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
          location.pathname === "/gadget-settings"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted"
        )}
      >
        <Cog className="h-4 w-4" />
        Gadget Settings
      </Link>
    </div>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">Price Watch</span>
          </Link>
          
          <div className="hidden md:flex">
            <nav className="flex items-center gap-1 text-sm">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 font-medium",
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          {isShopifyConnected && (
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Shopify Connected</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex"
            asChild
          >
            <a
              href="https://github.com/rakeshescentual/supplier-price-watchdog" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
          
          {isMobile && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="px-2 py-6">
                  <Link to="/" className="flex items-center gap-2 mb-6 px-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <span className="font-semibold tracking-tight">Price Watch</span>
                  </Link>
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};
