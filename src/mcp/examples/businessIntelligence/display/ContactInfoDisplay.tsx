
import React from 'react';
import { BusinessData } from '../../../protocols/businessIntelligence';

interface ContactInfoDisplayProps {
  contactData?: BusinessData['contact'];
  linkedInProfile?: string;
}

export const ContactInfoDisplay: React.FC<ContactInfoDisplayProps> = ({ 
  contactData, 
  linkedInProfile 
}) => {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">Contact Information</h4>
      <dl className="space-y-1">
        <div className="flex">
          <dt className="w-32 text-gray-500 dark:text-gray-400">Name:</dt>
          <dd>{contactData?.name || 'N/A'}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 text-gray-500 dark:text-gray-400">Title:</dt>
          <dd>{contactData?.title || 'N/A'}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 text-gray-500 dark:text-gray-400">Role:</dt>
          <dd>{contactData?.role || 'N/A'}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 text-gray-500 dark:text-gray-400">Department:</dt>
          <dd>{contactData?.department || 'N/A'}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 text-gray-500 dark:text-gray-400">LinkedIn:</dt>
          <dd>{linkedInProfile || 'N/A'}</dd>
        </div>
      </dl>
    </div>
  );
};
