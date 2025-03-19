
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileSpreadsheet,
  Globe,
  Home,
  Layers,
  Mail,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
  Zap
} from "lucide-react";

const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Shopify Integration",
    href: "/shopify",
    icon: ShoppingBag,
  },
  {
    title: "Market Analysis",
    href: "/market-analysis",
    icon: PieChart,
  },
  {
    title: "Competitor Monitoring",
    href: "/competitor-monitoring",
    icon: Globe,
  },
  {
    title: "Supplier Correspondence",
    href: "/supplier-correspondence",
    icon: Mail,
  },
  {
    title: "File Analysis",
    href: "/file-analysis",
    icon: FileSpreadsheet,
  }
];

const adminNavItems = [
  {
    title: "Team Management",
    href: "/team",
    icon: Users,
  },
  {
    title: "Gadget Integration",
    href: "/gadget-integration",
    icon: Zap,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  }
];

export function NavigationSidebar() {
  const location = useLocation();
  
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block overflow-y-auto border-r">
      <div className="py-6 pr-2 lg:py-8">
        <div className="px-4 space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
        
        <div className="px-4 mt-8">
          <h4 className="px-2 mb-2 text-xs font-semibold tracking-tight text-muted-foreground">
            Administration
          </h4>
          <div className="space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
