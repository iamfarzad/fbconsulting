
/**
 * Business Intelligence Component
 * A test component for demonstrating the Business Intelligence MCP
 */

import React, { useState } from 'react';
import { useBusinessIntelligence } from '../hooks/useBusinessIntelligence';

export const BusinessIntelligenceComponent: React.FC = () => {
  // Form inputs
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('');

  // Use our business intelligence hook
  const {
    businessData,
    lookupLinkedIn,
    lookupWebsite,
    setCompanyInfo,
    setContactInfo,
    clearData,
    isLoading,
    error
  } = useBusinessIntelligence();

  // Handle LinkedIn lookup
  const handleLinkedInLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkedInUrl) {
      lookupLinkedIn(linkedInUrl);
    }
  };

  // Handle website lookup
  const handleWebsiteLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      lookupWebsite(websiteUrl);
    }
  };

  // Handle manual company info update
  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyInfo({ companyName });
  };

  // Handle manual contact info update
  const handleContactUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo({ 
      name: contactName, 
      title: contactTitle 
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-black/80 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Business Intelligence MCP Example</h2>
      
      {/* Loading and error states */}
      {isLoading && (
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded mb-4">
          Loading business data...
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {/* LinkedIn lookup form */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
        <h3 className="font-medium mb-3">LinkedIn Lookup</h3>
        <form onSubmit={handleLinkedInLookup} className="flex space-x-2">
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
      
      {/* Website lookup form */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
        <h3 className="font-medium mb-3">Website Lookup</h3>
        <form onSubmit={handleWebsiteLookup} className="flex space-x-2">
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
      
      {/* Manual update forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
          <h3 className="font-medium mb-3">Manual Company Update</h3>
          <form onSubmit={handleCompanyUpdate} className="space-y-2">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={!companyName}
            >
              Update Company
            </button>
          </form>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
          <h3 className="font-medium mb-3">Manual Contact Update</h3>
          <form onSubmit={handleContactUpdate} className="space-y-2">
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 mb-2"
            />
            <input
              type="text"
              value={contactTitle}
              onChange={(e) => setContactTitle(e.target.value)}
              placeholder="Contact Title (e.g., CEO, CTO)"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={!contactName && !contactTitle}
            >
              Update Contact
            </button>
          </form>
        </div>
      </div>
      
      {/* Business data display */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Business Data</h3>
          <button
            onClick={clearData}
            className="py-1 px-3 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear Data
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Company Information</h4>
            <dl className="space-y-1">
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Name:</dt>
                <dd>{businessData.companyName || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Website:</dt>
                <dd>{businessData.companyWebsite || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Industry:</dt>
                <dd>{businessData.industry || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Size:</dt>
                <dd>{businessData.companySize || businessData.employeeCount || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Founded:</dt>
                <dd>{businessData.founded || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">HQ:</dt>
                <dd>{businessData.headquarters || 'N/A'}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-2">Contact Information</h4>
            <dl className="space-y-1">
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Name:</dt>
                <dd>{businessData.contact?.name || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Title:</dt>
                <dd>{businessData.contact?.title || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Role:</dt>
                <dd>{businessData.contact?.role || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">Department:</dt>
                <dd>{businessData.contact?.department || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500 dark:text-gray-400">LinkedIn:</dt>
                <dd>{businessData.linkedInProfile || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span>Data confidence:</span>
            <span>{Math.round((businessData.confidenceScore || 0) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-1">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${Math.round((businessData.confidenceScore || 0) * 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {businessData.lastUpdated ? new Date(businessData.lastUpdated).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>
    </div>
  );
};
