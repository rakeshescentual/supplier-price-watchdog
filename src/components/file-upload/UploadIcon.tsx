
import { Upload, FileUp, FileText, Check } from "lucide-react";

interface UploadIconProps {
  progress: number;
  uploadComplete: boolean;
  fileType: "excel" | "pdf" | null;
}

export const UploadIcon = ({ progress, uploadComplete, fileType }: UploadIconProps) => {
  const className = "w-8 h-8";
  
  if (uploadComplete) {
    return <Check className={`${className} text-green-500`} />;
  }
  
  if (progress === 0) {
    return <Upload className={`${className} text-primary`} />;
  }
  
  if (fileType === "pdf") {
    return <FileText className={`${className} text-primary`} />;
  }
  
  return <FileUp className={`${className} text-primary`} />;
};
