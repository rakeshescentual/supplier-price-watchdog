
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart2, Globe, Mail, Bell, CalendarClock } from "lucide-react";
import { AnalysisTabContent } from "./AnalysisTabContent";
import { MarketTabContent } from "./MarketTabContent";
import { SupplierCorrespondence } from "@/components/supplier/SupplierCorrespondence";
import { NotificationsTabContent } from "./NotificationsTabContent";
import { GoogleTabContent } from "./GoogleTabContent";
import { useState } from "react";

export const IndexTabs = () => {
  const [currentTab, setCurrentTab] = useState("analysis");
  
  return (
    <Tabs defaultValue="analysis" className="mt-8" onValueChange={setCurrentTab} value={currentTab}>
      <TabsList className="w-full max-w-2xl mx-auto mb-4 flex flex-wrap sm:flex-nowrap">
        <TabsTrigger value="analysis" className="flex-1">
          <FileBarChart2 className="w-4 h-4 mr-2" />
          Analysis
        </TabsTrigger>
        <TabsTrigger value="market" className="flex-1">
          <Globe className="w-4 h-4 mr-2" />
          Market Data
        </TabsTrigger>
        <TabsTrigger value="communication" className="flex-1">
          <Mail className="w-4 h-4 mr-2" />
          Communication
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex-1">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="google" className="flex-1">
          <CalendarClock className="w-4 h-4 mr-2" />
          Google
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="analysis">
        <AnalysisTabContent />
      </TabsContent>
      
      <TabsContent value="market">
        <MarketTabContent />
      </TabsContent>
      
      <TabsContent value="communication">
        <SupplierCorrespondence />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTabContent />
      </TabsContent>
      
      <TabsContent value="google">
        <GoogleTabContent />
      </TabsContent>
    </Tabs>
  );
};
