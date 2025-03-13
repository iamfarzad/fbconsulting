
import React, { useState } from 'react';
import { BusinessData } from '../../../protocols/businessIntelligence';

interface ContactInfoFormProps {
  onSubmit: (contactInfo: Partial<BusinessData['contact']>) => void;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ onSubmit }) => {
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName || contactTitle) {
      onSubmit({ 
        name: contactName, 
        title: contactTitle 
      });
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
      <h3 className="font-medium mb-3">Manual Contact Update</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
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
  );
};
