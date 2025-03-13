
import React from 'react';
import { BusinessData } from '../../../protocols/businessIntelligence';
import { CompanyInfoDisplay } from './CompanyInfoDisplay';
import { ContactInfoDisplay } from './ContactInfoDisplay';
import { ConfidenceScoreDisplay } from './ConfidenceScoreDisplay';

interface BusinessDataDisplayProps {
  businessData: BusinessData;
  onClearData: () => void;
}

export const BusinessDataDisplay: React.FC<BusinessDataDisplayProps> = ({ 
  businessData, 
  onClearData 
}) => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Business Data</h3>
        <button
          onClick={onClearData}
          className="py-1 px-3 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyInfoDisplay businessData={businessData} />
        <ContactInfoDisplay contactData={businessData.contact} linkedInProfile={businessData.linkedInProfile} />
      </div>
      
      <ConfidenceScoreDisplay 
        confidenceScore={businessData.confidenceScore} 
        lastUpdated={businessData.lastUpdated} 
      />
    </div>
  );
};
