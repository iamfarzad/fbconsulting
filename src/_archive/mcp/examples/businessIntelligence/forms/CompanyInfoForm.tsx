
import React, { useState } from 'react';
import { BusinessData } from '../../../protocols/businessIntelligence';

interface CompanyInfoFormProps {
  onSubmit: (companyInfo: Partial<BusinessData>) => void;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ onSubmit }) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName) {
      onSubmit({ companyName });
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
      <h3 className="font-medium mb-3">Manual Company Update</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
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
  );
};
