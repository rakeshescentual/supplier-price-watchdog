
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import gadgetIntegrationGuide from '../assets/docs/Gadget_Integration_Guide.md?raw';
import technicalDocumentation from '../assets/docs/TechnicalDocumentation.md?raw';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState<string>("technical");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      
      <Tabs defaultValue="technical" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="technical">Technical Documentation</TabsTrigger>
          <TabsTrigger value="gadget">Gadget.dev Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="technical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Documentation</CardTitle>
              <CardDescription>
                Complete technical overview of the Supplier Price Watch application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[70vh] w-full pr-4">
                <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                  {technicalDocumentation}
                </ReactMarkdown>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gadget" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gadget.dev Integration Guide</CardTitle>
              <CardDescription>
                Detailed guide on how Gadget.dev is integrated into the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[70vh] w-full pr-4">
                <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                  {gadgetIntegrationGuide}
                </ReactMarkdown>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
