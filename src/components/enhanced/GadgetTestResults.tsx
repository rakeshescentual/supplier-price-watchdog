
import React from 'react';
import { GadgetTestResult, TestResult } from './GadgetTestResult';

interface GadgetTestResultsProps {
  results: TestResult[];
}

export function GadgetTestResults({ results }: GadgetTestResultsProps) {
  if (results.length === 0) return null;
  
  return (
    <div className="space-y-3">
      {results.map((result, index) => (
        <GadgetTestResult key={index} result={result} />
      ))}
    </div>
  );
}
