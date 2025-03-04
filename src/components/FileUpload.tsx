
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileUp, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

export const FileUpload = ({ onFileAccepted }: { onFileAccepted: (file: File) => void }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<"excel" | "pdf" | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadProgress(0);
      
      // Determine file type
      if (file.type === "application/pdf") {
        setFileType("pdf");
      } else {
        setFileType("excel");
      }
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onFileAccepted(file);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
  });

  return (
    <Card
      className={`p-8 transition-all duration-300 ${
        isDragging
          ? "border-primary border-2 bg-accent/50"
          : "border-dashed border-2 hover:border-primary/50"
      }`}
    >
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center gap-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="p-4 rounded-full bg-primary/10">
          {uploadProgress === 0 ? (
            <Upload className="w-8 h-8 text-primary" />
          ) : fileType === "pdf" ? (
            <FileText className="w-8 h-8 text-primary" />
          ) : (
            <FileUp className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Drop your supplier price list here</h3>
          <p className="text-sm text-muted-foreground">
            or click to select file (.xlsx, .xls, .pdf)
          </p>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full max-w-xs">
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  );
};
