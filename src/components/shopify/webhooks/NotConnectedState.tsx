
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function NotConnectedState() {
  return (
    <Alert variant="default" className="bg-muted/20">
      <Link className="h-4 w-4" />
      <AlertTitle>Not connected to Shopify</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Connect to Shopify to manage webhook notifications</p>
        <div className="not-prose mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="flex items-center gap-1.5"
          >
            <a href="https://shopify.dev/docs/apps/webhooks" target="_blank" rel="noreferrer">
              <Link className="h-3.5 w-3.5" />
              Shopify Webhook Documentation
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
