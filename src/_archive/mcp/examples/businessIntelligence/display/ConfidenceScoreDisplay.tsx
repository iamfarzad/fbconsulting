
import React from 'react';

interface ConfidenceScoreDisplayProps {
  confidenceScore?: number;
  lastUpdated?: string;
}

export const ConfidenceScoreDisplay: React.FC<ConfidenceScoreDisplayProps> = ({ 
  confidenceScore, 
  lastUpdated 
}) => {
  const scorePercentage = Math.round((confidenceScore || 0) * 100);
  
  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm">
        <span>Data confidence:</span>
        <span>{scorePercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-1">
        <div 
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${scorePercentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
      </div>
    </div>
  );
};
