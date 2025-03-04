
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface AnalysisHistoryItem {
  id: string;
  date: string;
  fileName: string;
  itemCount: number;
  summary: { 
    increasedItems: number; 
    decreasedItems: number;
  };
}

export interface NewAnalysis {
  fileName: string;
  itemCount: number;
  summary: { 
    increasedItems: number; 
    decreasedItems: number;
  };
}

export const useAnalysisHistory = () => {
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisHistoryItem[]>([]);

  // Load saved analyses from localStorage on component mount
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

  const saveAnalysis = (analysis: NewAnalysis) => {
    const newAnalysis = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...analysis
    };
    
    const updatedAnalyses = [newAnalysis, ...savedAnalyses].slice(0, 10); // Keep last 10 analyses
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

  const clearHistory = () => {
    setSavedAnalyses([]);
    localStorage.removeItem('analysisHistory');
    toast.success('Analysis history cleared');
  };

  return { 
    savedAnalyses, 
    saveAnalysis,
    clearHistory
  };
};
