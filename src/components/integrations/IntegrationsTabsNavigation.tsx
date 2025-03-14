
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellRing, Cog, Mail, Share2, ShoppingBag } from "lucide-react";

interface IntegrationsTabsNavigationProps {
  activeTab: string;
}

export const IntegrationsTabsNavigation: React.FC<IntegrationsTabsNavigationProps> = ({ activeTab }) => {
  return (
    <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-5">
      <TabsTrigger value="marketing" className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Marketing</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <BellRing className="h-4 w-4" />
        <span className="hidden sm:inline">Alerts</span>
      </TabsTrigger>
      <TabsTrigger value="klaviyo" className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Klaviyo</span>
      </TabsTrigger>
      <TabsTrigger value="gadget" className="flex items-center gap-2">
        <Cog className="h-4 w-4" />
        <span className="hidden sm:inline">Gadget</span>
      </TabsTrigger>
      <TabsTrigger value="shopify" className="flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        <span className="hidden sm:inline">Shopify</span>
      </TabsTrigger>
    </TabsList>
  );
};
