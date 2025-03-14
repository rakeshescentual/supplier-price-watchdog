
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquareText, Store, BellRing, Smartphone } from "lucide-react";

type Channel = 'email' | 'sms' | 'push' | 'app' | 'website';

interface NotificationChannelsProps {
  selectedChannels: Record<Channel, boolean>;
  onToggleChannel: (channel: Channel) => void;
}

export const NotificationChannels = ({ 
  selectedChannels, 
  onToggleChannel 
}: NotificationChannelsProps) => {
  const selectedChannelCount = Object.values(selectedChannels).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Notification Channels</h3>
        <span className="text-xs text-muted-foreground">{selectedChannelCount} selected</span>
      </div>
      
      <div className="grid gap-2">
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <div className="flex-none">
            <Switch 
              id="channel-email"
              checked={selectedChannels.email}
              onCheckedChange={() => onToggleChannel('email')}
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <Label htmlFor="channel-email" className="font-medium cursor-pointer">Email</Label>
              <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs py-0 px-1">Recommended</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Send price change emails to customers who purchased these items
            </p>
          </div>
          <div className="flex-none">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <div className="flex-none">
            <Switch 
              id="channel-sms"
              checked={selectedChannels.sms}
              onCheckedChange={() => onToggleChannel('sms')}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="channel-sms" className="font-medium cursor-pointer">SMS</Label>
            <p className="text-xs text-muted-foreground">
              Send text messages about price changes (requires phone numbers)
            </p>
          </div>
          <div className="flex-none">
            <MessageSquareText className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <div className="flex-none">
            <Switch 
              id="channel-website"
              checked={selectedChannels.website}
              onCheckedChange={() => onToggleChannel('website')}
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <Label htmlFor="channel-website" className="font-medium cursor-pointer">Website</Label>
              <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs py-0 px-1">Recommended</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Display banners on product pages before price increases
            </p>
          </div>
          <div className="flex-none">
            <Store className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <div className="flex-none">
            <Switch 
              id="channel-app"
              checked={selectedChannels.app}
              onCheckedChange={() => onToggleChannel('app')}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="channel-app" className="font-medium cursor-pointer">Mobile App</Label>
            <p className="text-xs text-muted-foreground">
              Send in-app notifications about price changes
            </p>
          </div>
          <div className="flex-none">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <div className="flex-none">
            <Switch 
              id="channel-push"
              checked={selectedChannels.push}
              onCheckedChange={() => onToggleChannel('push')}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="channel-push" className="font-medium cursor-pointer">Push Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Send browser push notifications to subscribed users
            </p>
          </div>
          <div className="flex-none">
            <BellRing className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};
