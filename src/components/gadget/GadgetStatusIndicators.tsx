
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: "healthy" | "degraded" | "down";
}

export const GadgetStatusIcon = ({ status }: StatusIndicatorProps) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "degraded":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "down":
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

export const GadgetStatusBadge = ({ status }: StatusIndicatorProps) => {
  switch (status) {
    case "healthy":
      return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>;
    case "degraded":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Degraded</Badge>;
    case "down":
      return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Down</Badge>;
  }
};
