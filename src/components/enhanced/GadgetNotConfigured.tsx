
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function GadgetNotConfigured() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Not Configured</AlertTitle>
      <AlertDescription>
        Gadget.dev integration is not configured. Please configure it before running tests.
      </AlertDescription>
    </Alert>
  );
}
