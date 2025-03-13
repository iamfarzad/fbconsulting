
import React from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import { usePersonaManagement } from '../../mcp/hooks/usePersonaManagement';

interface CopilotProviderProps {
  children: React.ReactNode;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const { personaData } = usePersonaManagement();
  
  // Get the current persona instructions
  const getCurrentPersonaInstructions = () => {
    const currentPersona = personaData.currentPersona;
    const personaDetails = personaData.personaDefinitions[currentPersona];
    
    return `
      You are Farzad AI Assistant, an AI consultant for F.B Consulting. 
      Currently using the "${personaDetails.name}" persona.
      
      Tone: ${personaDetails.tone}
      
      Focus Areas:
      ${personaDetails.focusAreas.map(area => `- ${area}`).join('\n')}
      
      Additional Context:
      - User Role: ${personaData.userRole || 'Unknown'}
      - User Industry: ${personaData.userIndustry || 'Unknown'}
      - User Technical Level: ${personaData.userTechnicalLevel || 'beginner'}
      - Current Page: ${personaData.currentPage || '/'}
      
      Remember to adjust your responses based on the user's technical level and industry context.
    `;
  };

  // Get the Azure API configuration from environment variables
  const apiKey = import.meta.env.VITE_AZURE_API_KEY || '';
  const endpoint = import.meta.env.VITE_AZURE_ENDPOINT || '';
  
  return (
    <CopilotKit
      apiKey={apiKey}
      endpoint={endpoint} 
      chatOptions={{
        temperature: 0.7,
        maxTokens: 2000,
        systemMessage: getCurrentPersonaInstructions(),
      }}
    >
      {children}
    </CopilotKit>
  );
};
