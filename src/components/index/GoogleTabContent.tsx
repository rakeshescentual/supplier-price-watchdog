
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GoogleShopifyAuth } from "@/components/auth/GoogleShopifyAuth";
import { GmailIntegration } from "@/components/gmail/GmailIntegration";
import { GoogleCalendarIntegration } from "@/components/calendar/GoogleCalendarIntegration";
import { Info, Share2, ArrowUpRight } from "lucide-react";

export const GoogleTabContent = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <GoogleShopifyAuth />
        </div>
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GmailIntegration />
            <GoogleCalendarIntegration />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
        <Info className="h-4 w-4 text-blue-500" />
        <p>
          Use Google Workspace integration to send email notifications about price changes and create calendar reminders for when the new prices take effect.
        </p>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button variant="outline" asChild>
          <Link to="/integrations" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Advanced Marketing Integrations
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
};
