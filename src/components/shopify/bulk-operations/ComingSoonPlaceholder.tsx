
import React from "react";
import { AlertTriangle } from "lucide-react";

export function ComingSoonPlaceholder() {
  return (
    <div className="flex items-center justify-center p-12 text-center">
      <div>
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Feature Coming Soon</h3>
        <p className="text-muted-foreground max-w-md">
          Bulk inventory updates will be available in an upcoming release.
        </p>
      </div>
    </div>
  );
}
