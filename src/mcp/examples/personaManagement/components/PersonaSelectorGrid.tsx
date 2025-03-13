
import React from 'react';
import { PersonaType } from '../../../protocols/personaManagement';

interface PersonaSelectorGridProps {
  currentPersona: PersonaType;
  personaDefinitions: Record<PersonaType, { name: string }>;
  setCurrentPersona: (persona: PersonaType) => void;
}

export const PersonaSelectorGrid: React.FC<PersonaSelectorGridProps> = ({
  currentPersona,
  personaDefinitions,
  setCurrentPersona
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Manually Select Persona</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.keys(personaDefinitions).map((persona) => (
          <button
            key={persona}
            className={`p-2 rounded-md border transition-colors ${
              currentPersona === persona
                ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setCurrentPersona(persona as PersonaType)}
          >
            {personaDefinitions[persona as PersonaType].name}
          </button>
        ))}
      </div>
    </div>
  );
};
