
import React from 'react';

interface ActionButtonsProps {
  determineOptimalPersona: () => void;
  resetPersona: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  determineOptimalPersona,
  resetPersona
}) => {
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <button
        onClick={determineOptimalPersona}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Determine Optimal Persona
      </button>
      
      <button
        onClick={resetPersona}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Reset to Default
      </button>
    </div>
  );
};
