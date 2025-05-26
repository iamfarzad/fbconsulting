
import React from 'react';

interface MetadataDisplayProps {
  currentPage: string | undefined;
  lastUpdated: string | undefined;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({
  currentPage,
  lastUpdated
}) => {
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-6">
      <p>Current page: {currentPage || '(not set)'}</p>
      <p>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}</p>
    </div>
  );
};
