
import React from 'react';

interface UserContextFormProps {
  title: string;
  value: string;
  currentValue: string | undefined;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
}

export const UserContextForm: React.FC<UserContextFormProps> = ({
  title,
  value,
  currentValue,
  onChange,
  onSubmit,
  placeholder
}) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="w-full p-2 mb-2 border rounded-md"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Set {title}
          </button>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Current: {currentValue || '(not set)'}
          </span>
        </div>
      </form>
    </div>
  );
};
