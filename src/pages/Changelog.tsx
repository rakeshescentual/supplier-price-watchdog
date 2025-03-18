
import React, { useEffect } from "react";
import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";
import { Changelog } from "@/components/documentation/Changelog";
import { toast } from "sonner";

const ChangelogPage = () => {
  useEffect(() => {
    toast.info("Changelog", {
      description: "Browse feature and version history."
    });
  }, []);
  
  return (
    <DocumentationLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Version History & Changelog</h1>
        <p className="text-muted-foreground mb-6">
          View the complete history of Supplier Price Watch versions and updates, including features, improvements, and bug fixes.
        </p>
        <Changelog />
      </div>
    </DocumentationLayout>
  );
};

export default ChangelogPage;
