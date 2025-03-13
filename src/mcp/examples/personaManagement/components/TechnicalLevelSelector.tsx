
import React from 'react';

interface TechnicalLevelSelectorProps {
  technicalLevel: 'beginner' | 'intermediate' | 'expert';
  currentLevel: string | undefined;
  onChange: (level: 'beginner' | 'intermediate' | 'expert') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TechnicalLevelSelector: React.FC<TechnicalLevelSelectorProps> = ({
  technicalLevel,
  currentLevel,
  onChange,
  onSubmit
}) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-3">Technical Level</h3>
      <form onSubmit={onSubmit}>
        <select
          className="w-full p-2 mb-2 border rounded-md"
          value={technicalLevel}
          onChange={(e) => onChange(e.target.value as 'beginner' | 'intermediate' | 'expert')}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Set Level
          </button>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Current: {currentLevel || '(not set)'}
          </span>
        </div>
      </form>
    </div>
  );
};
