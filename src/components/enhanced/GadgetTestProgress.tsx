
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface GadgetTestProgressProps {
  progress: number;
  isRunning: boolean;
}

export function GadgetTestProgress({ progress, isRunning }: GadgetTestProgressProps) {
  if (!isRunning) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>Running tests...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
