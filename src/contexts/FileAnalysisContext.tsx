
// Compatibility file to maintain backward compatibility
// Re-exports from the new structure
export { 
  FileAnalysisProvider,
  useFileAnalysis
} from './fileAnalysis';

export type { 
  FileAnalysisContextValue,
  AnalysisSummary 
} from './fileAnalysis/types';
