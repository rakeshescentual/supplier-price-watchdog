
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Save, Upload, Store, Zap, Bell, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <SettingsIcon className="h-6 w-6 mr-2" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your application preferences and integration settings
          </p>
        </div>
        
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <Alert className="mb-6">
        <AlertDescription>
          Changes to settings will affect how the application processes data and integrates with external services.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex flex-col h-auto items-stretch space-y-1">
                <TabsTrigger value="general" className="justify-start">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="upload" className="justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="shopify" className="justify-start">
                  <Store className="h-4 w-4 mr-2" />
                  Shopify Integration
                </TabsTrigger>
                <TabsTrigger value="gadget" className="justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Gadget.dev Integration
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="team" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team Access
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          <TabsContent value="general" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your application's basic settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="Escentual" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-currency">Default Currency</Label>
                      <Select defaultValue="gbp">
                        <SelectTrigger id="default-currency">
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Application Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme-preference">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark mode for the application interface
                      </p>
                    </div>
                    <Switch id="theme-preference" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-refresh">Auto-refresh Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh dashboard data every 30 minutes
                      </p>
                    </div>
                    <Switch id="auto-refresh" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm" onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>File Upload Settings</CardTitle>
                <CardDescription>
                  Configure how supplier price lists are processed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">File Processing</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-process">Automatic Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically process files upon upload
                      </p>
                    </div>
                    <Switch id="auto-process" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="save-history">Save Analysis History</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep a record of all price list analyses
                      </p>
                    </div>
                    <Switch id="save-history" defaultChecked />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Allowed File Types</h3>
                  <p className="text-sm text-muted-foreground">
                    Select which file types can be uploaded and processed
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="allow-xlsx" defaultChecked />
                      <Label htmlFor="allow-xlsx">Excel (.xlsx, .xls)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="allow-csv" defaultChecked />
                      <Label htmlFor="allow-csv">CSV (.csv)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="allow-pdf" defaultChecked />
                      <Label htmlFor="allow-pdf">PDF (.pdf)</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm" onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="shopify" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Shopify Integration</CardTitle>
                <CardDescription>
                  Configure your Shopify store connection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Connect your Shopify store to synchronize product data and price updates.
                  </p>
                  
                  <Button variant="outline" className="w-full md:w-auto">
                    <Store className="h-4 w-4 mr-2" />
                    Connect Shopify Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gadget" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Gadget.dev Integration</CardTitle>
                <CardDescription>
                  Configure Gadget.dev for enhanced functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Connect to Gadget.dev for improved PDF processing and batch operations.
                  </p>
                  
                  <Button variant="outline" className="w-full md:w-auto">
                    <Zap className="h-4 w-4 mr-2" />
                    Configure Gadget.dev Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="price-increase-alerts">Price Increase Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for significant price increases
                      </p>
                    </div>
                    <Switch id="price-increase-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-analysis-alerts">Analysis Completion</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a new price list analysis is completed
                      </p>
                    </div>
                    <Switch id="new-analysis-alerts" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm" onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all team members
                      </p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <Select defaultValue="60">
                      <SelectTrigger id="session-timeout" className="w-[180px]">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm" onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Team Access</CardTitle>
                <CardDescription>
                  Manage team members and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Team Member
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Manage your team's access and permissions from this section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default Settings;
