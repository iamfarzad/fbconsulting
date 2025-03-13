
import React, { useState } from 'react';

interface LinkedInLookupFormProps {
  onSubmit: (profileUrl: string) => void;
  isLoading: boolean;
}

export const LinkedInLookupForm: React.FC<LinkedInLookupFormProps> = ({ onSubmit, isLoading }) => {
  const [linkedInUrl, setLinkedInUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkedInUrl) {
      onSubmit(linkedInUrl);
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
      <h3 className="font-medium mb-3">LinkedIn Lookup</h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
          placeholder="LinkedIn Profile URL"
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition-opacity"
          disabled={isLoading || !linkedInUrl}
        >
          Lookup
        </button>
      </form>
    </div>
  );
};
