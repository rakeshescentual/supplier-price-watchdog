
import { createContext, useContext, ReactNode } from "react";
import { useFileProcessing } from "./hooks/useFileProcessing";
import { useAnalysisState } from "./hooks/useAnalysisState";
import { useFileExport } from "./hooks/useFileExport";
import { useAnalysisSummary } from "./hooks/useAnalysisSummary";
import type { FileAnalysisContextValue } from "./types";

const FileAnalysisContext = createContext<FileAnalysisContextValue | undefined>(undefined);

interface FileAnalysisProviderProps {
  children: ReactNode;
}

export const FileAnalysisProvider = ({ children }: FileAnalysisProviderProps) => {
  const processingState = useFileProcessing();
  const analysisState = useAnalysisState(processingState.items, processingState.setItems);
  const exportHandler = useFileExport(processingState.items);
  const summary = useAnalysisSummary(processingState.items);

  const value: FileAnalysisContextValue = {
    ...processingState,
    ...analysisState,
    ...exportHandler,
    summary,
  };

  return (
    <FileAnalysisContext.Provider value={value}>
      {children}
    </FileAnalysisContext.Provider>
  );
};

export const useFileAnalysis = (): FileAnalysisContextValue => {
  const context = useContext(FileAnalysisContext);
  if (context === undefined) {
    throw new Error("useFileAnalysis must be used within a FileAnalysisProvider");
  }
  return context;
};
