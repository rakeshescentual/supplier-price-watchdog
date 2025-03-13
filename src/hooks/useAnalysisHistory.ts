
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AnalysisSummary {
  increasedItems: number;
  decreasedItems: number;
}

interface Analysis {
  fileName: string;
  itemCount: number;
  summary: AnalysisSummary;
}

interface SavedAnalysis extends Analysis {
  id: string;
  date: string;
}

export const useAnalysisHistory = () => {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('analysisHistory');
      if (savedData) {
        setSavedAnalyses(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading analysis history:', error);
    }
  }, []);

  const saveAnalysis = (analysis: Analysis) => {
    const newAnalysis = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...analysis
    };
    
    const updatedAnalyses = [newAnalysis, ...savedAnalyses].slice(0, 10);
    setSavedAnalyses(updatedAnalyses);
    
    try {
      localStorage.setItem('analysisHistory', JSON.stringify(updatedAnalyses));
      toast.success('Analysis saved to history', {
        description: 'You can access previous analyses in your browser storage.'
      });
    } catch (error) {
      console.error('Error saving analysis history:', error);
    }
  };

  return { savedAnalyses, saveAnalysis };
};
