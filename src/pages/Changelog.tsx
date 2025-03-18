
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
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">Version History & Changelog</h1>
        <p className="text-muted-foreground mb-8">
          View the complete history of Supplier Price Watch versions and updates, including features, improvements, and bug fixes.
        </p>
        <Changelog />
      </div>
    </DocumentationLayout>
  );
};

export default ChangelogPage;
