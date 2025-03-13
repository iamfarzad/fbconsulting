
import React from 'react';
import { BusinessData } from '../../../protocols/businessIntelligence';

interface CompanyInfoDisplayProps {
  businessData: BusinessData;
}

export const CompanyInfoDisplay: React.FC<CompanyInfoDisplayProps> = ({ businessData }) => {
  return (
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
  );
};
