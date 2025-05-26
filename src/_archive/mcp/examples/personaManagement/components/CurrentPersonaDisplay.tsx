
import React from 'react';
import { PersonaType } from '../../../protocols/personaManagement';

interface CurrentPersonaDisplayProps {
  currentPersona: PersonaType;
  personaDefinitions: Record<PersonaType, {
    name: string;
    description: string;
    tone: string;
    focusAreas: string[];
    samplePhrases: string[];
  }>;
}

export const CurrentPersonaDisplay: React.FC<CurrentPersonaDisplayProps> = ({ 
  currentPersona, 
  personaDefinitions 
}) => {
  const getCurrentPersonaDetails = () => personaDefinitions[currentPersona];
  const details = getCurrentPersonaDetails();
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <h3 className="text-xl font-semibold mb-2">Current Persona: {details.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-2">{details.description}</p>
      <p className="mb-2"><strong>Tone:</strong> {details.tone}</p>
      
      <div className="mt-3">
        <h4 className="font-medium mb-1">Focus Areas:</h4>
        <ul className="list-disc pl-5 mb-3">
          {details.focusAreas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-3">
        <h4 className="font-medium mb-1">Sample Phrases:</h4>
        <ul className="list-disc pl-5">
          {details.samplePhrases.map((phrase, index) => (
            <li key={index} className="italic text-sm">{phrase}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
