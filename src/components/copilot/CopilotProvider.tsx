
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
  
  return (
    <CopilotKit
      aiProvider={{
        id: "azure-openai",
        // Note: In a real implementation these would be environment variables
        apiKey: "AZURE_API_KEY_PLACEHOLDER",
        endpoint: "AZURE_ENDPOINT_PLACEHOLDER",
      }}
      options={{
        systemMessage: getCurrentPersonaInstructions(),
        interfaces: {
          chatInterface: true,
        },
      }}
    >
      {children}
    </CopilotKit>
  );
};
