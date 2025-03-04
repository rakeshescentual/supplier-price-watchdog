
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileUp, FileText, Share, Check } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const FileUpload = ({ 
  onFileAccepted,
  allowedFileTypes = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/pdf': ['.pdf']
  }
}: { 
  onFileAccepted: (file: File) => void;
  allowedFileTypes?: Record<string, string[]>;
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<"excel" | "pdf" | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadProgress(0);
      setUploadComplete(false);
      setFileName(file.name);
      
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
            setUploadComplete(true);
            onFileAccepted(file);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: allowedFileTypes,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Supplier Price Watch',
        text: 'Check out this tool for analyzing supplier price changes!',
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully"))
      .catch((error) => toast.error("Error sharing", { description: error.message }));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  return (
    <Card
      className={`p-8 transition-all duration-300 ${
        isDragging
          ? "border-primary border-2 bg-accent/50"
          : uploadComplete 
            ? "border-green-500 border-2" 
            : "border-dashed border-2 hover:border-primary/50"
      }`}
    >
      <div className="flex justify-end mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={handleShare}
        >
          <Share className="w-4 h-4 mr-1" /> Share
        </Button>
      </div>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center gap-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className={`p-4 rounded-full ${uploadComplete ? "bg-green-100" : "bg-primary/10"}`}>
          {uploadProgress === 0 && !uploadComplete ? (
            <Upload className="w-8 h-8 text-primary" />
          ) : uploadComplete ? (
            <Check className="w-8 h-8 text-green-500" />
          ) : fileType === "pdf" ? (
            <FileText className="w-8 h-8 text-primary" />
          ) : (
            <FileUp className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="text-center">
          {uploadComplete && fileName ? (
            <>
              <h3 className="text-lg font-semibold">Upload complete</h3>
              <p className="text-sm text-muted-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground mt-2">Click or drag to upload another file</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">Drop your supplier price list here</h3>
              <p className="text-sm text-muted-foreground">
                or click to select file (.xlsx, .xls, .pdf)
              </p>
            </>
          )}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full max-w-xs">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground mt-1">
              Uploading{fileName ? ` ${fileName}` : ''}...
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={open}
          className="text-sm"
        >
          Select file
        </Button>
      </div>
    </Card>
  );
};
