
import { Link } from "react-router-dom";
import { LayoutDashboard, BarChartBig, PieChart, LineChart, ArrowDownUp, Droplet, Settings, Zap, Store, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="hidden border-r bg-card md:block md:w-64 lg:w-72">
        <ScrollArea className="h-full py-6">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Escentual Price Watch
            </h2>
            <div className="space-y-1">
              <NavItem href="/" icon={<LayoutDashboard className="mr-2 h-4 w-4" />}>
                Dashboard
              </NavItem>
              <NavItem href="/analysis" icon={<BarChartBig className="mr-2 h-4 w-4" />}>
                Analysis
              </NavItem>
              <NavItem href="/pricing" icon={<ArrowDownUp className="mr-2 h-4 w-4" />}>
                Pricing
              </NavItem>
              <NavItem href="/competitive" icon={<LineChart className="mr-2 h-4 w-4" />}>
                Competitive
              </NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Integrations
            </h2>
            <div className="space-y-1">
              <NavItem href="/integrations" icon={<PieChart className="mr-2 h-4 w-4" />}>
                Overview
              </NavItem>
              <NavItem href="/shopify" icon={<Store className="mr-2 h-4 w-4" />}>
                Shopify
              </NavItem>
              <NavItem href="/documentation" icon={<BookOpen className="mr-2 h-4 w-4" />}>
                Documentation
              </NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Fragrance Tools
            </h2>
            <div className="space-y-1">
              <NavItem href="#" icon={<Droplet className="mr-2 h-4 w-4" />}>
                Catalogue Manager
              </NavItem>
              <NavItem href="#" icon={<Zap className="mr-2 h-4 w-4" />}>
                Promotions
              </NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="space-y-1">
              <NavItem href="/settings" icon={<Settings className="mr-2 h-4 w-4" />}>
                Settings
              </NavItem>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Mobile sidebar */}
      <SheetContent side="left" className="w-64 sm:max-w-full" onOpenAutoFocus={e => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Escentual Price Watch</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full py-6">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
            <div className="space-y-1">
              <NavItem href="/" icon={<LayoutDashboard className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Dashboard
              </NavItem>
              <NavItem href="/analysis" icon={<BarChartBig className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Analysis
              </NavItem>
              <NavItem href="/pricing" icon={<ArrowDownUp className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Pricing
              </NavItem>
              <NavItem href="/competitive" icon={<LineChart className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Competitive
              </NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Integrations
            </h2>
            <div className="space-y-1">
              <NavItem href="/integrations" icon={<PieChart className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Overview
              </NavItem>
              <NavItem href="/shopify" icon={<Store className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Shopify
              </NavItem>
              <NavItem href="/documentation" icon={<BookOpen className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Documentation
              </NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Fragrance Tools
            </h2>
            <div className="space-y-1">
              <NavItem href="#" icon={<Droplet className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Catalogue Manager
              </NavItem>
              <NavItem href="#" icon={<Zap className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Promotions
              </NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="space-y-1">
              <NavItem href="/settings" icon={<Settings className="mr-2 h-4 w-4" />} onClick={handleClose}>
                Settings
              </NavItem>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavItem({ href, icon, children, onClick }: NavItemProps) {
  return (
    <Button variant="ghost" className="w-full justify-start" asChild>
      <Link to={href} onClick={onClick}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}
