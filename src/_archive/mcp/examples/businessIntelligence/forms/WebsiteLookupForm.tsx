
import React, { useState } from 'react';

interface WebsiteLookupFormProps {
  onSubmit: (websiteUrl: string) => void;
  isLoading: boolean;
}

export const WebsiteLookupForm: React.FC<WebsiteLookupFormProps> = ({ onSubmit, isLoading }) => {
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      onSubmit(websiteUrl);
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
      <h3 className="font-medium mb-3">Website Lookup</h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="Company Website URL"
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition-opacity"
          disabled={isLoading || !websiteUrl}
        >
          Lookup
        </button>
      </form>
    </div>
  );
};
