
/**
 * Business Intelligence Component
 * A test component for demonstrating the Business Intelligence MCP
 */

import React from 'react';
import { LinkedInLookupForm } from './forms/LinkedInLookupForm';
import { WebsiteLookupForm } from './forms/WebsiteLookupForm';
import { CompanyInfoForm } from './forms/CompanyInfoForm';
import { ContactInfoForm } from './forms/ContactInfoForm';
import { BusinessDataDisplay } from './display/BusinessDataDisplay';
import { useBusinessIntelligence } from '../../hooks/useBusinessIntelligence';

export const BusinessIntelligenceComponent: React.FC = () => {
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
      <LinkedInLookupForm onSubmit={lookupLinkedIn} isLoading={isLoading} />
      
      {/* Website lookup form */}
      <WebsiteLookupForm onSubmit={lookupWebsite} isLoading={isLoading} />
      
      {/* Manual update forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyInfoForm onSubmit={setCompanyInfo} />
        <ContactInfoForm onSubmit={setContactInfo} />
      </div>
      
      {/* Business data display */}
      <BusinessDataDisplay businessData={businessData} onClearData={clearData} />
    </div>
  );
};
